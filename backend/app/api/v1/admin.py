from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.core.deps import require_role
from backend.app.models.user import User, Student, Teacher
from backend.app.models.security import AuditLog
from backend.app.models.enums import UserRole, UserStatus

router = APIRouter(prefix="/admin", tags=["Institutional Administration"])

class RejectReasonPayload(BaseModel):
    reason: str

@router.get("/pending-approvals")
def get_pending_approvals(
    current_admin: User = Depends(require_role(UserRole.ADMINISTRATOR, UserRole.SUPERADMIN)),
    db: Session = Depends(get_db),
):
    """
    Returns pending student identity enrollments and teacher registration requests for institutional approval.
    """
    pending_students = (
        db.query(Student)
        .join(User)
        .filter(User.status == UserStatus.PENDING_ADMIN_APPROVAL)
        .all()
    )

    pending_teachers = (
        db.query(Teacher)
        .join(User)
        .filter(User.status.in_([UserStatus.PENDING_ADMIN_APPROVAL, UserStatus.PENDING_EMAIL_VERIFICATION]))
        .all()
    )

    return {
        "students": [
            {
                "student_id": s.id,
                "user_id": s.user.id,
                "name": s.user.full_name,
                "email": s.user.email,
                "enrollment_number": s.enrollment_number,
                "section": s.section,
                "id_verified": s.id_verified,
                "face_verified": s.face_verified,
                "biometric_consent": s.biometric_consent,
                "status": s.user.status.value,
            }
            for s in pending_students
        ],
        "teachers": [
            {
                "teacher_id": t.id,
                "user_id": t.user.id,
                "name": t.user.full_name,
                "email": t.user.email,
                "faculty_id": t.faculty_id,
                "designation": t.designation,
                "verified_by_admin": t.verified_by_admin,
                "status": t.user.status.value,
            }
            for t in pending_teachers
        ],
    }

@router.post("/students/{student_id}/approve")
def approve_student(
    student_id: str,
    request: Request,
    current_admin: User = Depends(require_role(UserRole.ADMINISTRATOR, UserRole.SUPERADMIN)),
    db: Session = Depends(get_db),
):
    """
    Approves a student's institutional identity enrollment.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found.")

    student.user.status = UserStatus.APPROVED
    student.user.is_verified = True

    client_ip = request.client.host if request.client else "unknown"
    audit = AuditLog(
        user_id=current_admin.id,
        user_email=current_admin.email,
        role=current_admin.role.value,
        action="Admin Approved Student Registration",
        resource="Student",
        target_id=student.id,
        ip_address=client_ip,
        details=f"Student {student.user.full_name} ({student.enrollment_number}) approved by administrator.",
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": f"Student {student.user.full_name} has been approved.",
        "status": student.user.status.value,
    }

@router.post("/students/{student_id}/reject")
def reject_student(
    student_id: str,
    payload: RejectReasonPayload,
    request: Request,
    current_admin: User = Depends(require_role(UserRole.ADMINISTRATOR, UserRole.SUPERADMIN)),
    db: Session = Depends(get_db),
):
    """
    Rejects a student's enrollment with documented reason.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found.")

    student.user.status = UserStatus.REJECTED

    client_ip = request.client.host if request.client else "unknown"
    audit = AuditLog(
        user_id=current_admin.id,
        user_email=current_admin.email,
        role=current_admin.role.value,
        action="Admin Rejected Student Registration",
        resource="Student",
        target_id=student.id,
        ip_address=client_ip,
        details=f"Rejection Reason: {payload.reason}",
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": f"Student {student.user.full_name} enrollment was rejected.",
        "status": student.user.status.value,
    }

@router.post("/teachers/{teacher_id}/approve")
def approve_teacher(
    teacher_id: str,
    request: Request,
    current_admin: User = Depends(require_role(UserRole.ADMINISTRATOR, UserRole.SUPERADMIN)),
    db: Session = Depends(get_db),
):
    """
    Approves a faculty member's institutional account.
    """
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher profile not found.")

    teacher.verified_by_admin = True
    teacher.user.status = UserStatus.APPROVED
    teacher.user.is_verified = True

    client_ip = request.client.host if request.client else "unknown"
    audit = AuditLog(
        user_id=current_admin.id,
        user_email=current_admin.email,
        role=current_admin.role.value,
        action="Admin Approved Teacher Account",
        resource="Teacher",
        target_id=teacher.id,
        ip_address=client_ip,
        details=f"Faculty member {teacher.user.full_name} ({teacher.faculty_id}) verified and activated.",
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": f"Faculty member {teacher.user.full_name} has been approved.",
        "status": teacher.user.status.value,
    }

