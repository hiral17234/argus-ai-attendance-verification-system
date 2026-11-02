import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Video, ShieldCheck, Clock, MapPin, Users, QrCode, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { MOCK_SUBJECTS } from '../lib/mockData'

export const Route = createFileRoute('/teacher/create-session')({
  component: TeacherCreateSessionPage,
})

function TeacherCreateSessionPage() {
  const navigate = useNavigate()
  const { setActiveSession } = useAttendanceSession()

  const [subjectId, setSubjectId] = useState(MOCK_SUBJECTS[0].id)
  const [section, setSection] = useState('A')
  const [room, setRoom] = useState('Lecture Hall 204 (North Block)')
  const [duration, setDuration] = useState('15')
  const [lateThreshold, setLateThreshold] = useState('5')
  const [policy, setPolicy] = useState<'Standard' | 'Enhanced' | 'Adaptive'>('Adaptive')
  const [geofence, setGeofence] = useState('150')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const selectedSub = MOCK_SUBJECTS.find((s) => s.id === subjectId) || MOCK_SUBJECTS[0]
    const code = `MNC-${selectedSub.code}-${Math.floor(100 + Math.random() * 900)}`

    setTimeout(() => {
      setActiveSession((prev) => ({
        ...prev,
        code,
        subjectId: selectedSub.id,
        subjectName: selectedSub.name,
        subjectCode: selectedSub.code,
        section,
        room,
        durationMinutes: Number(duration),
        lateThresholdMinutes: Number(lateThreshold),
        verificationPolicy: policy,
        geofenceRadiusMeters: Number(geofence),
        status: 'active',
        presentCount: 0,
        lateCount: 0,
        reviewCount: 0,
        rejectedCount: 0,
      }))
      setIsSubmitting(false)
      navigate({ to: '/teacher/session-qr' })
    }, 500)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Video className="w-6 h-6 text-emerald-400" />
          <span>Create Attendance Session</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Initiate an adaptive attendance window with dynamic QR code generation and real-time risk calibration
        </p>
      </div>

      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Course / Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {MOCK_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Class Section & Roster</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="A">B.Tech CSE - Section A (48 Students)</option>
                <option value="B">B.Tech CSE - Section B (46 Students)</option>
                <option value="C">B.Tech CSE - Section C (44 Students)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Room Location</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Window Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="10">10 Minutes Window</option>
                <option value="15">15 Minutes Window (Recommended)</option>
                <option value="20">20 Minutes Window</option>
                <option value="30">30 Minutes Window</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Late Attendance Threshold</label>
              <select
                value={lateThreshold}
                onChange={(e) => setLateThreshold(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="3">Late after 3 minutes</option>
                <option value="5">Late after 5 minutes (Standard)</option>
                <option value="10">Late after 10 minutes</option>
              </select>
            </div>
          </div>

          {/* Verification Policy Options */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Verification Policy Strength
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setPolicy('Adaptive')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  policy === 'Adaptive'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Adaptive Risk (Default)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dynamically scales verification based on device trust, location & biometric cosine match.
                </p>
              </div>

              <div
                onClick={() => setPolicy('Standard')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  policy === 'Standard'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <span>Standard Verification</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Uniform fixed ArcFace match threshold (0.80) + passive liveness check for all students.
                </p>
              </div>

              <div
                onClick={() => setPolicy('Enhanced')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  policy === 'Enhanced'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <span>High Security / Exam</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mandatory dual gesture challenge + strict 100m geofence radius for examination halls.
                </p>
              </div>
            </div>
          </div>

          {/* Location / Geofence Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Campus Geofence Boundary</label>
              <select
                value={geofence}
                onChange={(e) => setGeofence(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="150">Lecture Hall & Corridor (150m radius)</option>
                <option value="300">Academic Block (300m radius)</option>
                <option value="800">Whole University Campus (800m)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Class Attendance Mode</label>
              <input
                type="text"
                disabled
                value="ARGUS Biometric + Dynamic QR + Adaptive Risk"
                className="w-full h-10 px-3 text-xs bg-slate-950/50 border border-slate-800 rounded-lg text-emerald-400 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <Link to="/teacher">
              <Button variant="ghost" size="md">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
              <QrCode className="w-5 h-5 mr-2" />
              <span>Generate Dynamic QR & Start Session</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
