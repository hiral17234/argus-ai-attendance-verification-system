import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { UserCheck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { AttendanceStatus } from '../lib/types'

export const Route = createFileRoute('/teacher/manual-attendance')({
  component: TeacherManualAttendancePage,
})

function TeacherManualAttendancePage() {
  const navigate = useNavigate()
  const { manualMarkAttendance } = useAttendanceSession()

  const [studentName, setStudentName] = useState('Rahul Sharma')
  const [enrollment, setEnrollment] = useState('0901CS221078')
  const [status, setStatus] = useState<AttendanceStatus>('Present')
  const [reason, setReason] = useState('Approved exception: Student physically identified in Lecture Hall')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    manualMarkAttendance(studentName, enrollment, status, reason)
    setSuccess(true)
    setTimeout(() => {
      navigate({ to: '/teacher/attendance-register' })
    }, 1500)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <UserCheck className="w-6 h-6 text-emerald-400" />
          <span>Manual Attendance Override</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Faculty override requires mandatory reason documentation and is written permanently to institutional audit logs
        </p>
      </div>

      {success ? (
        <Card className="p-8 text-center bg-slate-900 border-emerald-500/40 space-y-3 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Manual Record Stored</h3>
          <p className="text-xs text-slate-400">
            Attendance for {studentName} ({enrollment}) marked as <strong>{status}</strong>. Redirecting to register...
          </p>
        </Card>
      ) : (
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Student Name</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Enrollment Number</label>
              <input
                type="text"
                required
                value={enrollment}
                onChange={(e) => setEnrollment(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Desired Attendance Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Present">Present (Full Attendance)</option>
                <option value="Late">Late Check-in</option>
                <option value="Absent">Absent (Revoke)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Mandatory Justification Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-2"
              >
                <option value="Approved exception: Student physically identified in Lecture Hall">
                  Physical presence confirmed in classroom
                </option>
                <option value="Technical issue: Camera hardware permission failure on student device">
                  Technical failure / Camera glitch
                </option>
                <option value="Verification failure: False rejection due to low classroom lux level">
                  Biometric false rejection / Low lighting
                </option>
                <option value="Teacher correction: Historical roster entry amendment">
                  Teacher error correction
                </option>
                <option value="Other: Department authorized academic dispensation">
                  Official department dispensation
                </option>
              </select>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300">
              Notice: Manual modifications will be recorded with timestamp, your faculty ID (EMP-CS-8812), and client IP address.
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <Link to="/teacher/attendance-register">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="md">
                <span>Save Manual Record</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
