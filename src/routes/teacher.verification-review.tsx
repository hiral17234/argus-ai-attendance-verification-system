import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Eye,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { RiskBadge } from '../components/verification/RiskBadge'
import { ConfidenceScore } from '../components/verification/ConfidenceScore'
import { VerificationSignalCard } from '../components/verification/VerificationSignalCard'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { VerificationAttempt } from '../lib/types'

export const Route = createFileRoute('/teacher/verification-review')({
  component: TeacherVerificationReviewPage,
})

function TeacherVerificationReviewPage() {
  const { attempts, approveAttempt, rejectAttempt, requestReverification } = useAttendanceSession()
  const [selectedAttempt, setSelectedAttempt] = useState<VerificationAttempt | null>(null)
  const [auditMessage, setAuditMessage] = useState<string | null>(null)

  const flaggedAttempts = attempts.filter((a) => a.status === 'Review' || a.signals.riskLevel !== 'LOW')

  const handleApprove = (id: string, name: string) => {
    approveAttempt(id, 'Approved by course instructor after visual identity confirmation')
    setAuditMessage(`Approved attendance for ${name}. Audit event logged.`)
    setTimeout(() => setAuditMessage(null), 3000)
    setSelectedAttempt(null)
  }

  const handleReject = (id: string, name: string) => {
    rejectAttempt(id, 'Instructor could not confirm physical attendance')
    setAuditMessage(`Rejected attendance for ${name}. Audit event logged.`)
    setTimeout(() => setAuditMessage(null), 3000)
    setSelectedAttempt(null)
  }

  const handleReverify = (id: string, name: string) => {
    requestReverification(id)
    setAuditMessage(`Re-verification dispatched to ${name} with high-security gesture.`)
    setTimeout(() => setAuditMessage(null), 3000)
    setSelectedAttempt(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span>Biometric Verification Review Queue</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Teacher decision-support: human oversight on borderline biometrics, unknown devices & location anomalies
          </p>
        </div>

        <Link
          to="/teacher/live"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          ← Return to Live Monitor
        </Link>
      </div>

      {auditMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* Flagged Attempts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Flagged Items ({flaggedAttempts.length})
            </span>
            <span className="text-[11px] text-slate-400">Click item to inspect signals</span>
          </div>

          {flaggedAttempts.length === 0 ? (
            <Card className="p-8 text-center text-slate-400 bg-slate-900/40">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs">No pending review flags! All attempts processed.</p>
            </Card>
          ) : (
            flaggedAttempts.map((att) => {
              const isSelected = selectedAttempt?.id === att.id
              return (
                <Card
                  key={att.id}
                  onClick={() => setSelectedAttempt(att)}
                  className={`p-4 cursor-pointer transition-all space-y-3 border ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-950/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          att.studentAvatar ||
                          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'
                        }
                        alt={att.studentName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500/40"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{att.studentName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{att.studentEnrollment}</p>
                      </div>
                    </div>
                    <RiskBadge level={att.signals.riskLevel} />
                  </div>

                  <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <span className="text-amber-400 font-semibold block text-[10px] uppercase tracking-wider">
                      Why was this flagged?
                    </span>
                    <p className="line-clamp-2">{att.signals.humanExplanation}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-mono text-slate-400 text-[10px]">Attempt #{att.id}</span>
                    <span className="text-emerald-400 font-semibold text-xs flex items-center space-x-1">
                      <span>Inspect Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-7">
          {selectedAttempt ? (
            <Card className="p-6 bg-slate-900 border-emerald-500/30 space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    FLAG #{selectedAttempt.id}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{selectedAttempt.studentName}</h3>
                  <p className="text-xs text-slate-400">
                    Enrollment: {selectedAttempt.studentEnrollment} • {selectedAttempt.subjectName}
                  </p>
                </div>
                <RiskBadge level={selectedAttempt.signals.riskLevel} />
              </div>

              {/* Full multi-signal breakdown */}
              <VerificationSignalCard signals={selectedAttempt.signals} detailed={true} />

              {/* Action Buttons */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Teacher Review Action:
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    variant="success"
                    size="md"
                    onClick={() => handleApprove(selectedAttempt.id, selectedAttempt.studentName)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    <span>Approve Attendance</span>
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => handleReject(selectedAttempt.id, selectedAttempt.studentName)}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    <span>Reject Attempt</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleReverify(selectedAttempt.id, selectedAttempt.studentName)}
                  >
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                    <span>Request Re-Verification</span>
                  </Button>
                  <Link to="/teacher/manual-attendance">
                    <Button variant="ghost" size="md">
                      <span>Manual Override...</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 bg-slate-900/40 border-dashed border-slate-800">
              <Eye className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">Select an attempt from the review queue</p>
              <p className="text-xs text-slate-500 mt-1">
                Detailed 6-signal biometric telemetry and risk rationale will appear here for audit review.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
