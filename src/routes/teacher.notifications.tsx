import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Bell, CheckCheck, Trash2, ExternalLink } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MOCK_NOTIFICATIONS } from '../lib/mockData'

export const Route = createFileRoute('/teacher/notifications')({
  component: TeacherNotificationsPage,
})

function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            <span>Faculty Notifications & Security Alerts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Flagged attempt alerts, student appeals, and session reminders</p>
        </div>

        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
          <span>Mark All Read</span>
        </Button>
      </div>

      <div className="space-y-2.5">
        {notifications.map((item) => (
          <Card
            key={item.id}
            className={`p-4 border transition-colors flex items-start justify-between gap-3 ${
              item.read ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-900/90 border-amber-500/40'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white">{item.title}</span>
                <span className="text-[10px] uppercase font-semibold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">• {item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
              {item.actionUrl && (
                <Link
                  to={item.actionUrl}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1"
                >
                  <span>Take Action</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
