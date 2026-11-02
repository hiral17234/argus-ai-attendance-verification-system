import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, Lock, Database, EyeOff, Server, FileCheck } from 'lucide-react'
import { Card } from '../components/ui/card'

export const Route = createFileRoute('/student/privacy')({
  component: StudentPrivacyPage,
})

function StudentPrivacyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Lock className="w-6 h-6 text-emerald-400" />
          <span>Biometric Privacy & Institutional Data Governance</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ARGUS privacy architecture: zero raw-video retention, mathematical vector encoding, and strict role-based access
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-900/80 border-slate-800 space-y-2">
          <EyeOff className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Zero Raw Video Storage</h3>
          <p className="text-xs text-slate-400">
            Camera video feeds are processed in-memory. Individual frames are wiped immediately after vector generation.
          </p>
        </Card>

        <Card className="p-4 bg-slate-900/80 border-slate-800 space-y-2">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Mathematical Embeddings</h3>
          <p className="text-xs text-slate-400">
            Only one-way 512-dimensional numerical vectors are stored. Raw faces cannot be reconstructed from embeddings.
          </p>
        </Card>

        <Card className="p-4 bg-slate-900/80 border-slate-800 space-y-2">
          <Server className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Defined Retention Expiry</h3>
          <p className="text-xs text-slate-400">
            Session attempt audit evidence is automatically expunged 90 days after semester completion.
          </p>
        </Card>
      </div>

      {/* Detailed Policy Text */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5 text-xs text-slate-300 leading-relaxed">
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>1. What Data Does ARGUS Collect?</span>
          </h4>
          <p className="text-slate-400 pl-6">
            During an attendance session, ARGUS collects: (a) facial landmark coordinates to assess posture and image
            quality, (b) passive micro-texture statistics to verify liveness, (c) response latency to dynamic gesture
            prompts, (d) hardware browser fingerprint hash, and (e) binary confirmation of whether the device is within
            the campus Wi-Fi / geofence perimeter. Exact GPS tracking coordinates are never continuously recorded.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>2. Role-Based Access Controls</span>
          </h4>
          <p className="text-slate-400 pl-6">
            Course instructors only view attendance outcomes, confidence percentages, and flagged attempt rationale.
            Instructors cannot download student biometric templates. IT security personnel monitor anomalous device
            patterns without access to student identity templates.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>3. Right to Audit & Appeal</span>
          </h4>
          <p className="text-slate-400 pl-6">
            Every verification flag produces an explainable natural-language log entry visible to both the student and
            the faculty. Students possess the unconditioned right to file attendance appeals for any technical or
            borderline failure without academic penalty.
          </p>
        </div>
      </Card>
    </div>
  )
}
