import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMINISTRATOR = "admin"
    COORDINATOR = "coordinator"
    SECURITY = "security"
    SUPERADMIN = "superadmin"

class UserStatus(str, enum.Enum):
    PENDING_EMAIL_VERIFICATION = "pending_email_verification"
    PENDING_ID_VERIFICATION = "pending_id_verification"
    PENDING_FACE_VERIFICATION = "pending_face_verification"
    PENDING_ADMIN_APPROVAL = "pending_admin_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    LATE = "Late"
    ABSENT = "Absent"
    REVIEW = "Review"
    REJECTED = "Rejected"
    WAITING = "Waiting"
    VERIFYING = "Verifying"

class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class VerificationOutcome(str, enum.Enum):
    ACCEPTED = "ACCEPTED"
    REVIEW = "REVIEW"
    REJECTED = "REJECTED"

class VerificationPolicy(str, enum.Enum):
    STANDARD = "Standard"
    ENHANCED = "Enhanced"
    ADAPTIVE = "Adaptive"

class SessionStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    ENDED = "ended"
    CANCELLED = "cancelled"

class AppealStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class ChallengeType(str, enum.Enum):
    TURN_LEFT = "Turn head left"
    TURN_RIGHT = "Turn head right"
    BLINK = "Blink"
    SMILE = "Smile"
    NOD = "Nod"

