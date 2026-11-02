import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, Clock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAttendanceSession } from '../hooks/useAttendanceSession'

export const Route = createFileRoute('/student/appeal-history')({
  component: StudentAppealHistoryPage,
})

function StudentAppealHistoryPage() {
  const { appeals } = useAttendanceSession()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/student/appeals" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Submit Appeal</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400">History</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Submitted Attendance Appeals & Inquiries
          </h1>
        </div>

        <Link
          to="/student/appeals"
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          + New Appeal
        </Link>
      </div>

      {/* Appeals List */}
      <div className="space-y-3">
        {appeals.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 bg-slate-900/40">
            <p className="text-xs">No appeals submitted yet.</p>
          </Card>
        ) : (
          appeals.map((item) => (
            <Card
              key={item.id}
              className="p-5 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    #{item.id}
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.subjectName}</h3>
                </div>
                <Badge
                  variant={
                    item.status === 'Approved'
                      ? 'success'
                      : item.status === 'Pending'
                      ? 'warning'
                      : item.status === 'Under Review'
                      ? 'info'
                      : 'danger'
                  }
                  className="uppercase text-[10px]"
                >
                  {item.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400">
                <div>
                  Reason: <strong className="text-slate-200">{item.reason}</strong>
                </div>
                <div>
                  Session Date: <strong className="text-slate-200 font-mono">{item.sessionDate}</strong>
                </div>
                <div>
                  Assigned Faculty: <strong className="text-slate-200">{item.submittedTo}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                <span className="text-slate-400 font-medium block mb-1">Student Narrative:</span>
                <p>{item.description}</p>
              </div>

              {item.reviewerNotes && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                  <span className="font-semibold block">Faculty Reviewer Feedback:</span>
                  <p>{item.reviewerNotes}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Submitted: {item.submittedAt}</span>
                <span>Last Updated: {item.updatedAt}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
