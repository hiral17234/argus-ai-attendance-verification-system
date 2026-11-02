import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False, index=True)
    domain = Column(String(100), nullable=False)
    address = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    departments = relationship("Department", back_populates="institution", cascade="all, delete-orphan")
    academic_years = relationship("AcademicYear", back_populates="institution", cascade="all, delete-orphan")
    users = relationship("User", back_populates="institution")

class Department(Base):
    __tablename__ = "departments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    institution_id = Column(String(36), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    institution = relationship("Institution", back_populates="departments")
    courses = relationship("Course", back_populates="department", cascade="all, delete-orphan")
    users = relationship("User", back_populates="department")

class AcademicYear(Base):
    __tablename__ = "academic_years"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    institution_id = Column(String(36), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    year_name = Column(String(50), nullable=False)  # e.g. "2026-2027"
    is_current = Column(Boolean, default=True)
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)

    institution = relationship("Institution", back_populates="academic_years")
    semesters = relationship("Semester", back_populates="academic_year", cascade="all, delete-orphan")

class Semester(Base):
    __tablename__ = "semesters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    academic_year_id = Column(String(36), ForeignKey("academic_years.id", ondelete="CASCADE"), nullable=False)
    number = Column(Integer, nullable=False)  # e.g. 1 to 8
    term_name = Column(String(50), nullable=False)  # e.g. "Autumn 2026", "Spring 2027"

    academic_year = relationship("AcademicYear", back_populates="semesters")
    students = relationship("Student", back_populates="semester")

