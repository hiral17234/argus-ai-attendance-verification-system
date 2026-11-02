import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Menu,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Laptop,
} from 'lucide-react'
import { Breadcrumbs } from './Breadcrumbs'
import { UserMenu } from './UserMenu'
import { useAuth } from '../../hooks/useAuth'
import { MOCK_NOTIFICATIONS } from '../../lib/mockData'
import { UserRole } from '../../lib/types'

interface TopbarProps {
  onToggleSidebar?: () => void
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { currentRole, switchRole } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const rolePills: { role: UserRole; label: string }[] = [
    { role: 'student', label: 'Student' },
    { role: 'teacher', label: 'Teacher' },
    { role: 'admin', label: 'Admin' },
  ]

  return (
    <header className="h-16 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
      {/* Left side: Hamburger + Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Breadcrumbs />
      </div>

      {/* Right side: Fast Portal Switcher + Notification Bell + User Menu */}
      <div className="flex items-center space-x-3">
        {/* Quick Role Switcher pills */}
        <div className="hidden sm:flex items-center p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          {rolePills.map((pill) => (
            <button
              key={pill.role}
              onClick={() => switchRole(pill.role)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentRole === pill.role
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold rounded-full text-[9px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-3 space-y-3 animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-white">System Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-lg border text-xs space-y-1 transition-colors ${
                          item.read
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-white text-xs">{item.title}</span>
                          <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{item.message}</p>
                        {item.actionUrl && (
                          <Link
                            to={item.actionUrl}
                            onClick={() => setShowNotifications(false)}
                            className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 hover:text-emerald-300 pt-1"
                          >
                            <span>View details</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Account Menu */}
        <UserMenu />
      </div>
    </header>
  )
}
