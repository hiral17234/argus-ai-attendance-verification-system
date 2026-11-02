import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Settings, Bell, Lock, Shield, Eye, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/student/settings')({
  component: StudentSettingsPage,
})

function StudentSettingsPage() {
  const [notifyShortage, setNotifyShortage] = useState(true)
  const [notifyReviews, setNotifyReviews] = useState(true)
  const [notifySessions, setNotifySessions] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          <span>Account & Security Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure notification channels, session alerts, and security options</p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Notification Preferences */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-800">
          <Bell className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Alert Preferences</h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Attendance Shortage Alerts</p>
              <p className="text-slate-400">Receive warnings when subject attendance falls below 75%</p>
            </div>
            <input
              type="checkbox"
              checked={notifyShortage}
              onChange={(e) => setNotifyShortage(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Verification Review Updates</p>
              <p className="text-slate-400">Notify me as soon as faculty approves or rejects an under-review attempt</p>
            </div>
            <input
              type="checkbox"
              checked={notifyReviews}
              onChange={(e) => setNotifyReviews(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">Session Window Reminders</p>
              <p className="text-slate-400">Push notifications when teacher activates dynamic session QR code</p>
            </div>
            <input
              type="checkbox"
              checked={notifySessions}
              onChange={(e) => setNotifySessions(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Password & Credential Management */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-800">
          <Lock className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Security & Password</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Current Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">New Institutional Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleSave}>
            Update Password
          </Button>
        </div>
      </Card>
    </div>
  )
}
