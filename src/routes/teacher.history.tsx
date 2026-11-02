import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { History, Search, Filter, Calendar, FileSpreadsheet, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/teacher/history')({
  component: TeacherHistoryPage,
})

function TeacherHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const historySessions = [
    { id: '1', date: '2026-11-01', code: 'MNC-DBMS-241', subject: 'Database Management Systems', section: 'A', present: 38, late: 4, review: 3, total: 48, rate: '87.5%' },
    { id: '2', date: '2026-10-30', code: 'MNC-DBMS-239', subject: 'Database Management Systems', section: 'A', present: 42, late: 2, review: 1, total: 48, rate: '91.6%' },
    { id: '3', date: '2026-10-28', code: 'MNC-DBMS-237', subject: 'Database Management Systems', section: 'A', present: 40, late: 3, review: 2, total: 48, rate: '89.5%' },
    { id: '4', date: '2026-10-27', code: 'MNC-DSA-112', subject: 'Data Structures & Algorithms', section: 'B', present: 44, late: 1, review: 0, total: 46, rate: '95.6%' },
    { id: '5', date: '2026-10-25', code: 'MNC-DBMS-234', subject: 'Database Management Systems', section: 'A', present: 41, late: 2, review: 0, total: 48, rate: '89.5%' },
  ]

  const filtered = historySessions.filter(
    (s) =>
      s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>Past Attendance Sessions Archive</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical attendance sessions, attendance registers, and biometric telemetry records
          </p>
        </div>

        <Link to="/teacher/reports">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4 mr-1.5" />
            <span>Generate Aggregate Report</span>
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by session code or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Sessions Archive Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Session Code</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Section</th>
              <th className="py-3 px-4">Present</th>
              <th className="py-3 px-4">Late</th>
              <th className="py-3 px-4">Review Flags</th>
              <th className="py-3 px-4">Attendance Rate</th>
              <th className="py-3 px-4 text-right">Register</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-300">{s.date}</td>
                <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{s.code}</td>
                <td className="py-3 px-4 font-semibold text-slate-200">{s.subject}</td>
                <td className="py-3 px-4 text-slate-400">Sec {s.section}</td>
                <td className="py-3 px-4 text-emerald-400 font-mono font-bold">{s.present}</td>
                <td className="py-3 px-4 text-amber-400 font-mono">{s.late}</td>
                <td className="py-3 px-4 text-amber-300 font-mono">{s.review}</td>
                <td className="py-3 px-4 font-mono font-bold text-white">{s.rate}</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to="/teacher/attendance-register"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    View Register
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
