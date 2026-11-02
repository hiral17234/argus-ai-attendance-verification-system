import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  BookOpen,
  User,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { MOCK_SUBJECTS } from '../lib/mockData'

export const Route = createFileRoute('/student/subject-details')({
  component: StudentSubjectDetailsPage,
})

function StudentSubjectDetailsPage() {
  const [selectedSubIndex, setSelectedSubIndex] = useState(0)
  const subject = MOCK_SUBJECTS[selectedSubIndex]

  const mockPastSessions = [
    { date: '2026-11-01', code: 'MNC-DBMS-241', time: '10:00 AM', status: 'Present', confidence: '96%', risk: 'Low' },
    { date: '2026-10-30', code: 'MNC-DBMS-239', time: '10:00 AM', status: 'Present', confidence: '94%', risk: 'Low' },
    { date: '2026-10-28', code: 'MNC-DBMS-237', time: '10:00 AM', status: 'Late', confidence: '91%', risk: 'Low' },
    { date: '2026-10-25', code: 'MNC-DBMS-234', time: '10:00 AM', status: 'Present', confidence: '95%', risk: 'Low' },
    { date: '2026-10-23', code: 'MNC-DBMS-231', time: '10:00 AM', status: 'Absent', confidence: '-', risk: '-' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/student/subjects" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Subjects</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-mono">{subject.code}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">{subject.name}</h1>
          <p className="text-xs text-slate-400">
            Faculty: <strong className="text-slate-200">{subject.teacherName}</strong> • {subject.department} •{' '}
            {subject.credits} Credits
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Switch Subject:</span>
          <select
            value={selectedSubIndex}
            onChange={(e) => setSelectedSubIndex(Number(e.target.value))}
            className="h-9 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {MOCK_SUBJECTS.map((s, idx) => (
              <option key={s.id} value={idx}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AttendanceCard
          title="Course Attendance"
          value={`${subject.attendanceRate}%`}
          subtitle={subject.attendanceRate >= 75 ? 'Meets threshold' : 'Below 75% required'}
          variant={subject.attendanceRate >= 75 ? 'success' : 'danger'}
          icon="percent"
        />
        <AttendanceCard
          title="Attended"
          value={subject.attendedClasses}
          subtitle={`Out of ${subject.totalClasses} conducted`}
          variant="primary"
          icon="check"
        />
        <AttendanceCard
          title="Missed"
          value={subject.missedClasses}
          subtitle="Unexcused absences"
          variant="danger"
          icon="cross"
        />
        <AttendanceCard
          title="Late Check-ins"
          value={subject.lateClasses}
          subtitle="Counted towards score"
          variant="warning"
          icon="clock"
        />
      </div>

      {/* Past Sessions Audit List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Conducted Sessions History</span>
          </h3>
          <Link to="/student/appeals" className="text-xs text-emerald-400 hover:text-emerald-300">
            Submit session appeal →
          </Link>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Session Code</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Recorded Status</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockPastSessions.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300">{s.date}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">{s.code}</td>
                  <td className="py-3 px-4 text-slate-400">{s.time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'Present'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : s.status === 'Late'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{s.confidence}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{s.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
