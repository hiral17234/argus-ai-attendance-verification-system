import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  ShieldCheck,
  LayoutDashboard,
  Camera,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  Smartphone,
  AlertTriangle,
  HelpCircle,
  Settings,
  Users,
  Video,
  CheckCircle,
  FileSpreadsheet,
  BarChart3,
  Sliders,
  History,
  Lock,
  GraduationCap,
  Bell,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

interface NavItem {
  label?: string
  isHeader?: boolean
  name?: string
  path?: string
  icon?: React.ComponentType<{ className?: string }>
  highlight?: boolean
  badge?: string
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { currentRole } = useAuth()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const studentNav: NavItem[] = [
    { label: 'Overview', isHeader: true },
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Verify Attendance', path: '/student/verify', icon: Camera, highlight: true },
    { name: 'My Attendance', path: '/student/attendance', icon: CheckCircle },
    { name: 'Calendar View', path: '/student/calendar', icon: Calendar },
    { name: 'History Records', path: '/student/history', icon: History },
    { label: 'Academic & Courses', isHeader: true },
    { name: 'Weekly Timetable', path: '/student/timetable', icon: Clock },
    { name: 'Enrolled Subjects', path: '/student/subjects', icon: BookOpen },
    { name: 'Academic Alerts', path: '/student/academic-alerts', icon: AlertTriangle, badge: '1' },
    { label: 'Identity & Security', isHeader: true },
    { name: 'Face Profile', path: '/student/face-profile', icon: UserCheck },
    { name: 'Registered Devices', path: '/student/devices', icon: Smartphone },
    { name: 'Appeals & Inquiries', path: '/student/appeals', icon: FileText },
    { name: 'Privacy & Retention', path: '/student/privacy', icon: Lock },
    { name: 'Help & FAQs', path: '/student/help', icon: HelpCircle },
    { name: 'Account Settings', path: '/student/settings', icon: Settings },
  ]

  const teacherNav: NavItem[] = [
    { label: 'Operations', isHeader: true },
    { name: 'Teacher Dashboard', path: '/teacher', icon: LayoutDashboard },
    { name: 'Create Session', path: '/teacher/create-session', icon: Video, highlight: true },
    { name: 'Live Attendance', path: '/teacher/live', icon: Camera, badge: 'Live' },
    { name: 'Verification Review', path: '/teacher/verification-review', icon: ShieldCheck, badge: '2' },
    { name: 'Attendance Register', path: '/teacher/attendance-register', icon: FileSpreadsheet },
    { label: 'Roster & Academic', isHeader: true },
    { name: 'Assigned Classes', path: '/teacher/classes', icon: GraduationCap },
    { name: 'Enrolled Students', path: '/teacher/students', icon: Users },
    { name: 'Teaching Subjects', path: '/teacher/subjects', icon: BookOpen },
    { name: 'Teacher Timetable', path: '/teacher/timetable', icon: Clock },
    { label: 'Overrides & Audit', isHeader: true },
    { name: 'Manual Attendance', path: '/teacher/manual-attendance', icon: UserCheck },
    { name: 'Attendance History', path: '/teacher/history', icon: History },
    { name: 'Student Appeals', path: '/teacher/appeals', icon: FileText, badge: '2' },
    { name: 'Class Analytics', path: '/teacher/analytics', icon: BarChart3 },
    { name: 'Export Reports', path: '/teacher/reports', icon: FileSpreadsheet },
    { name: 'Teacher Settings', path: '/teacher/settings', icon: Settings },
  ]

  const adminNav: NavItem[] = [
    { label: 'Institutional Admin', isHeader: true },
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Students Directory', path: '/admin/students', icon: Users },
    { name: 'Faculty Directory', path: '/admin/teachers', icon: GraduationCap },
    { name: 'Academic Classes', path: '/admin/classes', icon: BookOpen },
    { name: 'Departments & Subjects', path: '/admin/subjects', icon: BookOpen },
    { label: 'Security & Verification', isHeader: true },
    { name: 'Verification Policies', path: '/admin/verification', icon: ShieldCheck },
    { name: 'Device Trust Registry', path: '/admin/devices', icon: Smartphone },
    { name: 'System Audit Logs', path: '/admin/audit', icon: History },
    { name: 'Institutional Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Platform Settings', path: '/admin/settings', icon: Sliders },
  ]

  const currentNavItems =
    currentRole === 'teacher' ? teacherNav : currentRole === 'admin' || currentRole === 'superadmin' ? adminNav : studentNav

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col transition-transform duration-200 lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80 bg-slate-950/50">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors shadow-sm shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-wider text-white text-base font-mono">ARGUS</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-tight font-medium">Adaptive Risk Verification</p>
          </div>
        </Link>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium capitalize">Portal Context:</span>
        <span className="font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 uppercase tracking-wide text-[10px]">
          {currentRole}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {currentNavItems.map((item, idx) => {
          if (item.isHeader) {
            return (
              <div key={idx} className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {item.label}
              </div>
            )
          }

          const Icon = item.icon!
          const isActive = currentPath === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group relative',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80',
                item.highlight && !isActive && 'bg-slate-900/40 text-emerald-400 border border-emerald-500/20'
              )}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200',
                    item.highlight && !isActive && 'text-emerald-400'
                  )}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0 uppercase tracking-wider',
                    item.badge === 'Live'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-medium">Risk Engine</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400">ACTIVE</span>
        </div>
        <p className="text-[10px] text-slate-400">Zero-Raw Biometric Retention Policy</p>
      </div>
    </aside>
  )
}
