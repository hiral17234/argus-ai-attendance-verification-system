import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { User, Mail, GraduationCap, ShieldCheck, Save, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/student/profile')({
  component: StudentProfilePage,
})

function StudentProfilePage() {
  const { currentUser } = useAuth()
  const [phone, setPhone] = useState('+91 98765 43210')
  const [altEmail, setAltEmail] = useState('hiral.personal@gmail.com')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <User className="w-6 h-6 text-emerald-400" />
          <span>Student Academic Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Official institutional student registration and identity record</p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Profile contact preferences updated successfully.</span>
        </div>
      )}

      {/* Profile Card */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xl"
          />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
            <p className="text-xs text-slate-300 font-mono">
              Enrollment: <strong className="text-emerald-400">{currentUser.enrollmentNo}</strong>
            </p>
            <p className="text-xs text-slate-400">
              Department: {currentUser.department} • Semester {currentUser.semester || 6}
            </p>
          </div>
        </div>

        {/* Read-Only Academic Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">University Official Email</span>
            <p className="font-mono text-white font-semibold">{currentUser.email}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Degree & Specialization</span>
            <p className="text-white font-semibold">B.Tech in Computer Science & Engineering</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Section Allocation</span>
            <p className="text-white font-semibold">Section A (Class Coordinator: Dr. Sneha Roy)</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Biometric Verification Status</span>
            <p className="text-emerald-400 font-semibold flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ArcFace Vector Enrolled</span>
            </p>
          </div>
        </div>

        {/* Editable Contact Fields */}
        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contact Communication Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Emergency Mobile Contact</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Alternate Personal Email</label>
              <input
                type="email"
                value={altEmail}
                onChange={(e) => setAltEmail(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>Save Contact Preferences</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
