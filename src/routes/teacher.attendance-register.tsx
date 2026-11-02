import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { FileSpreadsheet, Search, Filter, Download, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AttendanceTable } from '../components/attendance/AttendanceTable'
import { useAttendanceSession } from '../hooks/useAttendanceSession'

export const Route = createFileRoute('/teacher/attendance-register')({
  component: TeacherAttendanceRegisterPage,
})

function TeacherAttendanceRegisterPage() {
  const { attempts, approveAttempt, rejectAttempt } = useAttendanceSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filtered = attempts.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentEnrollment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <span>Official Attendance Register</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete institutional attendance log across sessions with verification state and manual override records
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/teacher/manual-attendance">
            <Button variant="outline" size="sm">
              <span>+ Manual Attendance Entry</span>
            </Button>
          </Link>
          <Link to="/teacher/reports">
            <Button variant="primary" size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              <span>Export Register</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student by name or enrollment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
          >
            <option value="ALL">All Attendance States</option>
            <option value="Present">Present</option>
            <option value="Late">Late Check-in</option>
            <option value="Review">Pending Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Register Table */}
      <AttendanceTable
        attempts={filtered}
        showActions={true}
        onApprove={(id) => approveAttempt(id, 'Approved via Attendance Register')}
        onReject={(id) => rejectAttempt(id, 'Rejected via Attendance Register')}
      />
    </div>
  )
}
