import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Users,
  Video,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Eye,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Maximize2,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { VerificationStatus } from '../components/verification/VerificationStatus'
import { RiskBadge } from '../components/verification/RiskBadge'
import { ConfidenceScore } from '../components/verification/ConfidenceScore'
import { Modal } from '../components/ui/modal'
import { VerificationSignalCard } from '../components/verification/VerificationSignalCard'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { VerificationAttempt } from '../lib/types'

export const Route = createFileRoute('/teacher/live')({
  component: TeacherLivePage,
})

function TeacherLivePage() {
  const { activeSession, attempts, approveAttempt, rejectAttempt, requestReverification } = useAttendanceSession()

  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAttempt, setSelectedAttempt] = useState<VerificationAttempt | null>(null)
  const [tickerTime, setTickerTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredAttempts = attempts.filter((att) => {
    const matchesSearch =
      att.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.studentEnrollment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'ALL' || att.status === filter
    return matchesSearch && matchesFilter
  })

  const presentCount = attempts.filter((a) => a.status === 'Present').length
  const lateCount = attempts.filter((a) => a.status === 'Late').length
  const reviewCount = attempts.filter((a) => a.status === 'Review').length
  const rejectedCount = attempts.filter((a) => a.status === 'Rejected').length

  return (
    <div className="space-y-6">
      {/* Live Header with Session Status & Clock */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Live Attendance Radar: {activeSession.subjectName}</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Session Code: <strong className="text-emerald-400 font-mono">{activeSession.code}</strong> •{' '}
            {activeSession.room} • Started {activeSession.startTime}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block font-mono">RADAR CLOCK</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{tickerTime}</span>
          </div>
          <Link to="/teacher/session-qr">
            <Button variant="outline" size="sm">
              <span>Show Projector QR</span>
            </Button>
          </Link>
          <Link to="/teacher/verification-review">
            <Button variant="primary" size="sm" className="relative">
              <span>Review Queue</span>
              {reviewCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                  {reviewCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Real-time Tally Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Verified Present</span>
            <p className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">{presentCount}</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400/80" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Pending Review</span>
            <p className="text-2xl font-extrabold font-mono text-amber-300 mt-1">{reviewCount}</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-amber-400/80" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Late Check-ins</span>
            <p className="text-2xl font-extrabold font-mono text-amber-400 mt-1">{lateCount}</p>
          </div>
          <Clock className="w-6 h-6 text-amber-400/80" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Rejected</span>
            <p className="text-2xl font-extrabold font-mono text-rose-400 mt-1">{rejectedCount}</p>
          </div>
          <XCircle className="w-6 h-6 text-rose-400/80" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
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

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {['ALL', 'Review', 'Present', 'Late', 'Rejected'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === item
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item === 'ALL' ? 'All Students' : item}
            </button>
          ))}
        </div>
      </div>

      {/* Live Roster Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Instructor Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredAttempts.map((att) => {
              const isReview = att.status === 'Review'
              return (
                <tr
                  key={att.id}
                  onClick={() => setSelectedAttempt(att)}
                  className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    isReview ? 'bg-amber-950/10' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          att.studentAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                        }
                        alt={att.studentName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-slate-200">{att.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{att.studentEnrollment}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <VerificationStatus status={att.status} />
                  </td>
                  <td className="py-3 px-4 w-32">
                    <ConfidenceScore score={att.signals.compositeConfidence} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={att.signals.riskLevel} />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{att.timestamp}</td>
                  <td className="py-3 px-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    {isReview ? (
                      <>
                        <button
                          onClick={() => approveAttempt(att.id, 'Approved via teacher live monitor')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectAttempt(att.id, 'Rejected by teacher in live monitor')}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setSelectedAttempt(att)}
                        className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700"
                      >
                        Inspect
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Selected Attempt Detailed Inspection Modal */}
      {selectedAttempt && (
        <Modal
          isOpen={!!selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
          title={`Attempt Inspection: ${selectedAttempt.studentName}`}
          description={`Enrollment: ${selectedAttempt.studentEnrollment} • Timestamp: ${selectedAttempt.timestamp}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 pt-2">
            <VerificationSignalCard signals={selectedAttempt.signals} detailed={true} />

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Current Status: <strong>{selectedAttempt.status}</strong></span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    rejectAttempt(selectedAttempt.id, 'Instructor visual check failed')
                    setSelectedAttempt(null)
                  }}
                >
                  Reject Attempt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    requestReverification(selectedAttempt.id)
                    setSelectedAttempt(null)
                  }}
                >
                  Request Re-verification
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    approveAttempt(selectedAttempt.id, 'Instructor confirmed presence')
                    setSelectedAttempt(null)
                  }}
                >
                  Approve Attendance
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
