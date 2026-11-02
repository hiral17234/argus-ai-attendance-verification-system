import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { History, Search, Filter, ShieldCheck, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { AttendanceTable } from '../components/attendance/AttendanceTable'
import { MOCK_VERIFICATION_ATTEMPTS } from '../lib/mockData'
import { VerificationAttempt } from '../lib/types'

export const Route = createFileRoute('/student/history')({
  component: StudentHistoryPage,
})

function StudentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedAttempt, setSelectedAttempt] = useState<VerificationAttempt | null>(null)

  const filteredAttempts = MOCK_VERIFICATION_ATTEMPTS.filter((att) => {
    const matchesSearch =
      att.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.sessionCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || att.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>Attendance Verification History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of verified sessions, confidence scores, and risk classifications
          </p>
        </div>

        <Link
          to="/student/verify"
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white self-start sm:self-auto"
        >
          + Mark New Attendance
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by subject or session code..."
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
            <option value="ALL">All Outcomes</option>
            <option value="Present">Present (Accepted)</option>
            <option value="Late">Late Check-in</option>
            <option value="Review">Under Teacher Review</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Attendance History Table */}
      <AttendanceTable
        attempts={filteredAttempts}
        onSelectAttempt={(att) => setSelectedAttempt(att)}
      />

      {/* Selected Attempt Quick Inspection Drawer */}
      {selectedAttempt && (
        <Card className="p-5 bg-slate-900 border-emerald-500/30 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verification Inspection: Attempt #{selectedAttempt.id}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedAttempt.subjectName} • {selectedAttempt.timestamp}
              </p>
            </div>
            <button
              onClick={() => setSelectedAttempt(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            {selectedAttempt.signals.humanExplanation}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-mono">
              Confidence: <strong className="text-emerald-400">{selectedAttempt.signals.compositeConfidence}%</strong> •
              Risk: <strong className="text-white">{selectedAttempt.signals.riskLevel}</strong>
            </span>
            <Link
              to="/student/verification-details"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Full Signal Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
