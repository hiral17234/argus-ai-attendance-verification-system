import { createFileRoute, Link } from '@tanstack/react-router'
import { Video, Clock, MapPin, Users, ShieldCheck, ArrowLeft, Camera } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MOCK_ACTIVE_SESSION } from '../lib/mockData'

export const Route = createFileRoute('/student/session-details')({
  component: StudentSessionDetailsPage,
})

function StudentSessionDetailsPage() {
  const session = MOCK_ACTIVE_SESSION

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Link to="/student" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-mono">{session.code}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">{session.subjectName}</h1>
          <p className="text-xs text-slate-400">Class Attendance Session Details & Policies</p>
        </div>

        <Link to="/student/verify">
          <Button variant="primary" size="sm">
            <Camera className="w-4 h-4 mr-1.5" />
            <span>Join Verification</span>
          </Button>
        </Link>
      </div>

      {/* Session Details Card */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Session Code</span>
            <p className="font-mono text-emerald-400 font-bold text-sm">{session.code}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Classroom Location</span>
            <p className="text-white font-semibold">{session.room}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Time Window</span>
            <p className="text-white font-semibold font-mono">{session.startTime} - {session.endTime}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Late Grace Period</span>
            <p className="text-amber-400 font-semibold">{session.lateThresholdMinutes} minutes threshold</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Geofence Boundary</span>
            <p className="text-cyan-400 font-semibold">{session.geofenceRadiusMeters} meters radius</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Verification Policy</span>
            <p className="text-purple-400 font-semibold">{session.verificationPolicy} Multi-Signal</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-300">
          <span className="font-bold text-white flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Attendance Requirements for this Session:</span>
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Ensure device is connected to campus Wi-Fi or localized cell range</li>
            <li>Use good front illumination; avoid back-lit windows</li>
            <li>Look directly into camera when scanning starts and follow any random gesture prompt</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
