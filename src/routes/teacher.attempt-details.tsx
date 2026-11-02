import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldCheck, ArrowLeft, CheckCircle2, XCircle, RefreshCw, Info } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { VerificationSignalCard } from '../components/verification/VerificationSignalCard'
import { MOCK_VERIFICATION_ATTEMPTS } from '../lib/mockData'
import { useAttendanceSession } from '../hooks/useAttendanceSession'

export const Route = createFileRoute('/teacher/attempt-details')({
  component: TeacherAttemptDetailsPage,
})

function TeacherAttemptDetailsPage() {
  const { approveAttempt, rejectAttempt } = useAttendanceSession()
  const [selectedId, setSelectedId] = useState('att-1042')
  const [actionDone, setActionDone] = useState<string | null>(null)

  const attempt =
    MOCK_VERIFICATION_ATTEMPTS.find((a) => a.id === selectedId) || MOCK_VERIFICATION_ATTEMPTS[1]

  const handleApprove = () => {
    approveAttempt(attempt.id, 'Confirmed presence in lecture hall row 4')
    setActionDone('Attempt has been Approved.')
    setTimeout(() => setActionDone(null), 3000)
  }

  const handleReject = () => {
    rejectAttempt(attempt.id, 'Identity could not be confirmed')
    setActionDone('Attempt has been Rejected.')
    setTimeout(() => setActionDone(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/teacher/live" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Live Monitor</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-mono">Attempt #{attempt.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Verification Telemetry & Risk Signals
          </h1>
          <p className="text-xs text-slate-400">
            Student: <strong className="text-white">{attempt.studentName}</strong> ({attempt.studentEnrollment}) •{' '}
            {attempt.subjectName}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Inspect Attempt:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {MOCK_VERIFICATION_ATTEMPTS.map((a) => (
              <option key={a.id} value={a.id}>
                #{a.id} - {a.studentName} ({a.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionDone && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionDone}</span>
        </div>
      )}

      {/* Main Signal Card */}
      <VerificationSignalCard signals={attempt.signals} detailed={true} />

      {/* Teacher Actions Bar */}
      <Card className="p-5 bg-slate-900/90 border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Teacher Action & Audit Trail</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Decisions are recorded in the institutional audit log with instructor credentials.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button variant="danger" size="sm" onClick={handleReject}>
            <XCircle className="w-3.5 h-3.5 mr-1" />
            <span>Reject Attempt</span>
          </Button>
          <Button variant="success" size="sm" onClick={handleApprove}>
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Approve & Mark Present</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
