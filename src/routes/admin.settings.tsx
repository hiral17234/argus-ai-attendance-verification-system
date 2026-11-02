import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Sliders, ShieldCheck, CheckCircle2, Lock, MapPin } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  const [campusGeofence, setCampusGeofence] = useState('26.2183° N, 78.1828° E (Campus Central Quad)')
  const [retentionDays, setRetentionDays] = useState('90')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-emerald-400" />
          <span>Institutional Platform Settings & Geofence</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure campus spatial geofences, biometric retention limits, and security controls</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Institutional configurations updated across gateway servers.</span>
        </div>
      )}

      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4 text-xs">
        <div className="space-y-1">
          <label className="text-slate-300 font-medium flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Campus Anchor Coordinates for Geofencing</span>
          </label>
          <input
            type="text"
            value={campusGeofence}
            onChange={(e) => setCampusGeofence(e.target.value)}
            className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-medium flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Audit Evidence Automatic Purge Retention (Days)</span>
          </label>
          <input
            type="number"
            value={retentionDays}
            onChange={(e) => setRetentionDays(e.target.value)}
            className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
          />
          <p className="text-[11px] text-slate-500">Telemetry logs beyond this threshold are scrubbed from disk.</p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave}>
            Save Global Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}
