import { VerificationAttempt } from '../../lib/types'
import { VerificationStatus } from '../verification/VerificationStatus'
import { RiskBadge } from '../verification/RiskBadge'
import { ConfidenceScore } from '../verification/ConfidenceScore'

interface AttendanceTableProps {
  attempts: VerificationAttempt[]
  onSelectAttempt?: (attempt: VerificationAttempt) => void
  showActions?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function AttendanceTable({
  attempts,
  onSelectAttempt,
  showActions = false,
  onApprove,
  onReject,
}: AttendanceTableProps) {
  if (attempts.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
        <p className="text-sm">No attendance records found</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Student</th>
            <th className="py-3 px-4">Subject & Session</th>
            <th className="py-3 px-4">Time</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Confidence</th>
            <th className="py-3 px-4">Risk Level</th>
            {showActions && <th className="py-3 px-4 text-right">Teacher Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {attempts.map((attempt) => (
            <tr
              key={attempt.id}
              onClick={() => onSelectAttempt?.(attempt)}
              className="hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      attempt.studentAvatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                    }
                    alt={attempt.studentName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <p className="font-semibold text-slate-200">{attempt.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{attempt.studentEnrollment}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="font-medium text-slate-200">{attempt.subjectName}</p>
                <span className="text-[10px] font-mono text-emerald-400">{attempt.sessionCode}</span>
              </td>
              <td className="py-3 px-4 text-slate-300 font-mono">{attempt.timestamp}</td>
              <td className="py-3 px-4">
                <VerificationStatus status={attempt.status} />
              </td>
              <td className="py-3 px-4 w-32">
                <ConfidenceScore score={attempt.signals.compositeConfidence} showBar={true} size="sm" />
              </td>
              <td className="py-3 px-4">
                <RiskBadge level={attempt.signals.riskLevel} />
              </td>
              {showActions && (
                <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                  {attempt.status === 'Review' ? (
                    <>
                      <button
                        onClick={() => onApprove?.(attempt.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject?.(attempt.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400">Processed</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
