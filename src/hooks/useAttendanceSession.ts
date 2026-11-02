import { useState } from 'react'
import {
  AttendanceSession,
  VerificationAttempt,
  AttendanceStatus,
  Appeal,
  AuditLogEntry,
} from '../lib/types'
import {
  MOCK_ACTIVE_SESSION,
  MOCK_VERIFICATION_ATTEMPTS,
  MOCK_APPEALS,
  MOCK_AUDIT_LOGS,
} from '../lib/mockData'

export function useAttendanceSession() {
  const [activeSession, setActiveSession] = useState<AttendanceSession>(MOCK_ACTIVE_SESSION)
  const [attempts, setAttempts] = useState<VerificationAttempt[]>(MOCK_VERIFICATION_ATTEMPTS)
  const [appeals, setAppeals] = useState<Appeal[]>(MOCK_APPEALS)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOGS)

  // Teacher actions: Approve a flagged attempt
  const approveAttempt = (attemptId: string, reviewerNotes = 'Approved after teacher visual verification') => {
    setAttempts((prev) =>
      prev.map((att) => {
        if (att.id === attemptId) {
          return {
            ...att,
            status: 'Present',
            reviewerNotes,
            reviewedBy: 'Dr. Ankit Sharma',
            reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        }
        return att
      })
    )

    // Log audit entry
    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      userId: 'usr-tea-01',
      userName: 'Dr. Ankit Sharma',
      role: 'teacher',
      action: 'Teacher Approved Attempt',
      target: `Attempt #${attemptId}`,
      result: 'Approved',
      details: reviewerNotes,
      ipAddress: '10.14.22.81',
    }
    setAuditLogs((prev) => [newAudit, ...prev])
  }

  // Teacher actions: Reject a flagged attempt
  const rejectAttempt = (attemptId: string, reason = 'Identity could not be confirmed') => {
    setAttempts((prev) =>
      prev.map((att) => {
        if (att.id === attemptId) {
          return {
            ...att,
            status: 'Rejected',
            reviewerNotes: reason,
            reviewedBy: 'Dr. Ankit Sharma',
            reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        }
        return att
      })
    )

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      userId: 'usr-tea-01',
      userName: 'Dr. Ankit Sharma',
      role: 'teacher',
      action: 'Teacher Rejected Attempt',
      target: `Attempt #${attemptId}`,
      result: 'Rejected',
      details: reason,
      ipAddress: '10.14.22.81',
    }
    setAuditLogs((prev) => [newAudit, ...prev])
  }

  // Teacher actions: Request re-verification
  const requestReverification = (attemptId: string) => {
    setAttempts((prev) =>
      prev.map((att) => {
        if (att.id === attemptId) {
          return {
            ...att,
            status: 'Verifying',
            reviewerNotes: 'Re-verification requested by instructor with high-security gesture challenge.',
          }
        }
        return att
      })
    )
  }

  // Teacher actions: Manual attendance entry or correction
  const manualMarkAttendance = (
    studentName: string,
    enrollment: string,
    status: AttendanceStatus,
    reason: string
  ) => {
    const newAttempt: VerificationAttempt = {
      id: `att-man-${Date.now()}`,
      studentId: `usr-manual-${Date.now()}`,
      studentName,
      studentEnrollment: enrollment,
      sessionId: activeSession.id,
      sessionCode: activeSession.code,
      subjectName: activeSession.subjectName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status,
      reviewerNotes: `Manually marked as ${status}. Reason: ${reason}`,
      reviewedBy: 'Dr. Ankit Sharma',
      reviewedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      signals: {
        faceScore: 1.0,
        livenessScore: 1.0,
        challengeScore: 1.0,
        imageQualityScore: 1.0,
        deviceTrustScore: 1.0,
        locationScore: 1.0,
        compositeConfidence: 100,
        riskLevel: 'LOW',
        riskFactors: ['Manual teacher override'],
        humanExplanation: `Manual attendance recorded by teacher: ${reason}`,
        challengeType: 'Smile',
      },
    }

    setAttempts((prev) => [newAttempt, ...prev])

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      userId: 'usr-tea-01',
      userName: 'Dr. Ankit Sharma',
      role: 'teacher',
      action: 'Manual Attendance Override',
      target: `Student: ${studentName} (${enrollment})`,
      result: 'Success',
      details: `Marked ${status}. Reason: ${reason}`,
      ipAddress: '10.14.22.81',
    }
    setAuditLogs((prev) => [newAudit, ...prev])
  }

  // Student actions: Submit new appeal
  const submitAppeal = (appealData: Omit<Appeal, 'id' | 'submittedAt' | 'updatedAt' | 'status'>) => {
    const newAppeal: Appeal = {
      ...appealData,
      id: `app-${Date.now()}`,
      submittedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      status: 'Pending',
    }
    setAppeals((prev) => [newAppeal, ...prev])
    return newAppeal
  }

  // Teacher actions: Update appeal status
  const updateAppealStatus = (appealId: string, status: Appeal['status'], notes?: string) => {
    setAppeals((prev) =>
      prev.map((app) => (app.id === appealId ? { ...app, status, reviewerNotes: notes, updatedAt: 'Just now' } : app))
    )
  }

  return {
    activeSession,
    setActiveSession,
    attempts,
    setAttempts,
    approveAttempt,
    rejectAttempt,
    requestReverification,
    manualMarkAttendance,
    appeals,
    submitAppeal,
    updateAppealStatus,
    auditLogs,
  }
}
