import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { QrCode, Clock, Users, ArrowRight, ShieldCheck, Copy, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAttendanceSession } from '../hooks/useAttendanceSession'

export const Route = createFileRoute('/teacher/session-qr')({
  component: TeacherSessionQrPage,
})

function TeacherSessionQrPage() {
  const { activeSession } = useAttendanceSession()
  const [secondsRemaining, setSecondsRemaining] = useState(activeSession.durationMinutes * 60)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const copyCode = () => {
    navigator.clipboard.writeText(activeSession.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-center">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center space-x-2">
          <QrCode className="w-6 h-6 text-emerald-400" />
          <span>Active Session Dynamic QR Code</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Project this screen on the classroom display for student scanning and verification join
        </p>
      </div>

      {/* Main QR Card */}
      <Card className="p-8 bg-slate-900 border-2 border-emerald-500/40 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Course Info */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {activeSession.subjectCode} • SECTION {activeSession.section}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">{activeSession.subjectName}</h2>
          <p className="text-xs text-slate-400">
            {activeSession.room} • Instructor: {activeSession.teacherName}
          </p>
        </div>

        {/* Dynamic Stylized QR Representation */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 mx-auto bg-white p-4 rounded-2xl shadow-xl flex items-center justify-center relative">
          {/* SVG QR Code Pattern */}
          <svg className="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
            {/* Top-left position marker */}
            <rect x="5" y="5" width="25" height="25" rx="3" fill="#022c22" />
            <rect x="9" y="9" width="17" height="17" fill="white" />
            <rect x="13" y="13" width="9" height="9" fill="#059669" />

            {/* Top-right position marker */}
            <rect x="70" y="5" width="25" height="25" rx="3" fill="#022c22" />
            <rect x="74" y="9" width="17" height="17" fill="white" />
            <rect x="78" y="13" width="9" height="9" fill="#059669" />

            {/* Bottom-left position marker */}
            <rect x="5" y="70" width="25" height="25" rx="3" fill="#022c22" />
            <rect x="9" y="74" width="17" height="17" fill="white" />
            <rect x="13" y="78" width="9" height="9" fill="#059669" />

            {/* Data matrix dots */}
            <rect x="36" y="8" width="5" height="5" />
            <rect x="46" y="8" width="5" height="5" />
            <rect x="56" y="8" width="5" height="5" />
            <rect x="36" y="18" width="5" height="5" />
            <rect x="46" y="24" width="5" height="5" fill="#059669" />
            <rect x="56" y="18" width="5" height="5" />
            <rect x="8" y="36" width="5" height="5" />
            <rect x="18" y="46" width="5" height="5" />
            <rect x="8" y="56" width="5" height="5" />
            <rect x="36" y="36" width="28" height="28" rx="4" fill="#0f172a" />
            <text x="50" y="52" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ARGUS
            </text>
            <text x="50" y="60" fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              SCAN
            </text>
            <rect x="72" y="36" width="5" height="5" />
            <rect x="82" y="46" width="5" height="5" />
            <rect x="72" y="56" width="5" height="5" />
            <rect x="36" y="72" width="5" height="5" />
            <rect x="46" y="82" width="5" height="5" />
            <rect x="56" y="72" width="5" height="5" />
            <rect x="72" y="72" width="8" height="8" fill="#059669" />
            <rect x="84" y="84" width="8" height="8" fill="#059669" />
          </svg>
        </div>

        {/* Dynamic Code & Expiration Timer */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Session Code:</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400 tracking-wider">
              {activeSession.code}
            </span>
            <button
              onClick={copyCode}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>
              Session Window Expires In:{' '}
              <strong className="text-amber-300 font-mono text-sm">{formattedTime}</strong>
            </span>
          </div>
        </div>

        {/* Quick Launch to Live Monitor */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/teacher/live" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full">
              <Users className="w-5 h-5 mr-2" />
              <span>Launch Live Attendance Monitor</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/teacher" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
