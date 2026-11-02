import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { FileText, Send, CheckCircle2, Paperclip, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuth } from '../hooks/useAuth'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { MOCK_SUBJECTS } from '../lib/mockData'

export const Route = createFileRoute('/student/appeals')({
  component: StudentAppealsPage,
})

function StudentAppealsPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { submitAppeal } = useAttendanceSession()

  const [subject, setSubject] = useState(MOCK_SUBJECTS[0].name)
  const [sessionDate, setSessionDate] = useState('2026-10-31')
  const [reason, setReason] = useState<'Wrongly marked absent' | 'Failed verification' | 'Late attendance' | 'Technical issue' | 'Medical exception' | 'Other'>('Technical issue')
  const [description, setDescription] = useState('')
  const [attachment, setAttachment] = useState<string | null>('terminal-log.png')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitAppeal({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEnrollment: currentUser.enrollmentNo || '0901CS221045',
      subjectName: subject,
      sessionDate,
      reason,
      description,
      attachmentName: attachment || undefined,
      submittedTo: 'Dr. Ankit Sharma',
    })
    setIsSubmitted(true)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Submit Attendance Appeal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Request faculty review for technical anomalies, camera timeouts, or documented absences
          </p>
        </div>

        <Link
          to="/student/appeal-history"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
        >
          <span>View Submitted Appeals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isSubmitted ? (
        <Card className="p-8 text-center bg-slate-900 border-emerald-500/40 space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Appeal Submitted Successfully</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Your appeal has been forwarded to the course faculty with attached biometric timestamps. You will be
              notified when reviewed.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
              Submit Another Appeal
            </Button>
            <Link to="/student/appeal-history">
              <Button variant="primary" size="sm">
                Track Appeal Status
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Course / Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {MOCK_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Session Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Primary Appeal Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Technical issue">Technical issue / Camera stream glitch</option>
                <option value="Failed verification">Borderline verification failure</option>
                <option value="Wrongly marked absent">Physical presence in class but marked absent</option>
                <option value="Late attendance">Session threshold late arrival due to transport/clinic</option>
                <option value="Medical exception">Official Medical / Department Leave</option>
                <option value="Other">Other Academic Exception</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Detailed Explanation</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your classroom location, timing, and any verification errors observed..."
                className="w-full p-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Simulated Attachment */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Supporting Documentation</label>
              <div className="p-3 rounded-lg border border-dashed border-slate-700 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-emerald-400" />
                  <span>{attachment || 'No file selected (Optional)'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment('screenshot-error-session-241.png')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Upload File
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <Link to="/student">
                <Button variant="ghost" size="md">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="md">
                <Send className="w-4 h-4 mr-1.5" />
                <span>Submit Official Appeal</span>
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
