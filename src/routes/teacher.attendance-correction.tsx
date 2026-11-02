import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { History, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/teacher/attendance-correction')({
  component: TeacherAttendanceCorrectionPage,
})

function TeacherAttendanceCorrectionPage() {
  const [sessionDate, setSessionDate] = useState('2026-10-28')
  const [student, setStudent] = useState('Devansh Saxena (0901CS221033)')
  const [oldStatus, setOldStatus] = useState('Review')
  const [newStatus, setNewStatus] = useState('Present')
  const [reason, setReason] = useState('Confirmed student physical presence in row 4')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <History className="w-6 h-6 text-emerald-400" />
          <span>Historical Attendance Correction</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Formal correction workflow: previous records are archived and every correction generates an auditable diff
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Attendance correction recorded with immutable audit hash.</span>
        </div>
      )}

      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Student</label>
              <input
                type="text"
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Current Recorded Status</label>
              <input
                type="text"
                disabled
                value={oldStatus}
                className="w-full h-10 px-3 bg-slate-950/60 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Amended New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
              >
                <option value="Present">Present (Full Credit)</option>
                <option value="Late">Late (Partial)</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-medium">Correction Justification (Required for Audit)</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Link to="/teacher/attendance-register">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="md">
              <span>Submit Formal Correction</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
