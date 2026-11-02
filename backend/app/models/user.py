import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base
from backend.app.models.enums import UserRole, UserStatus

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(30), nullable=True)
    role = Column(SAEnum(UserRole), nullable=False, index=True)
    status = Column(SAEnum(UserStatus), default=UserStatus.PENDING_EMAIL_VERIFICATION, nullable=False, index=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    
    institution_id = Column(String(36), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    department_id = Column(String(36), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    institution = relationship("Institution", back_populates="users")
    department = relationship("Department", back_populates="users")
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile = relationship("Teacher", back_populates="user", uselist=False, cascade="all, delete-orphan")
    admin_profile = relationship("Administrator", back_populates="user", uselist=False, cascade="all, delete-orphan")
    devices = relationship("RegisteredDevice", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")

class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    enrollment_number = Column(String(50), unique=True, nullable=False, index=True)
    roll_number = Column(String(50), nullable=True, index=True)
    semester_id = Column(String(36), ForeignKey("semesters.id", ondelete="SET NULL"), nullable=True)
    section = Column(String(10), default="A", nullable=False)
    date_of_birth = Column(String(20), nullable=True)
    
    # ID & Face Enrollment Data
    id_card_image_url = Column(String(500), nullable=True)
    live_photo_url = Column(String(500), nullable=True)
    id_ocr_extracted_data = Column(Text, nullable=True)  # JSON-encoded OCR payload
    id_verified = Column(Boolean, default=False, nullable=False)
    face_verified = Column(Boolean, default=False, nullable=False)
    biometric_consent = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="student_profile")
    semester = relationship("Semester", back_populates="students")
    enrollments = relationship("StudentCourseEnrollment", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("AttendanceRecord", back_populates="student")
    verification_attempts = relationship("VerificationAttempt", back_populates="student")
    biometric_profile = relationship("BiometricEnrollment", back_populates="student", uselist=False, cascade="all, delete-orphan")
    appeals = relationship("AttendanceAppeal", back_populates="student")

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    faculty_id = Column(String(50), unique=True, nullable=False, index=True)
    designation = Column(String(100), default="Assistant Professor", nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    verified_by_admin = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="teacher_profile")
    assignments = relationship("TeacherCourseAssignment", back_populates="teacher", cascade="all, delete-orphan")
    sessions = relationship("AttendanceSession", back_populates="teacher")
    schedules = relationship("ClassSchedule", back_populates="teacher")

class Administrator(Base):
    __tablename__ = "administrators"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    admin_level = Column(String(50), default="Institutional Administrator", nullable=False)
    permissions = Column(Text, nullable=True)  # JSON-encoded permission scope

    user = relationship("User", back_populates="admin_profile")

