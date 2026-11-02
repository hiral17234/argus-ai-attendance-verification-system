import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Float, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base
from backend.app.models.enums import AttendanceStatus, RiskLevel, VerificationOutcome, VerificationPolicy, SessionStatus, ChallengeType

def generate_uuid() -> str:
    return str(uuid.uuid4())

class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    schedule_id = Column(String(36), ForeignKey("class_schedules.id", ondelete="SET NULL"), nullable=True)
    subject_id = Column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(String(36), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    
    session_code = Column(String(50), unique=True, nullable=False, index=True)  # Dynamic 6-character/format code
    qr_secret = Column(String(255), nullable=False)  # Cryptographic secret for dynamic rotating QR
    room = Column(String(100), default="Lecture Hall 204", nullable=False)
    date = Column(String(20), nullable=False)  # "YYYY-MM-DD"
    start_time = Column(String(10), nullable=False)  # "HH:MM"
    end_time = Column(String(10), nullable=False)    # "HH:MM"
    
    verification_window_minutes = Column(Integer, default=15, nullable=False)
    late_threshold_minutes = Column(Integer, default=5, nullable=False)
    geofence_radius_meters = Column(Integer, default=150, nullable=False)
    verification_policy = Column(SAEnum(VerificationPolicy), default=VerificationPolicy.ADAPTIVE, nullable=False)
    status = Column(SAEnum(SessionStatus), default=SessionStatus.ACTIVE, nullable=False, index=True)
    
    # Live Aggregated Counts
    total_expected = Column(Integer, default=65, nullable=False)
    present_count = Column(Integer, default=0, nullable=False)
    late_count = Column(Integer, default=0, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    rejected_count = Column(Integer, default=0, nullable=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    closed_at = Column(DateTime(timezone=True), nullable=True)

    schedule = relationship("ClassSchedule", back_populates="sessions")
    subject = relationship("Subject", back_populates="sessions")
    teacher = relationship("Teacher", back_populates="sessions")
    records = relationship("AttendanceRecord", back_populates="session", cascade="all, delete-orphan")
    attempts = relationship("VerificationAttempt", back_populates="session", cascade="all, delete-orphan")
    appeals = relationship("AttendanceAppeal", back_populates="session")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    
    status = Column(SAEnum(AttendanceStatus), default=AttendanceStatus.WAITING, nullable=False, index=True)
    check_in_time = Column(DateTime(timezone=True), nullable=True)
    is_late = Column(Boolean, default=False, nullable=False)
    verified_by = Column(String(100), default="ARGUS Biometric Engine", nullable=False)
    verification_attempt_id = Column(String(36), nullable=True)
    remarks = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    session = relationship("AttendanceSession", back_populates="records")
    student = relationship("Student", back_populates="attendance_records")

class VerificationAttempt(Base):
    __tablename__ = "verification_attempts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # 6 Real Multi-Signal Scores (0.0 to 1.0)
    face_score = Column(Float, default=0.0, nullable=False)
    liveness_score = Column(Float, default=0.0, nullable=False)
    challenge_score = Column(Float, default=0.0, nullable=False)
    image_quality_score = Column(Float, default=0.0, nullable=False)
    device_trust_score = Column(Float, default=0.0, nullable=False)
    location_score = Column(Float, default=0.0, nullable=False)
    
    composite_confidence = Column(Integer, default=0, nullable=False)  # 0 to 100%
    risk_level = Column(SAEnum(RiskLevel), default=RiskLevel.MEDIUM, nullable=False)
    outcome = Column(SAEnum(VerificationOutcome), default=VerificationOutcome.REVIEW, nullable=False)
    
    risk_factors = Column(Text, nullable=True)  # JSON-encoded array of risk strings
    human_explanation = Column(Text, nullable=True)
    challenge_type = Column(SAEnum(ChallengeType), default=ChallengeType.TURN_LEFT, nullable=False)
    
    # Review & Faculty Override Workflow
    reviewer_notes = Column(Text, nullable=True)
    reviewed_by_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    session = relationship("AttendanceSession", back_populates="attempts")
    student = relationship("Student", back_populates="verification_attempts")
    reviewer = relationship("User", foreign_keys=[reviewed_by_id])

