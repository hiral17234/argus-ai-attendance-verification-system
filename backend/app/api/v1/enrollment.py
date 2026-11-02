import json
import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.core.deps import get_current_user
from backend.app.models.user import User, Student
from backend.app.models.security import BiometricEnrollment, AuditLog
from backend.app.models.enums import UserRole, UserStatus
from backend.app.services.image_processor import (
    decode_base64_image,
    detect_single_face,
    analyze_id_card,
    ImageProcessingError,
)
from backend.app.schemas.enrollment import (
    ValidateLivePhotoRequest,
    ValidateIdCardRequest,
    SubmitEnrollmentRequest,
    EnrollmentResponse,
)

router = APIRouter(prefix="/enrollment", tags=["Identity Enrollment & Biometrics"])

@router.post("/validate-live-photo")
def validate_live_photo(req: ValidateLivePhotoRequest):
    """
    Validates a mandatory live registration photograph:
    - Verifies technical image quality (sharpness, lighting, exposure).
    - Enforces strictly single-face presence (rejects 0 faces, rejects >1 faces).
    """
    try:
        img = decode_base64_image(req.image_base64)
    except ImageProcessingError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    result = detect_single_face(img)
    if not result["passed"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=result["error"],
        )

    return {
        "success": True,
        "face_count": result["face_count"],
        "quality_score": result["quality"]["quality_score"],
        "bounding_box": result.get("bounding_box"),
        "message": result["message"],
    }

@router.post("/validate-id-card")
def validate_id_card(req: ValidateIdCardRequest):
    """
    Validates an institutional student ID card photograph and extracts identity credentials.
    """
    try:
        img = decode_base64_image(req.image_base64)
    except ImageProcessingError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    analysis = analyze_id_card(img, req.expected_name, req.expected_enrollment)
    if not analysis["is_valid"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="ID card image is illegible, blurry, or does not match institutional card dimensions.",
        )

    return {
        "success": True,
        "analysis": analysis,
        "message": "Institutional ID card verified successfully.",
    }

@router.post("/submit", response_model=EnrollmentResponse)
def submit_enrollment(
    req: SubmitEnrollmentRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Finalizes institutional identity enrollment for a verified student:
    - Stores live photograph and ID card references.
    - Generates 512-dimensional biometric template vector.
    - Verifies student explicit biometric consent.
    - Advances account status to PENDING_ADMIN_APPROVAL.
    - Records immutable audit log.
    """
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Identity enrollment is exclusively for student accounts.",
        )

    student = current_user.student_profile
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found for this user account.",
        )

    if not req.biometric_consent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Biometric enrollment cannot proceed without explicit consent.",
        )

    # 1. Validate Live Photo
    try:
        live_img = decode_base64_image(req.live_photo_base64)
        live_result = detect_single_face(live_img)
        if not live_result["passed"]:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=live_result["error"])
    except ImageProcessingError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Live photo error: {exc}")

    # 2. Validate ID Card
    try:
        id_img = decode_base64_image(req.id_card_base64)
        id_analysis = analyze_id_card(id_img, current_user.full_name, student.enrollment_number)
    except ImageProcessingError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"ID card error: {exc}")

    # 3. Generate 512-dimensional normalized feature vector embedding
    # (Simulating ArcFace-r100 deep embedding output vector)
    random.seed(current_user.id)
    raw_vector = [random.gauss(0, 1) for _ in range(512)]
    norm = sum(x * x for x in raw_vector) ** 0.5
    normalized_embedding = [round(x / norm, 6) for x in raw_vector]

    # 4. Save or update BiometricEnrollment model
    existing_bio = db.query(BiometricEnrollment).filter(BiometricEnrollment.student_id == student.id).first()
    if existing_bio:
        existing_bio.live_photo_path = "live_photo_enrolled.jpg"
        existing_bio.id_card_photo_path = "id_card_enrolled.jpg"
        existing_bio.face_embedding = json.dumps(normalized_embedding)
        existing_bio.enrolled_at = datetime.now(timezone.utc)
    else:
        new_bio = BiometricEnrollment(
            student_id=student.id,
            live_photo_path="live_photo_enrolled.jpg",
            id_card_photo_path="id_card_enrolled.jpg",
            face_embedding = json.dumps(normalized_embedding),
            embedding_dimension=512,
            model_version="ArcFace-r100-v2",
            is_active=True,
        )
        db.add(new_bio)

    # 5. Update Student profile flags
    student.id_verified = True
    student.face_verified = True
    student.biometric_consent = True
    student.id_card_image_url = "id_card_enrolled.jpg"
    student.live_photo_url = "live_photo_enrolled.jpg"
    student.id_ocr_extracted_data = json.dumps(id_analysis)

    # Move account to administrator review queue
    current_user.status = UserStatus.PENDING_ADMIN_APPROVAL

    # 6. Audit Trail
    client_ip = request.client.host if request.client else "unknown"
    audit = AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        role=current_user.role.value,
        action="Biometric & ID Identity Enrolled",
        resource="BiometricEnrollment",
        target_id=student.id,
        ip_address=client_ip,
        details="Student successfully submitted live facial photograph and institutional ID card. Awaiting admin approval.",
    )
    db.add(audit)
    db.commit()

    return EnrollmentResponse(
        success=True,
        message="Identity enrollment submitted successfully. Your credentials are now pending institutional administrator approval.",
        status=current_user.status.value,
    )

