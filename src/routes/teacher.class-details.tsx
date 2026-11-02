import { createFileRoute, Link } from '@tanstack/react-router'
import { GraduationCap, Users, Clock, Video, FileSpreadsheet, BarChart3, ArrowLeft } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AttendanceCard } from '../components/attendance/AttendanceCard'

export const Route = createFileRoute('/teacher/class-details')({
  component: TeacherClassDetailsPage,
})

function TeacherClassDetailsPage() {
  const recentSessions = [
    { date: '2026-11-01', code: 'MNC-DBMS-241', present: 38, review: 3, late: 4, rejected: 1, rate: '87.5%' },
    { date: '2026-10-30', code: 'MNC-DBMS-239', present: 42, review: 1, late: 2, rejected: 0, rate: '91.3%' },
    { date: '2026-10-28', code: 'MNC-DBMS-237', present: 40, review: 2, late: 3, rejected: 0, rate: '89.1%' },
    { date: '2026-10-25', code: 'MNC-DBMS-234', present: 41, review: 0, late: 2, rejected: 0, rate: '93.5%' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/teacher/classes" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Classes</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400">B.Tech CSE - 6th Sem (A)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Database Management Systems (CS601) - Section A
          </h1>
          <p className="text-xs text-slate-400">48 Enrolled Students • Room LH-204 • Schedule: Mon, Wed, Fri 10:00 AM</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link to="/teacher/create-session">
            <Button variant="primary" size="sm">
              <Video className="w-4 h-4 mr-1.5" />
              <span>Start Session</span>
            </Button>
          </Link>
          <Link to="/teacher/attendance-register">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="w-4 h-4 mr-1.5" />
              <span>Register</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AttendanceCard
          title="Class Average Attendance"
          value="88.8%"
          subtitle="Cohort benchmark"
          variant="success"
          icon="percent"
        />
        <AttendanceCard
          title="Total Conducted"
          value="36"
          subtitle="Lectures & Lab sessions"
          variant="default"
          icon="clock"
        />
        <AttendanceCard
          title="Students in Good Standing"
          value="45"
          subtitle="Above 75% threshold"
          variant="primary"
          icon="check"
        />
        <AttendanceCard
          title="Shortage Risk Students"
          value="3"
          subtitle="Debarment warning"
          variant="danger"
          icon="alert"
        />
      </div>

      {/* Recent Class Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Conducted Attendance Sessions</h3>
          <Link to="/teacher/history" className="text-xs text-emerald-400 hover:text-emerald-300">
            View full session archive →
          </Link>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Present</th>
                <th className="py-3 px-4">Late</th>
                <th className="py-3 px-4">Flagged Review</th>
                <th className="py-3 px-4">Rejected</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentSessions.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-300">{s.date}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{s.code}</td>
                  <td className="py-3 px-4 text-emerald-400 font-mono">{s.present}</td>
                  <td className="py-3 px-4 text-amber-400 font-mono">{s.late}</td>
                  <td className="py-3 px-4 text-amber-300 font-mono">{s.review}</td>
                  <td className="py-3 px-4 text-rose-400 font-mono">{s.rejected}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{s.rate}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to="/teacher/attendance-register"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      View Log
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
