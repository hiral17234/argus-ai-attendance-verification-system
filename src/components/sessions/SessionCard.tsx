import { Link } from '@tanstack/react-router'
import { AttendanceSession } from '../../lib/types'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Clock, MapPin, Users, ShieldAlert, ArrowRight } from 'lucide-react'

interface SessionCardProps {
  session: AttendanceSession
  role?: 'student' | 'teacher'
}

export function SessionCard({ session, role = 'student' }: SessionCardProps) {
  const isTeacher = role === 'teacher'

  return (
    <Card className="border-slate-800 hover:border-slate-700 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
            {session.code}
          </span>
          <h3 className="text-base font-bold text-white mt-1.5">{session.subjectName}</h3>
          <p className="text-xs text-slate-400">{session.teacherName}</p>
        </div>
        <Badge variant={session.status === 'active' ? 'success' : 'default'} className="uppercase text-[10px]">
          {session.status === 'active' ? '• Active Session' : session.status}
        </Badge>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>{session.startTime} - {session.endTime}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate">{session.room}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{session.presentCount} / {session.totalStudents} Present</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>Policy: {session.verificationPolicy}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Late threshold: {session.lateThresholdMinutes} mins
        </span>
        <Link
          to={isTeacher ? '/teacher/live' : '/student/verify'}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
        >
          <span>{isTeacher ? 'Monitor Live' : 'Join Verification'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  )
}
