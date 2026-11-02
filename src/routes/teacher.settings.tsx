import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Settings, Sliders, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/teacher/settings')({
  component: TeacherSettingsPage,
})

function TeacherSettingsPage() {
  const [defaultDuration, setDefaultDuration] = useState('15')
  const [defaultPolicy, setDefaultPolicy] = useState('Adaptive')
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
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Teacher Operational Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Default session parameters, verification preferences, and thresholds</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Operational defaults updated.</span>
        </div>
      )}

      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4 text-xs">
        <div className="space-y-1">
          <label className="text-slate-300 font-medium">Default Session Duration</label>
          <select
            value={defaultDuration}
            onChange={(e) => setDefaultDuration(e.target.value)}
            className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
          >
            <option value="10">10 Minutes</option>
            <option value="15">15 Minutes (Default)</option>
            <option value="20">20 Minutes</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-medium">Default Verification Policy</label>
          <select
            value={defaultPolicy}
            onChange={(e) => setDefaultPolicy(e.target.value)}
            className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
          >
            <option value="Adaptive">Adaptive Risk Engine</option>
            <option value="Standard">Standard Verification</option>
            <option value="Enhanced">Enhanced High Security</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Defaults
          </Button>
        </div>
      </Card>
    </div>
  )
}
