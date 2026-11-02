import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, Sliders, CheckCircle2, Lock, Cpu } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/admin/verification')({
  component: AdminVerificationPage,
})

function AdminVerificationPage() {
  const [faceThreshold, setFaceThreshold] = useState('0.80')
  const [livenessSensitivity, setLivenessSensitivity] = useState('Strict (Anti-Replay Micro-texture)')
  const [challengeMode, setChallengeMode] = useState('Adaptive on Unknown Device')
  const [geofenceRadius, setGeofenceRadius] = useState('150')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Institutional Verification & Risk Policies</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure university-wide biometric cosine similarity baselines, anti-spoofing criteria, and geofencing boundaries
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Verification policies deployed to all edge verification nodes.</span>
        </div>
      )}

      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Biometrics */}
          <div className="space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>1. ArcFace Embedding Match Thresholds</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Automatic Acceptance Threshold (Cosine Similarity)</label>
                <input
                  type="text"
                  value={faceThreshold}
                  onChange={(e) => setFaceThreshold(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold"
                />
                <span className="text-[11px] text-slate-500">Values &ge; 0.80 yield FAR &lt; 0.001%</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Passive Liveness Anti-Spoofing Sensitivity</label>
                <select
                  value={livenessSensitivity}
                  onChange={(e) => setLivenessSensitivity(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option>Strict (Anti-Replay Micro-texture)</option>
                  <option>Moderate (Fourier Frequency Analysis)</option>
                  <option>Lightweight (Standard Landmark Kinematics)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Adaptive Challenge */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>2. Adaptive Gesture Challenge Criteria</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Challenge Trigger Requirement</label>
                <select
                  value={challengeMode}
                  onChange={(e) => setChallengeMode(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option>Adaptive on Unknown Device (Recommended)</option>
                  <option>Mandatory for Every Attempt</option>
                  <option>Adaptive on Borderline Facial Similarity</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Permitted Classroom Geofence Radius</label>
                <select
                  value={geofenceRadius}
                  onChange={(e) => setGeofenceRadius(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                >
                  <option value="150">150 Meters (Perimeter of Lecture Hall)</option>
                  <option value="300">300 Meters (Academic Block)</option>
                  <option value="800">800 Meters (Full University Campus)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              <span>Save & Publish Institutional Policy</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
