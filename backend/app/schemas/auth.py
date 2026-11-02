from typing import Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field
from backend.app.models.enums import UserRole, UserStatus

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Dict[str, Any]

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_fingerprint: Optional[str] = None
    device_name: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole
    phone_number: Optional[str] = None
    enrollment_number: Optional[str] = None  # Required for students
    roll_number: Optional[str] = None
    section: Optional[str] = "A"
    faculty_id: Optional[str] = None         # Required for teachers
    designation: Optional[str] = None
    department_id: Optional[str] = None

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

class ResendOTPRequest(BaseModel):
    email: EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str = Field(..., min_length=8)

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    status: UserStatus
    is_active: bool
    is_verified: bool
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    institution_id: Optional[str] = None
    department_id: Optional[str] = None
    enrollment_number: Optional[str] = None
    faculty_id: Optional[str] = None

    class Config:
        from_attributes = True

