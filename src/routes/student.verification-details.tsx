import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldCheck, Info, ArrowLeft, Lock, Award, Cpu } from 'lucide-react'
import { VerificationSignalCard } from '../components/verification/VerificationSignalCard'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MOCK_VERIFICATION_ATTEMPTS } from '../lib/mockData'

export const Route = createFileRoute('/student/verification-details')({
  component: StudentVerificationDetailsPage,
})

function StudentVerificationDetailsPage() {
  const [selectedAttemptId, setSelectedAttemptId] = useState('att-1041')
  const attempt =
    MOCK_VERIFICATION_ATTEMPTS.find((a) => a.id === selectedAttemptId) || MOCK_VERIFICATION_ATTEMPTS[0]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/student" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-mono">Attempt #{attempt.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Verification Signals & Risk Explainability
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Select Attempt:</span>
          <select
            value={selectedAttemptId}
            onChange={(e) => setSelectedAttemptId(e.target.value)}
            className="h-9 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="att-1041">Hiral Goyal (Pass - 96%)</option>
            <option value="att-1042">Rahul Sharma (Review - 74%)</option>
            <option value="att-1045">Priya Patel (Reject - 33%)</option>
          </select>
        </div>
      </div>

      {/* Verification Signal Card Component */}
      <VerificationSignalCard signals={attempt.signals} detailed={true} />

      {/* Conceptual Mathematical Formulation */}
      <Card className="p-5 bg-slate-900/60 border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Mathematical Confidence Formulation</h3>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800/80 overflow-x-auto">
          <code>
            C = w<sub>f</sub> · F + w<sub>l</sub> · L + w<sub>g</sub> · G + w<sub>d</sub> · D + w<sub>loc</sub> · R
          </code>
          <p className="text-[11px] text-slate-400 mt-2 font-sans">
            Where <strong>F</strong> = Face embedding similarity, <strong>L</strong> = Liveness anti-spoofing score,{' '}
            <strong>G</strong> = Gesture reaction compliance, <strong>D</strong> = Hardware device trust, and{' '}
            <strong>R</strong> = Geofence location verification. All sub-scores are strictly normalized to [0, 1].
          </p>
        </div>

        <div className="text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong>Adaptive Verification Policy:</strong> ARGUS adjusts required verification strength dynamically.
            For trusted devices and routine class presence, lightweight checks are sufficient. Borderline similarities
            or device migrations automatically dispatch dynamic gesture challenges rather than generating false
            rejections.
          </p>
        </div>
      </Card>

      {/* Biometric Privacy & Ethics Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-400">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Institutional Privacy Commitment: </span>
          <span>
            ARGUS never permanently archives raw facial image frames or video feeds. Only mathematical 512-dimensional
            feature vectors generated via the ArcFace architecture are evaluated. Verification logs are purged
            according to university statutory retention guidelines.
          </span>
        </div>
      </div>
    </div>
  )
}
