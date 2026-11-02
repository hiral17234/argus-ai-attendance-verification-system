import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Bell, CheckCheck, Trash2, ExternalLink } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MOCK_NOTIFICATIONS } from '../lib/mockData'
import { NotificationItem } from '../lib/types'

export const Route = createFileRoute('/student/notifications')({
  component: StudentNotificationsPage,
})

function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState('ALL')

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true
    return n.category.toUpperCase() === filter
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            <span>Student Notification Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System notices, verification outcomes, appeal updates, and attendance alerts
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
            <span>Mark All Read</span>
          </Button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
        {['ALL', 'ATTENDANCE', 'VERIFICATION', 'APPEALS', 'ACADEMIC'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filter === cat
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 bg-slate-900/40">
            <p className="text-xs">No notifications found in this category.</p>
          </Card>
        ) : (
          filtered.map((item) => (
            <Card
              key={item.id}
              className={`p-4 border transition-colors flex items-start justify-between gap-3 ${
                item.read ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-900/90 border-emerald-500/40'
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
                    <span>View Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <button
                onClick={() => deleteNotification(item.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
