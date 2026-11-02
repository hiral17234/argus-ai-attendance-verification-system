import { createFileRoute, Link } from '@tanstack/react-router'
import { User, ArrowLeft, ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText, Lock } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { MOCK_VERIFICATION_ATTEMPTS } from '../lib/mockData'

export const Route = createFileRoute('/teacher/student-details')({
  component: TeacherStudentDetailsPage,
})

function TeacherStudentDetailsPage() {
  const student = {
    name: 'Hiral Goyal',
    enrollment: '0901CS221045',
    email: 'student@argus.demo',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'A',
    overallAttendance: 88.8,
    attended: 32,
    missed: 3,
    late: 1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/teacher/students" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Students Roster</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-mono">{student.enrollment}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">{student.name}</h1>
          <p className="text-xs text-slate-400">
            {student.department} • Semester {student.semester} (Section {student.section})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/teacher/manual-attendance">
            <Button variant="outline" size="sm">
              <span>+ Manual Override</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AttendanceCard
          title="DBMS Attendance"
          value={`${student.overallAttendance}%`}
          subtitle="Above 75% threshold"
          variant="success"
          icon="percent"
        />
        <AttendanceCard
          title="Attended Classes"
          value={student.attended}
          subtitle="Sessions verified"
          variant="primary"
          icon="check"
        />
        <AttendanceCard
          title="Absences"
          value={student.missed}
          subtitle="Unexcused"
          variant="danger"
          icon="cross"
        />
        <AttendanceCard
          title="Late Check-ins"
          value={student.late}
          subtitle="Within grace period"
          variant="warning"
          icon="clock"
        />
      </div>

      {/* Recent Attempts History */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Recent Biometric Verification Attempts</h3>
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Session Code</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">ArcFace Match</th>
                <th className="py-3 px-4">Liveness</th>
                <th className="py-3 px-4">Device Trust</th>
                <th className="py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_VERIFICATION_ATTEMPTS.slice(0, 3).map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{a.sessionCode}</td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{a.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                    {Math.round(a.signals.faceScore * 100)}%
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-medium">Passed</td>
                  <td className="py-3 px-4 text-slate-300">Trusted Hardware</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {a.signals.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Biometric Privacy Protection Banner */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          Faculty Access Scope: Raw face photographs and continuous video captures are restricted under institutional
          biometric privacy regulations. Instructors have access to computed verification cosine similarities, liveness
          signals, and contextual logs.
        </span>
      </div>
    </div>
  )
}
