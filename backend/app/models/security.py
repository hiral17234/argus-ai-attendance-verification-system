import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Float, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import relationship
from backend.app.database import Base
from backend.app.models.enums import UserRole

def generate_uuid() -> str:
    return str(uuid.uuid4())

class BiometricEnrollment(Base):
    __tablename__ = "biometric_enrollments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    live_photo_path = Column(String(500), nullable=True)
    id_card_photo_path = Column(String(500), nullable=True)
    face_embedding = Column(Text, nullable=True)  # JSON-encoded 512-d float array
    embedding_dimension = Column(Integer, default=512, nullable=False)
    model_version = Column(String(50), default="ArcFace-r100-v2", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    enrolled_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="biometric_profile")

class RegisteredDevice(Base):
    __tablename__ = "registered_devices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    device_fingerprint = Column(String(255), nullable=False, index=True)
    device_name = Column(String(100), default="Primary Workstation", nullable=False)
    os = Column(String(50), nullable=True)
    browser = Column(String(50), nullable=True)
    device_type = Column(String(50), default="Desktop", nullable=False)
    ip_address = Column(String(50), nullable=True)
    is_trusted = Column(Boolean, default=True, nullable=False)
    trust_score = Column(Float, default=0.95, nullable=False)
    
    first_registered_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    last_active_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="devices")

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), nullable=False, index=True)
    otp_hash = Column(String(255), nullable=False)
    purpose = Column(String(50), default="registration", nullable=False)  # registration, password_reset
    expires_at = Column(DateTime(timezone=True), nullable=False)
    attempts_count = Column(Integer, default=0, nullable=False)
    max_attempts = Column(Integer, default=5, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token_hash = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    user_email = Column(String(255), nullable=True)
    role = Column(String(50), default="student", nullable=False)
    action = Column(String(100), nullable=False, index=True)
    resource = Column(String(100), nullable=True)
    target_id = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    user = relationship("User", back_populates="audit_logs")

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    event_type = Column(String(100), nullable=False, index=True)  # "unregistered_device", "spoof_attempt", "domain_violation"
    severity = Column(String(20), default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=False)
    user_id = Column(String(36), nullable=True)
    ip_address = Column(String(50), nullable=True)
    event_metadata = Column(Text, nullable=True)  # JSON-encoded metadata
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

