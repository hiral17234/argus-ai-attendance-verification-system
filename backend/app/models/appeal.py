import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import relationship
from backend.app.database import Base
from backend.app.models.enums import AppealStatus

def generate_uuid() -> str:
    return str(uuid.uuid4())

class AttendanceAppeal(Base):
    __tablename__ = "attendance_appeals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(String(36), ForeignKey("attendance_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    reason = Column(String(100), nullable=False)  # "Wrongly marked absent", "Failed verification", "Technical issue", etc.
    description = Column(Text, nullable=False)
    evidence_url = Column(String(500), nullable=True)
    status = Column(SAEnum(AppealStatus), default=AppealStatus.PENDING, nullable=False, index=True)
    
    reviewer_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    student = relationship("Student", back_populates="appeals")
    session = relationship("AttendanceSession", back_populates="appeals")
    reviewer = relationship("User", foreign_keys=[reviewer_id])

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="system", nullable=False)  # "attendance", "appeal", "security", "academic"
    is_read = Column(Boolean, default=False, nullable=False)
    link_url = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="notifications")

