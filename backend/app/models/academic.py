import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Course(Base):
    __tablename__ = "courses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    department_id = Column(String(36), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(50), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    degree_type = Column(String(50), default="B.Tech", nullable=False)  # B.Tech, M.Tech, Ph.D.
    total_semesters = Column(Integer, default=8, nullable=False)

    department = relationship("Department", back_populates="courses")
    subjects = relationship("Subject", back_populates="course", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    course_id = Column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    code = Column(String(50), nullable=False, index=True)  # e.g. "CS601"
    name = Column(String(255), nullable=False)  # e.g. "Database Management Systems"
    credits = Column(Integer, default=4, nullable=False)

    course = relationship("Course", back_populates="subjects")
    teacher_assignments = relationship("TeacherCourseAssignment", back_populates="subject", cascade="all, delete-orphan")
    student_enrollments = relationship("StudentCourseEnrollment", back_populates="subject", cascade="all, delete-orphan")
    schedules = relationship("ClassSchedule", back_populates="subject", cascade="all, delete-orphan")
    sessions = relationship("AttendanceSession", back_populates="subject")

class TeacherCourseAssignment(Base):
    __tablename__ = "teacher_course_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    teacher_id = Column(String(36), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    semester_id = Column(String(36), ForeignKey("semesters.id", ondelete="SET NULL"), nullable=True)
    section = Column(String(10), default="A", nullable=False)
    academic_year_id = Column(String(36), ForeignKey("academic_years.id", ondelete="SET NULL"), nullable=True)
    assigned_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    teacher = relationship("Teacher", back_populates="assignments")
    subject = relationship("Subject", back_populates="teacher_assignments")

class StudentCourseEnrollment(Base):
    __tablename__ = "student_course_enrollments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    student_id = Column(String(36), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    semester_id = Column(String(36), ForeignKey("semesters.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    enrolled_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="enrollments")
    subject = relationship("Subject", back_populates="student_enrollments")

class ClassSchedule(Base):
    __tablename__ = "class_schedules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    subject_id = Column(String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(String(36), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(String(20), nullable=False)  # Monday, Tuesday, etc.
    start_time = Column(String(10), nullable=False)  # "10:00"
    end_time = Column(String(10), nullable=False)    # "11:00"
    room = Column(String(100), default="LH-204", nullable=False)
    section = Column(String(10), default="A", nullable=False)
    expected_student_count = Column(Integer, default=65, nullable=False)

    subject = relationship("Subject", back_populates="schedules")
    teacher = relationship("Teacher", back_populates="schedules")
    sessions = relationship("AttendanceSession", back_populates="schedule")

