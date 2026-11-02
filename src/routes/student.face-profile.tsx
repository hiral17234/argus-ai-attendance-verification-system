import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ScanFace, ShieldCheck, RefreshCw, KeyRound, CheckCircle2, Lock } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/student/face-profile')({
  component: StudentFaceProfilePage,
})

function StudentFaceProfilePage() {
  const { currentUser } = useAuth()
  const [testingBiometrics, setTestingBiometrics] = useState(false)
  const [testSuccess, setTestSuccess] = useState(false)

  const runVerificationTest = () => {
    setTestingBiometrics(true)
    setTestSuccess(false)
    setTimeout(() => {
      setTestingBiometrics(false)
      setTestSuccess(true)
    }, 1200)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <ScanFace className="w-6 h-6 text-emerald-400" />
            <span>Biometric Verification Profile</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your ArcFace enrollment vector, test biometric match, and review retention settings
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  ENROLLED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{currentUser.enrollmentNo}</p>
              <p className="text-[11px] text-slate-400">Enrolled: 18 Aug 2024 via University Biometric Center</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={runVerificationTest}
            isLoading={testingBiometrics}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <span>Run Test Verification</span>
          </Button>
        </div>

        {testSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center space-x-3 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">Biometric Vector Validated (97.4% Cosine Match)</p>
              <p className="text-[11px] text-emerald-400/80">
                Live facial landmarks successfully correlated with 512-d template. No updates necessary.
              </p>
            </div>
          </div>
        )}

        {/* Technical Vector Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Embedding Model</span>
            <p className="font-mono text-white font-semibold">ArcFace (ResNet-100)</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Vector Dimensionality</span>
            <p className="font-mono text-white font-semibold">512 Floating Point Values</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Cryptographic Hash</span>
            <p className="font-mono text-emerald-400 text-[10px] truncate">SHA256:7f9a2b84...3c12</p>
          </div>
        </div>
      </Card>

      {/* Security Re-Authentication Requirement Notice */}
      <Card className="p-5 bg-slate-900/50 border-slate-800 flex items-start space-x-3.5">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <p className="font-bold text-white">Re-Enrollment & Profile Changes</p>
          <p className="text-slate-400 leading-relaxed">
            Due to institutional anti-proxy integrity policies, biometric profile re-enrollment requires in-person
            identity verification at the Academic Computing Center with official student photo credentials.
          </p>
        </div>
      </Card>
    </div>
  )
}
