import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Filter,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { AttendanceChart } from '../components/attendance/AttendanceChart'
import { MOCK_SUBJECTS } from '../lib/mockData'

export const Route = createFileRoute('/student/attendance')({
  component: StudentAttendancePage,
})

function StudentAttendancePage() {
  const [selectedSemester, setSelectedSemester] = useState('6')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <span>My Attendance Records & Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Subject-wise attendance tracking, institutional threshold compliance, and historical trends
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Semester:</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="6">Semester 6 (Current)</option>
            <option value="5">Semester 5</option>
            <option value="4">Semester 4</option>
          </select>
        </div>
      </div>

      {/* Aggregate Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AttendanceCard
          title="Overall Attendance"
          value="87.2%"
          subtitle="Requirement: Min 75%"
          variant="primary"
          icon="percent"
        />
        <AttendanceCard
          title="Attended Classes"
          value="148"
          subtitle="Out of 170 conducted"
          variant="success"
          icon="check"
        />
        <AttendanceCard
          title="Missed Sessions"
          value="19"
          subtitle="Absence count"
          variant="danger"
          icon="cross"
        />
        <AttendanceCard
          title="Late Check-ins"
          value="6"
          subtitle="Flagged by policy"
          variant="warning"
          icon="clock"
        />
      </div>

      {/* Attendance Chart */}
      <AttendanceChart />

      {/* Subject-Wise Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Subject-Wise Performance Breakdown</span>
          </h3>
          <span className="text-xs text-slate-400">Institutional Minimum: 75%</span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Conducted</th>
                <th className="py-3 px-4">Attended</th>
                <th className="py-3 px-4">Missed</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_SUBJECTS.map((sub) => {
                const isShortage = sub.attendanceRate < 75
                return (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-200">{sub.name}</p>
                      <span className="text-[10px] font-mono text-emerald-400">{sub.code}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{sub.teacherName}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{sub.totalClasses}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{sub.attendedClasses}</td>
                    <td className="py-3 px-4 font-mono text-rose-400">{sub.missedClasses}</td>
                    <td className="py-3 px-4">
                      <div className="w-24 space-y-1">
                        <span
                          className={`font-mono font-bold ${
                            isShortage ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {sub.attendanceRate}%
                        </span>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isShortage ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${sub.attendanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isShortage
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {isShortage ? 'Shortage Alert' : 'Good Standing'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/student/subject-details"
                        className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        <span>Inspect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
