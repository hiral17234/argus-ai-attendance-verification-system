import logging
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine, Base
from backend.app.core.security import hash_password
from backend.app.models.enums import UserRole, UserStatus
from backend.app.models.institution import Institution, Department, AcademicYear, Semester
from backend.app.models.user import User, Student, Teacher, Administrator
from backend.app.models.academic import Course, Subject, TeacherCourseAssignment, StudentCourseEnrollment, ClassSchedule
import backend.app.models  # ensure models registered

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("argus.seed")

def seed_database():
    """
    Seeds initial institutional data and verified accounts with Argon2id passwords.
    All passwords strictly adhere to institutional complexity requirements.
    """
    logger.info("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Institution
        inst = db.query(Institution).filter(Institution.code == "MITS-GWL").first()
        if not inst:
            inst = Institution(
                name="Madhav Institute of Technology & Science",
                code="MITS-GWL",
                domain="mitsgwalior.ac.in",
                address="Racecourse Road, Gwalior, Madhya Pradesh 474005",
            )
            db.add(inst)
            db.flush()
            logger.info("Created Institution: %s", inst.name)

        # 2. Department
        dept = db.query(Department).filter(Department.code == "CSE").first()
        if not dept:
            dept = Department(
                institution_id=inst.id,
                name="Computer Science & Engineering",
                code="CSE",
            )
            db.add(dept)
            db.flush()
            logger.info("Created Department: %s", dept.name)

        # 3. Academic Year & Semester
        acad_year = db.query(AcademicYear).filter(AcademicYear.year_name == "2026-2027").first()
        if not acad_year:
            acad_year = AcademicYear(
                institution_id=inst.id,
                year_name="2026-2027",
                is_current=True,
            )
            db.add(acad_year)
            db.flush()

        sem = db.query(Semester).filter(Semester.academic_year_id == acad_year.id, Semester.number == 6).first()
        if not sem:
            sem = Semester(
                academic_year_id=acad_year.id,
                number=6,
                term_name="Autumn 2026",
            )
            db.add(sem)
            db.flush()

        # 4. Course & Subjects
        course = db.query(Course).filter(Course.code == "BTECH-CSE").first()
        if not course:
            course = Course(
                department_id=dept.id,
                code="BTECH-CSE",
                name="B.Tech Computer Science & Engineering",
                degree_type="B.Tech",
                total_semesters=8,
            )
            db.add(course)
            db.flush()

        sub_dbms = db.query(Subject).filter(Subject.code == "CS601").first()
        if not sub_dbms:
            sub_dbms = Subject(
                course_id=course.id,
                department_id=dept.id,
                code="CS601",
                name="Database Management Systems",
                credits=4,
            )
            db.add(sub_dbms)
            db.flush()

        sub_ml = db.query(Subject).filter(Subject.code == "CS602").first()
        if not sub_ml:
            sub_ml = Subject(
                course_id=course.id,
                department_id=dept.id,
                code="CS602",
                name="Machine Learning & Deep Networks",
                credits=4,
            )
            db.add(sub_ml)
            db.flush()

        # 5. Accounts (Argon2id passwords)
        # Test Administrator Account
        admin_email = "admin@mitsadmin.ac.in"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        if not admin_user:
            admin_user = User(
                email=admin_email,
                hashed_password=hash_password("Admin@Argus2026!"),
                full_name="Prof. R. K. Mukherjee",
                phone_number="+91 98260 11223",
                role=UserRole.ADMINISTRATOR,
                status=UserStatus.APPROVED,
                is_active=True,
                is_verified=True,
                institution_id=inst.id,
                department_id=dept.id,
            )
            db.add(admin_user)
            db.flush()
            admin_profile = Administrator(
                user_id=admin_user.id,
                employee_id="DIR-ACAD-003",
                admin_level="Dean of Academic Computing & Registrar",
            )
            db.add(admin_profile)
            logger.info("Created Seed Administrator: %s", admin_email)

        # Test Teacher Account
        teacher_email = "teacher@mitsgwalior.ac.in"
        teacher_user = db.query(User).filter(User.email == teacher_email).first()
        if not teacher_user:
            teacher_user = User(
                email=teacher_email,
                hashed_password=hash_password("Teacher@Argus2026!"),
                full_name="Dr. Ankit Sharma",
                phone_number="+91 98260 44556",
                role=UserRole.TEACHER,
                status=UserStatus.APPROVED,
                is_active=True,
                is_verified=True,
                institution_id=inst.id,
                department_id=dept.id,
            )
            db.add(teacher_user)
            db.flush()
            teacher_profile = Teacher(
                user_id=teacher_user.id,
                faculty_id="EMP-CS-8812",
                designation="Associate Professor & AI Lab Director",
                department_id=dept.id,
                verified_by_admin=True,
            )
            db.add(teacher_profile)
            db.flush()

            # Assign Teacher to Subject
            assignment = TeacherCourseAssignment(
                teacher_id=teacher_profile.id,
                subject_id=sub_dbms.id,
                semester_id=sem.id,
                section="A",
                academic_year_id=acad_year.id,
            )
            db.add(assignment)

            # Schedule
            schedule = ClassSchedule(
                subject_id=sub_dbms.id,
                teacher_id=teacher_profile.id,
                day_of_week="Monday",
                start_time="10:00",
                end_time="11:00",
                room="LH-204",
                section="A",
                expected_student_count=65,
            )
            db.add(schedule)
            logger.info("Created Seed Teacher: %s", teacher_email)

        # Test Student Account
        student_email = "student@mitsgwl.ac.in"
        student_user = db.query(User).filter(User.email == student_email).first()
        if not student_user:
            student_user = User(
                email=student_email,
                hashed_password=hash_password("Student@Argus2026!"),
                full_name="Hiral Goyal",
                phone_number="+91 98260 77889",
                role=UserRole.STUDENT,
                status=UserStatus.APPROVED,
                is_active=True,
                is_verified=True,
                institution_id=inst.id,
                department_id=dept.id,
            )
            db.add(student_user)
            db.flush()
            student_profile = Student(
                user_id=student_user.id,
                enrollment_number="0901CS221045",
                roll_number="221045",
                semester_id=sem.id,
                section="A",
                id_verified=True,
                face_verified=True,
                biometric_consent=True,
            )
            db.add(student_profile)
            db.flush()

            # Enroll Student in Subject
            enrollment = StudentCourseEnrollment(
                student_id=student_profile.id,
                subject_id=sub_dbms.id,
                semester_id=sem.id,
                is_active=True,
            )
            db.add(enrollment)
            logger.info("Created Seed Student: %s", student_email)

        db.commit()
        logger.info("Database seeding successfully completed!")
    except Exception as exc:
        db.rollback()
        logger.error("Seeding failed: %s", exc)
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

