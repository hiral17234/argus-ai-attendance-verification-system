from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.config import settings
from backend.app.core.security import (
    hash_password,
    verify_password,
    validate_password_strength,
    create_access_token,
    create_refresh_token,
    generate_secure_otp,
    hash_token,
    generate_reset_token,
)
from backend.app.core.domains import validate_institutional_email
from backend.app.core.deps import get_current_user
from backend.app.models.user import User, Student, Teacher
from backend.app.models.enums import UserRole, UserStatus
from backend.app.models.security import OTPVerification, PasswordResetToken, AuditLog, RegisteredDevice
from backend.app.schemas.auth import (
    Token,
    LoginRequest,
    RegisterRequest,
    VerifyEmailRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserProfileResponse,
)

router = APIRouter(prefix="/auth", tags=["Institutional Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    """
    Institutional user registration:
    - Enforces institutional email domain (@mitsgwl.ac.in, @mitsgwalior.ac.in).
    - Enforces Argon2 password complexity requirements.
    - Generates and persists a cryptographically secure email verification OTP.
    """
    # 1. Validate institutional domain
    is_valid_domain, domain_msg = validate_institutional_email(req.email, req.role)
    if not is_valid_domain:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=domain_msg)

    # 2. Validate password complexity
    is_valid_pwd, pwd_msg = validate_password_strength(req.password)
    if not is_valid_pwd:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=pwd_msg)

    # 3. Check existing user
    existing_user = db.query(User).filter(User.email == req.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this institutional email is already registered."
        )

    # 4. Hash password with Argon2id
    argon2_hash = hash_password(req.password)

    # 5. Create User entity
    new_user = User(
        email=req.email.lower(),
        hashed_password=argon2_hash,
        full_name=req.full_name,
        phone_number=req.phone_number,
        role=req.role,
        status=UserStatus.PENDING_EMAIL_VERIFICATION,
        is_active=True,
        is_verified=False,
        department_id=req.department_id,
    )
    db.add(new_user)
    db.flush()  # Populates new_user.id

    # 6. Create role-specific profile
    if req.role == UserRole.STUDENT:
        enrollment_no = req.enrollment_number or f"STU-{int(datetime.now().timestamp())}"
        student = Student(
            user_id=new_user.id,
            enrollment_number=enrollment_no,
            roll_number=req.roll_number,
            section=req.section or "A",
        )
        db.add(student)
    elif req.role == UserRole.TEACHER:
        fac_id = req.faculty_id or f"FAC-{int(datetime.now().timestamp())}"
        teacher = Teacher(
            user_id=new_user.id,
            faculty_id=fac_id,
            designation=req.designation or "Assistant Professor",
            department_id=req.department_id,
        )
        db.add(teacher)

    # 7. Generate and hash secure 6-digit OTP
    raw_otp = generate_secure_otp()
    hashed_otp = hash_token(raw_otp)
    otp_record = OTPVerification(
        email=req.email.lower(),
        otp_hash=hashed_otp,
        purpose="registration",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
        max_attempts=settings.OTP_MAX_ATTEMPTS,
        is_used=False,
    )
    db.add(otp_record)

    # 8. Record immutable audit log
    client_ip = request.client.host if request.client else "unknown"
    audit = AuditLog(
        user_id=new_user.id,
        user_email=new_user.email,
        role=new_user.role.value,
        action="User Registered",
        resource="User",
        target_id=new_user.id,
        ip_address=client_ip,
        details=f"Institutional registration initiated for role: {req.role.value}",
    )
    db.add(audit)

    db.commit()

    # Note: In production, raw_otp is dispatched through institutional SMTP/SendGrid.
    # In development mode, raw_otp is exposed in the response only if DEBUG=True for automated testing.
    return {
        "success": True,
        "message": f"Registration successful. A 6-digit verification code has been dispatched to {req.email}.",
        "email": req.email,
        "user_id": new_user.id,
        "dev_otp": raw_otp if settings.DEBUG else None,
    }

@router.post("/verify-email")
def verify_email(req: VerifyEmailRequest, db: Session = Depends(get_db)):
    """
    Verifies the email verification OTP.
    """
    email_clean = req.email.lower()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

    otp_record = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.email == email_clean,
            OTPVerification.purpose == "registration",
            OTPVerification.is_used == False,
        )
        .order_by(OTPVerification.created_at.desc())
        .first()
    )

    if not otp_record:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No active verification OTP found.")

    if datetime.now(timezone.utc) > otp_record.expires_at.replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code has expired. Request a new OTP.")

    if otp_record.attempts_count >= otp_record.max_attempts:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Maximum verification attempts exceeded.")

    provided_hash = hash_token(req.otp)
    if provided_hash != otp_record.otp_hash:
        otp_record.attempts_count += 1
        db.commit()
        remaining = otp_record.max_attempts - otp_record.attempts_count
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid verification code. Attempts remaining: {remaining}"
        )

    # Mark verified
    otp_record.is_used = True
    user.is_verified = True
    user.status = UserStatus.PENDING_ID_VERIFICATION if user.role == UserRole.STUDENT else UserStatus.APPROVED
    db.commit()

    return {
        "success": True,
        "message": "Institutional email verified successfully.",
        "status": user.status.value,
    }

@router.post("/login", response_model=Token)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    """
    Authenticates institutional credentials using Argon2 password verification and issues signed JWTs.
    """
    email_clean = req.email.lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid institutional email or password."
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated.")

    # Record or update device trust
    client_ip = request.client.host if request.client else "unknown"
    if req.device_fingerprint:
        existing_device = (
            db.query(RegisteredDevice)
            .filter(
                RegisteredDevice.user_id == user.id,
                RegisteredDevice.device_fingerprint == req.device_fingerprint,
            )
            .first()
        )
        if existing_device:
            existing_device.last_active_at = datetime.now(timezone.utc)
            existing_device.ip_address = client_ip
        else:
            new_device = RegisteredDevice(
                user_id=user.id,
                device_fingerprint=req.device_fingerprint,
                device_name=req.device_name or "Institutional Client",
                browser=req.browser,
                os=req.os,
                ip_address=client_ip,
                is_trusted=True,
            )
            db.add(new_device)

    # Create tokens
    token_payload = {
        "sub": user.id,
        "email": user.email,
        "role": user.role.value,
        "full_name": user.full_name,
    }
    access_token = create_access_token(token_payload)
    refresh_token = create_refresh_token(token_payload)

    # Audit log
    audit = AuditLog(
        user_id=user.id,
        user_email=user.email,
        role=user.role.value,
        action="User Logged In",
        resource="Auth",
        target_id=user.id,
        ip_address=client_ip,
        details=f"Successful login from IP: {client_ip}",
    )
    db.add(audit)
    db.commit()

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user={
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "status": user.status.value,
            "is_verified": user.is_verified,
            "avatar_url": user.avatar_url,
        },
    )

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiates institutional password reset workflow.
    Generates a secure high-entropy reset token.
    """
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        # Avoid user enumeration in public responses
        return {"success": True, "message": "If this email is registered, password reset instructions have been dispatched."}

    raw_token = generate_reset_token()
    token_hash = hash_token(raw_token)
    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES),
        is_used=False,
    )
    db.add(reset_record)
    db.commit()

    return {
        "success": True,
        "message": "Password reset instructions have been dispatched to your institutional email.",
        "dev_reset_token": raw_token if settings.DEBUG else None,
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Resets password using a verified reset token.
    Enforces password complexity and updates hash with Argon2.
    """
    is_valid, msg = validate_password_strength(req.new_password)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset request.")

    token_hash = hash_token(req.token)
    reset_record = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.is_used == False,
        )
        .first()
    )

    if not reset_record:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token.")

    if datetime.now(timezone.utc) > reset_record.expires_at.replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password reset token has expired.")

    # Update password with Argon2
    user.hashed_password = hash_password(req.new_password)
    reset_record.is_used = True
    db.commit()

    return {"success": True, "message": "Password updated successfully. You may now log in with your new credentials."}

@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Returns the currently authenticated user's profile and institutional permissions.
    """
    enrollment_number = None
    faculty_id = None

    if current_user.role == UserRole.STUDENT and current_user.student_profile:
        enrollment_number = current_user.student_profile.enrollment_number
    elif current_user.role == UserRole.TEACHER and current_user.teacher_profile:
        faculty_id = current_user.teacher_profile.faculty_id

    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        status=current_user.status,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        phone_number=current_user.phone_number,
        avatar_url=current_user.avatar_url,
        institution_id=current_user.institution_id,
        department_id=current_user.department_id,
        enrollment_number=enrollment_number,
        faculty_id=faculty_id,
    )

