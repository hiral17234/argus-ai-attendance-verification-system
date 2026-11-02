import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, Sliders, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/teacher/late-attendance')({
  component: TeacherLateAttendancePage,
})

function TeacherLateAttendancePage() {
  const [threshold, setThreshold] = useState('5')
  const [creditWeight, setCreditWeight] = useState('0.8')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Clock className="w-6 h-6 text-amber-400" />
          <span>Late Attendance & Grace Period Policies</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure punctuality thresholds, late check-in weighting, and automated penalty rules
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Late threshold configuration saved for active and upcoming sessions.</span>
        </div>
      )}

      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Late Grace Window (Minutes After Session Start)</label>
            <select
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            >
              <option value="3">3 Minutes Grace Period</option>
              <option value="5">5 Minutes Grace Period (Recommended)</option>
              <option value="10">10 Minutes Grace Period</option>
              <option value="15">15 Minutes Grace Period</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Credit Weighting For Late Attendance</label>
            <select
              value={creditWeight}
              onChange={(e) => setCreditWeight(e.target.value)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            >
              <option value="1.0">1.0 (Full attendance credit awarded)</option>
              <option value="0.8">0.8 (Partial 80% attendance credit)</option>
              <option value="0.5">0.5 (Half attendance credit)</option>
              <option value="0.0">0.0 (Recorded as Late, no credit towards 75%)</option>
            </select>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-slate-400">
            <p className="font-semibold text-white">Institutional Workflow Example:</p>
            <p>
              • If lecture starts at <strong>10:00 AM</strong>, students checking in up to <strong>10:05 AM</strong> are
              marked <span className="text-emerald-400 font-semibold">Present</span>.
            </p>
            <p>
              • Check-ins between <strong>10:05 AM - 10:15 AM</strong> are categorized as{' '}
              <span className="text-amber-400 font-semibold">Late</span> and earn {creditWeight} fractional credit.
            </p>
            <p>
              • After <strong>10:15 AM</strong>, the session window automatically closes and late attempts are blocked.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave}>
            <span>Update Threshold Rules</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
