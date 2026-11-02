import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { User, Mail, GraduationCap, ShieldCheck, Save, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/teacher/profile')({
  component: TeacherProfilePage,
})

function TeacherProfilePage() {
  const { currentUser } = useAuth()
  const [phone, setPhone] = useState('+91 94251 09876')
  const [office, setOffice] = useState('Room 312, North Academic Block')
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
          <User className="w-6 h-6 text-emerald-400" />
          <span>Faculty Member Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Official faculty appointment details, office hours, and credentials</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Faculty profile details saved successfully.</span>
        </div>
      )}

      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xl"
          />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
            <p className="text-xs text-slate-300 font-mono">
              Employee ID: <strong className="text-emerald-400">{currentUser.employeeId}</strong>
            </p>
            <p className="text-xs text-slate-400">{currentUser.title} • {currentUser.department}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Institutional Email</span>
            <p className="font-mono text-white font-semibold">{currentUser.email}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400">Academic Lab Direction</span>
            <p className="text-white font-semibold">AI, Vision & Biometrics Research Lab</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-800 text-xs">
          <h3 className="font-bold text-slate-300 uppercase tracking-wider">Faculty Contact & Venue</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Faculty Extension / Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Faculty Office Location</label>
              <input
                type="text"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>Save Details</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
