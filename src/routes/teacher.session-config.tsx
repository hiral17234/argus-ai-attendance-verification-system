import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Sliders, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAttendanceSession } from '../hooks/useAttendanceSession'

export const Route = createFileRoute('/teacher/session-config')({
  component: TeacherSessionConfigPage,
})

function TeacherSessionConfigPage() {
  const { activeSession, setActiveSession } = useAttendanceSession()
  const [duration, setDuration] = useState(activeSession.durationMinutes.toString())
  const [late, setLate] = useState(activeSession.lateThresholdMinutes.toString())
  const [policy, setPolicy] = useState(activeSession.verificationPolicy)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSession((prev) => ({
      ...prev,
      durationMinutes: Number(duration),
      lateThresholdMinutes: Number(late),
      verificationPolicy: policy,
    }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-emerald-400" />
          <span>Session Dynamic Configuration & Thresholds</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Tune adaptive challenge criteria, geofencing radii, and late admission rules for current session
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Active session parameters updated dynamically.</span>
        </div>
      )}

      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Session Code</label>
            <input
              type="text"
              disabled
              value={activeSession.code}
              className="w-full h-10 px-3 bg-slate-950/50 border border-slate-800 rounded-lg text-emerald-400 font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Session Duration (Minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Late Grace Period (Minutes)</label>
              <input
                type="number"
                value={late}
                onChange={(e) => setLate(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Verification Policy Strength</label>
            <select
              value={policy}
              onChange={(e) => setPolicy(e.target.value as any)}
              className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
            >
              <option value="Adaptive">Adaptive Risk (Dynamic multi-signal scaling)</option>
              <option value="Standard">Standard (Fixed ArcFace threshold)</option>
              <option value="Enhanced">Enhanced (Mandatory gesture challenge)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <Link to="/teacher/live">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="md">
              <span>Save & Apply Policy</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
