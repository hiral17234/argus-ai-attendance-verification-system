export type UserRole = 'student' | 'teacher' | 'admin' | 'coordinator' | 'security' | 'superadmin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  department: string
  enrollmentNo?: string
  employeeId?: string
  semester?: number
  section?: string
  title?: string
}

export type AttendanceStatus =
  | 'Present'
  | 'Late'
  | 'Absent'
  | 'Review'
  | 'Rejected'
  | 'Waiting'
  | 'Verifying'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type VerificationOutcome = 'ACCEPTED' | 'REVIEW' | 'REJECTED'

export interface VerificationSignals {
  faceScore: number // 0 - 1
  livenessScore: number // 0 - 1
  challengeScore: number // 0 - 1
  imageQualityScore: number // 0 - 1
  deviceTrustScore: number // 0 - 1
  locationScore: number // 0 - 1
  compositeConfidence: number // 0 - 100%
  riskLevel: RiskLevel
  riskFactors: string[]
  humanExplanation: string
  challengeType: 'Turn head left' | 'Turn head right' | 'Blink' | 'Smile' | 'Nod'
}

export interface VerificationAttempt {
  id: string
  studentId: string
  studentName: string
  studentEnrollment: string
  studentAvatar?: string
  sessionId: string
  sessionCode: string
  subjectName: string
  timestamp: string
  signals: VerificationSignals
  status: AttendanceStatus
  reviewerNotes?: string
  reviewedBy?: string
  reviewedAt?: string
}

export interface AttendanceSession {
  id: string
  code: string
  subjectId: string
  subjectName: string
  subjectCode: string
  teacherId: string
  teacherName: string
  classId: string
  className: string
  section: string
  room: string
  date: string
  startTime: string
  endTime: string
  durationMinutes: number
  lateThresholdMinutes: number
  status: 'active' | 'scheduled' | 'ended'
  verificationPolicy: 'Standard' | 'Enhanced' | 'Adaptive'
  totalStudents: number
  presentCount: number
  lateCount: number
  reviewCount: number
  rejectedCount: number
  geofenceRadiusMeters: number
}

export interface Subject {
  id: string
  code: string
  name: string
  department: string
  credits: number
  teacherName: string
  totalClasses: number
  attendedClasses: number
  missedClasses: number
  lateClasses: number
  attendanceRate: number
  syllabusProgress?: number
  nextClass?: string
}

export interface TimetableEntry {
  id: string
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
  time: string
  subjectName: string
  subjectCode: string
  teacherName: string
  room: string
  type: 'Lecture' | 'Lab' | 'Tutorial'
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled'
}

export interface Appeal {
  id: string
  studentId: string
  studentName: string
  studentEnrollment: string
  subjectName: string
  sessionDate: string
  reason: 'Wrongly marked absent' | 'Failed verification' | 'Late attendance' | 'Technical issue' | 'Medical exception' | 'Other'
  description: string
  attachmentName?: string
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Resolved'
  submittedTo: string
  submittedAt: string
  updatedAt: string
  reviewerNotes?: string
}

export interface DeviceRecord {
  id: string
  userId: string
  name: string
  type: 'Laptop' | 'Mobile' | 'Tablet' | 'Workstation'
  os: string
  browser: string
  trustStatus: 'Trusted' | 'Known' | 'Unknown' | 'Suspicious' | 'Blocked'
  lastUsed: string
  location: string
  isCurrentDevice?: boolean
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  role: UserRole
  action: string
  target: string
  result: 'Success' | 'Flagged' | 'Denied' | 'Approved' | 'Rejected'
  details: string
  ipAddress: string
}

export interface NotificationItem {
  id: string
  userId: string
  category: 'Attendance' | 'Verification' | 'Appeals' | 'Academic' | 'System' | 'Security'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}
