import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { VerificationStatus } from '../components/verification/VerificationStatus'
import { ConfidenceScore } from '../components/verification/ConfidenceScore'
import { MOCK_SUBJECTS, MOCK_TIMETABLE, MOCK_ACTIVE_SESSION, MOCK_VERIFICATION_ATTEMPTS } from '../lib/mockData'

export const Route = createFileRoute('/student/')({
  component: StudentDashboard,
})

function StudentDashboard() {
  const { currentUser } = useAuth()
  const myRecentAttempt = MOCK_VERIFICATION_ATTEMPTS[0]

  return (
    <div className="space-y-6">
      {/* Student Profile & Active Session Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              {currentUser.enrollmentNo} • {currentUser.department} (Sem {currentUser.semester || 6}, Sec{' '}
              {currentUser.section || 'A'})
            </p>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
              <span className="flex items-center space-x-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Device Trusted (MacBook Air)</span>
              </span>
              <span>•</span>
              <span>Campus Geofence: Connected</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Link to="/student/verify" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full gap-2 shadow-lg shadow-emerald-950/50">
              <Camera className="w-4 h-4" />
              <span>Mark Attendance Now</span>
            </Button>
          </Link>
          <Link to="/student/timetable" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full gap-2">
              <Clock className="w-4 h-4" />
              <span>Timetable</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <AttendanceCard
          title="Overall Attendance"
          value="87.2%"
          subtitle="Above 75% threshold"
          variant="primary"
          icon="percent"
        />
        <AttendanceCard
          title="Total Attended"
          value="148"
          subtitle="Lectures & Labs"
          variant="success"
          icon="check"
        />
        <AttendanceCard
          title="Total Absent"
          value="19"
          subtitle="Missed sessions"
          variant="danger"
          icon="cross"
        />
        <AttendanceCard
          title="Late Check-ins"
          value="6"
          subtitle="Within threshold"
          variant="warning"
          icon="clock"
        />
        <AttendanceCard
          title="Shortage Subjects"
          value="1"
          subtitle="OS (68.4% alert)"
          variant="danger"
          icon="alert"
        />
      </div>

      {/* Active Session Callout */}
      {MOCK_ACTIVE_SESSION.status === 'active' && (
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 animate-pulse">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {MOCK_ACTIVE_SESSION.code}
                </span>
                <span className="text-xs font-semibold text-white">Live Attendance Window Open</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {MOCK_ACTIVE_SESSION.subjectName} • {MOCK_ACTIVE_SESSION.room} ({MOCK_ACTIVE_SESSION.startTime} -{' '}
                {MOCK_ACTIVE_SESSION.endTime})
              </p>
            </div>
          </div>
          <Link to="/student/verify">
            <Button variant="primary" size="sm">
              <span>Join Verification</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Grid: Today's Classes & Verification Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Today's Academic Schedule</span>
            </h3>
            <Link to="/student/timetable" className="text-xs text-emerald-400 hover:text-emerald-300">
              View full week →
            </Link>
          </div>

          <div className="space-y-2.5">
            {MOCK_TIMETABLE.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                className="p-3.5 bg-slate-900/60 border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{item.subjectName}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.subjectCode})</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {item.teacherName} • Room {item.room}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-xs font-mono text-slate-300 font-semibold block">{item.time}</span>
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded ${
                      item.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions Bar */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Quick Actions</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Link to="/student/attendance">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-center space-y-1 transition-colors">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Attendance</p>
                </Card>
              </Link>
              <Link to="/student/subjects">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-center space-y-1 transition-colors">
                  <BookOpen className="w-4 h-4 text-cyan-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Subjects</p>
                </Card>
              </Link>
              <Link to="/student/calendar">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-center space-y-1 transition-colors">
                  <Calendar className="w-4 h-4 text-purple-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Calendar</p>
                </Card>
              </Link>
              <Link to="/student/appeals">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-center space-y-1 transition-colors">
                  <FileText className="w-4 h-4 text-amber-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Appeals</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Latest Verification Outcome & Alerts */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Latest Verification Result</span>
            </h3>
            <Link to="/student/history" className="text-xs text-emerald-400 hover:text-emerald-300">
              History →
            </Link>
          </div>

          <Card className="p-4 bg-slate-900/80 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">{myRecentAttempt.subjectName}</p>
                <p className="text-[11px] text-slate-400 font-mono">Attempt #{myRecentAttempt.id} • Today</p>
              </div>
              <VerificationStatus status={myRecentAttempt.status} />
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2">
              <ConfidenceScore score={myRecentAttempt.signals.compositeConfidence} label="Identity Confidence" />
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-slate-400">
                  Liveness: <span className="text-emerald-400 font-medium">Passed ✓</span>
                </div>
                <div className="text-slate-400">
                  Location: <span className="text-emerald-400 font-medium">LH-204 ✓</span>
                </div>
                <div className="text-slate-400">
                  Device: <span className="text-emerald-400 font-medium">Trusted ✓</span>
                </div>
                <div className="text-slate-400">
                  Risk Level: <span className="text-emerald-400 font-medium">Low</span>
                </div>
              </div>
            </div>

            <Link
              to="/student/verification-details"
              className="w-full flex items-center justify-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 py-1"
            >
              <span>Inspect Full Multi-Signal Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>

          {/* Academic Shortage Alert Card */}
          <Card className="p-4 bg-amber-950/20 border-amber-600/30 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Attendance Warning: Operating Systems</span>
            </div>
            <p className="text-xs text-amber-200/80">
              Your current attendance is <span className="font-bold text-amber-300 font-mono">68.4%</span> (26 of 38
              conducted classes). You need to attend the next 4 consecutive sessions to reach 75%.
            </p>
            <div className="pt-1 flex items-center justify-between text-xs">
              <Link to="/student/academic-alerts" className="text-amber-400 hover:underline font-semibold">
                Action Plan & Calculation →
              </Link>
              <Link to="/student/appeals" className="text-slate-400 hover:text-white">
                Submit Appeal
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
