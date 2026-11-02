from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class ValidateLivePhotoRequest(BaseModel):
    image_base64: str = Field(..., min_length=50)

class ValidateIdCardRequest(BaseModel):
    image_base64: str = Field(..., min_length=50)
    expected_name: Optional[str] = None
    expected_enrollment: Optional[str] = None

class SubmitEnrollmentRequest(BaseModel):
    live_photo_base64: str = Field(..., min_length=50)
    id_card_base64: str = Field(..., min_length=50)
    biometric_consent: bool = Field(..., description="Student explicit consent for biometric vector template storage")

class EnrollmentResponse(BaseModel):
    success: bool
    message: str
    status: str
    enrollment_id: Optional[str] = None

