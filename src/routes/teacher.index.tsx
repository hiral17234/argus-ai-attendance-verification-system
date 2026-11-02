import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Users,
  Video,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { AttendanceChart } from '../components/attendance/AttendanceChart'
import { useAuth } from '../hooks/useAuth'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { MOCK_ACTIVE_SESSION, MOCK_ANALYTICS } from '../lib/mockData'

export const Route = createFileRoute('/teacher/')({
  component: TeacherDashboard,
})

function TeacherDashboard() {
  const { currentUser } = useAuth()
  const { attempts } = useAttendanceSession()

  const pendingReviews = attempts.filter((a) => a.status === 'Review')
  const presentCount = attempts.filter((a) => a.status === 'Present').length

  return (
    <div className="space-y-6">
      {/* Teacher Welcome & Fast Launch Hero */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                FACULTY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              {currentUser.employeeId} • {currentUser.title} ({currentUser.department})
            </p>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
              <span className="flex items-center space-x-1 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARGUS Adaptive Risk Engine v2.0 Active</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Link to="/teacher/create-session" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full gap-2 shadow-lg shadow-emerald-950/50">
              <Video className="w-4 h-4" />
              <span>Create Attendance Session</span>
            </Button>
          </Link>
          <Link to="/teacher/live" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" className="w-full gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Open Live Monitor</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <AttendanceCard
          title="Active Sessions"
          value="1 Active"
          subtitle="MNC-DBMS-241"
          variant="primary"
          icon="clock"
        />
        <AttendanceCard
          title="Students Present"
          value={presentCount}
          subtitle="Verified today"
          variant="success"
          icon="check"
        />
        <AttendanceCard
          title="Pending Reviews"
          value={pendingReviews.length}
          subtitle="Flagged by Risk Engine"
          variant={pendingReviews.length > 0 ? 'warning' : 'default'}
          icon="alert"
        />
        <AttendanceCard
          title="Daily Attendance"
          value="89.4%"
          subtitle="Across assigned classes"
          variant="default"
          icon="percent"
        />
        <AttendanceCard
          title="Pending Appeals"
          value="2"
          subtitle="Student inquiries"
          variant="warning"
          icon="alert"
        />
      </div>

      {/* Active Session Notification Card */}
      <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 animate-pulse">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {MOCK_ACTIVE_SESSION.code}
              </span>
              <span className="text-xs font-semibold text-white">
                Live Attendance Active: {MOCK_ACTIVE_SESSION.subjectName}
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Lecture Hall 204 • {MOCK_ACTIVE_SESSION.presentCount}/{MOCK_ACTIVE_SESSION.totalStudents} checked in •{' '}
              {MOCK_ACTIVE_SESSION.reviewCount} flagged for review
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/teacher/session-qr">
            <Button variant="outline" size="sm">
              <span>View QR Code</span>
            </Button>
          </Link>
          <Link to="/teacher/live">
            <Button variant="primary" size="sm">
              <span>Monitor Live Roster</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Pending Reviews & Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flagged Attempts Waiting for Teacher Visual Review */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Flagged Attempts Pending Review ({pendingReviews.length})</span>
            </h3>
            <Link to="/teacher/verification-review" className="text-xs text-emerald-400 hover:text-emerald-300">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((att) => (
              <Card
                key={att.id}
                className="p-4 bg-slate-900/80 border-amber-500/30 hover:border-amber-500/60 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        att.studentAvatar ||
                        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250'
                      }
                      alt={att.studentName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{att.studentName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{att.studentEnrollment}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    Match: {Math.round(att.signals.faceScore * 100)}%
                  </span>
                </div>

                <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="text-amber-400 font-semibold block">Adaptive Risk Reason:</span>
                  <p>{att.signals.humanExplanation}</p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <Link
                    to="/teacher/attempt-details"
                    className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700"
                  >
                    Inspect Attempt
                  </Link>
                  <Link
                    to="/teacher/verification-review"
                    className="text-xs text-white px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 font-semibold"
                  >
                    Review Decision
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Teacher Workflows</p>
            <div className="grid grid-cols-2 gap-2.5">
              <Link to="/teacher/attendance-register">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800 border-slate-800 text-center space-y-1">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Attendance Register</p>
                </Card>
              </Link>
              <Link to="/teacher/manual-attendance">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800 border-slate-800 text-center space-y-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Manual Check-in</p>
                </Card>
              </Link>
              <Link to="/teacher/analytics">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800 border-slate-800 text-center space-y-1">
                  <BarChart3 className="w-4 h-4 text-purple-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Class Analytics</p>
                </Card>
              </Link>
              <Link to="/teacher/reports">
                <Card className="p-3 bg-slate-900/50 hover:bg-slate-800 border-slate-800 text-center space-y-1">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400 mx-auto" />
                  <p className="text-xs font-medium text-slate-200">Export Reports</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Analytics & Verification Outcomes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Weekly Attendance & Biometric Outcomes</span>
            </h3>
            <Link to="/teacher/analytics" className="text-xs text-emerald-400 hover:text-emerald-300">
              Detailed metrics →
            </Link>
          </div>

          <AttendanceChart data={MOCK_ANALYTICS.weeklyTrend} />

          {/* Prototype CV Pipeline Performance Metrics */}
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Prototype AI / CV Performance Measurements
              </h4>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Validation Benchmark
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 text-[11px]">ArcFace Match Rate</span>
                <p className="font-mono font-bold text-emerald-400 text-sm">
                  {MOCK_ANALYTICS.verificationMetrics.faceMatchSuccessRate}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 text-[11px]">Liveness Pass Rate</span>
                <p className="font-mono font-bold text-emerald-400 text-sm">
                  {MOCK_ANALYTICS.verificationMetrics.livenessPassRate}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 text-[11px]">Average Latency</span>
                <p className="font-mono font-bold text-cyan-400 text-sm">
                  {MOCK_ANALYTICS.verificationMetrics.averageVerificationLatencyMs}ms
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 text-[11px]">Teacher Review Rate</span>
                <p className="font-mono font-bold text-amber-400 text-sm">
                  {MOCK_ANALYTICS.verificationMetrics.reviewRate}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
