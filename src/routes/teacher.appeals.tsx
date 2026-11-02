import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, CheckCircle2, XCircle, Clock, ArrowRight, Eye } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { Appeal } from '../lib/types'

export const Route = createFileRoute('/teacher/appeals')({
  component: TeacherAppealsPage,
})

function TeacherAppealsPage() {
  const { appeals, updateAppealStatus } = useAttendanceSession()
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null)
  const [reviewerNote, setReviewerNote] = useState('')
  const [alertMsg, setAlertMsg] = useState<string | null>(null)

  const handleApprove = (id: string, studentName: string) => {
    updateAppealStatus(id, 'Approved', reviewerNote || 'Approved after faculty verification')
    setAlertMsg(`Appeal for ${studentName} Approved. Attendance updated.`)
    setTimeout(() => setAlertMsg(null), 3000)
    setSelectedAppeal(null)
  }

  const handleReject = (id: string, studentName: string) => {
    updateAppealStatus(id, 'Rejected', reviewerNote || 'Insufficient documentation provided')
    setAlertMsg(`Appeal for ${studentName} Rejected.`)
    setTimeout(() => setAlertMsg(null), 3000)
    setSelectedAppeal(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          <span>Student Attendance Appeals & Inquiries</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review student appeals for borderline biometric failures, camera glitches, or documented absences
        </p>
      </div>

      {alertMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Main Grid: Appeals List & Inspection Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Submitted Inquiries ({appeals.length})
            </span>
            <span className="text-[11px] text-slate-400">Click to inspect and adjudicate</span>
          </div>

          {appeals.map((item) => {
            const isSelected = selectedAppeal?.id === item.id
            return (
              <Card
                key={item.id}
                onClick={() => {
                  setSelectedAppeal(item)
                  setReviewerNote(item.reviewerNotes || '')
                }}
                className={`p-4 cursor-pointer transition-all space-y-3 border ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      #{item.id}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5">{item.studentName}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{item.studentEnrollment}</p>
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
                    className="text-[10px] uppercase"
                  >
                    {item.status}
                  </Badge>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-400 block text-[11px]">Reason: {item.reason}</span>
                  <p className="line-clamp-2 text-slate-400 text-[11px] mt-0.5">{item.description}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Session: {item.sessionDate}</span>
                  <span className="text-emerald-400 font-semibold text-xs flex items-center space-x-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Right Details & Decision Drawer */}
        <div className="lg:col-span-6">
          {selectedAppeal ? (
            <Card className="p-6 bg-slate-900 border-emerald-500/30 space-y-5 animate-in fade-in">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    APPEAL #{selectedAppeal.id}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{selectedAppeal.studentName}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedAppeal.studentEnrollment} • Session Date: {selectedAppeal.sessionDate}
                  </p>
                </div>
                <Badge variant={selectedAppeal.status === 'Approved' ? 'success' : 'warning'}>
                  {selectedAppeal.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Student Narrative Statement:</span>
                <p className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedAppeal.description}
                </p>
              </div>

              {selectedAppeal.attachmentName && (
                <div className="text-xs text-slate-400 flex items-center space-x-2 p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-emerald-400 font-semibold">Supporting Evidence:</span>
                  <span className="font-mono text-slate-200">{selectedAppeal.attachmentName}</span>
                </div>
              )}

              {/* Reviewer Decision Form */}
              <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
                <label className="font-bold text-slate-300 block">Faculty Reviewer Feedback / Reason:</label>
                <textarea
                  rows={3}
                  value={reviewerNote}
                  onChange={(e) => setReviewerNote(e.target.value)}
                  placeholder="Enter official justification for approval or denial..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(selectedAppeal.id, selectedAppeal.studentName)}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    <span>Reject Appeal</span>
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApprove(selectedAppeal.id, selectedAppeal.studentName)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    <span>Approve & Credit Attendance</span>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 bg-slate-900/40 border-dashed border-slate-800">
              <Eye className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">Select a student appeal to review</p>
              <p className="text-xs text-slate-500 mt-1">
                Student narrative, session timestamps, and supporting evidence will appear here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
