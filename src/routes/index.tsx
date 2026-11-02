import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ScanFace,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Sparkles,
  KeyRound,
  Eye,
  Smartphone,
  MapPin,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../lib/types'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate()
  const { loginAs, allUsers } = useAuth()
  const [email, setEmail] = useState('student@argus.demo')
  const [password, setPassword] = useState('Student@123')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      const role = loginAs(email)
      setIsLoading(false)
      if (role === 'teacher') navigate({ to: '/teacher' })
      else if (role === 'admin' || role === 'superadmin' || role === 'coordinator' || role === 'security')
        navigate({ to: '/admin' })
      else navigate({ to: '/student' })
    }, 400)
  }

  const quickDemoLogin = (roleKey: UserRole) => {
    const user = allUsers[roleKey]
    if (!user) return
    setEmail(user.email)
    loginAs(user.email)
    if (roleKey === 'teacher') navigate({ to: '/teacher' })
    else if (roleKey === 'admin' || roleKey === 'superadmin' || roleKey === 'coordinator' || roleKey === 'security')
      navigate({ to: '/admin' })
    else navigate({ to: '/student' })
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-lg font-mono text-white">ARGUS</span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Institutional v2.0
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 hidden sm:inline-block">Academic Year 2026-27</span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <a
              href="#login-section"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              Sign In Portal
            </a>
          </div>
        </div>
      </header>

      {/* Main Hero & Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-16">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Adaptive Risk-Guided Biometric Verification</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              ARGUS does not simply ask{' '}
              <span className="text-slate-400 font-serif italic">"Does this face match?"</span>
              <br />
              It asks{' '}
              <span className="text-emerald-400">
                "How trustworthy is this attempt, and how much verification is necessary?"
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              An intelligent attendance and identity-verification platform for educational institutions.
              Combining multi-signal biometric evaluation, liveness anti-spoofing, dynamic gesture challenges,
              hardware device trust, and campus geofencing with explainable risk assessment.
            </p>

            {/* Core Novelty Highlight */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Defensible Academic Contribution</span>
              </div>
              <p className="text-slate-400">
                Verification strength dynamically adapts to context: trusted devices in classrooms require only
                lightweight verification, while unknown devices or borderline signals trigger adaptive random
                challenges or teacher oversight.
              </p>
            </div>

            {/* Quick Portal Switch Buttons */}
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Quick Demo Access (Select Portal):
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button variant="primary" size="sm" onClick={() => quickDemoLogin('student')}>
                  <span>Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="secondary" size="sm" onClick={() => quickDemoLogin('teacher')}>
                  <span>Teacher Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickDemoLogin('admin')}>
                  <span>Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => quickDemoLogin('security')}>
                  <span>IT / Security</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Login Form Card */}
          <div id="login-section" className="lg:col-span-5">
            <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 shadow-2xl space-y-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Institutional Authentication</h2>
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400">
                  Authenticate with your registered university single sign-on credentials.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">University Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-lg bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="student@argus.demo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Access Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-lg bg-slate-950/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="••••••••••••"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                  <span>Access ARGUS Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>

              {/* Demo Accounts List */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Preset Development Credentials:
                </span>
                <div className="space-y-1.5 text-xs">
                  <div
                    onClick={() => {
                      setEmail('student@argus.demo')
                      setPassword('Student@123')
                    }}
                    className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">Student: Hiral Goyal</p>
                      <p className="text-[10px] text-slate-400 font-mono">student@argus.demo / Student@123</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Load</span>
                  </div>

                  <div
                    onClick={() => {
                      setEmail('teacher@argus.demo')
                      setPassword('Teacher@123')
                    }}
                    className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">Teacher: Dr. Ankit Sharma</p>
                      <p className="text-[10px] text-slate-400 font-mono">teacher@argus.demo / Teacher@123</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Load</span>
                  </div>

                  <div
                    onClick={() => {
                      setEmail('admin@argus.demo')
                      setPassword('Admin@123')
                    }}
                    className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">Admin: Prof. R. K. Mukherjee</p>
                      <p className="text-[10px] text-slate-400 font-mono">admin@argus.demo / Admin@123</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">Load</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Multi-Signal Verification Pipeline Cards */}
        <div className="pt-8 border-t border-slate-800/80 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Multi-Signal Adaptive Architecture</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              ARGUS synthesizes 6 independent verification signals to formulate a risk-proportional challenge
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ScanFace className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">ArcFace Biometrics</h4>
              <p className="text-xs text-slate-400">
                512-dimensional deep feature embeddings evaluated with cosine distance; no raw video frames stored.
              </p>
            </Card>

            <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Passive Liveness</h4>
              <p className="text-xs text-slate-400">
                Fourier frequency analysis and micro-texture anti-spoofing to block screen replay and printed masks.
              </p>
            </Card>

            <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Random Gesture Challenge</h4>
              <p className="text-xs text-slate-400">
                Dynamically prompted head turn, blink, smile, or nod with sub-second reaction verification.
              </p>
            </Card>

            <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Device Trust Engine</h4>
              <p className="text-xs text-slate-400">
                Hardware cryptographic fingerprints categorize devices as Trusted, Known, Unknown, or Blocked.
              </p>
            </Card>

            <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Campus Geofence</h4>
              <p className="text-xs text-slate-400">
                Verifies physical presence inside the lecture hall perimeter without exposing continuous student GPS.
              </p>
            </Card>

            <Card className="p-4 bg-slate-900/60 border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Explainable Risk Output</h4>
              <p className="text-xs text-slate-400">
                Flags are surfaced to teachers with plain-English rationales for rapid, audit-logged oversight.
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026-2027 ARGUS Project — Adaptive Risk-Guided University Attendance Platform.</p>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-400 font-mono">Academic Research Prototype</span>
            <span>•</span>
            <span>Zero-Raw Biometric Storage</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
