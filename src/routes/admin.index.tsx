import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Video,
  Clock,
  AlertTriangle,
  Smartphone,
  History,
  FileSpreadsheet,
  Sliders,
  ArrowRight,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { useAttendanceSession } from '../hooks/useAttendanceSession'
import { MOCK_AUDIT_LOGS } from '../lib/mockData'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { auditLogs } = useAttendanceSession()

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              INSTITUTIONAL ADMINISTRATION
            </span>
            <span className="text-xs text-slate-400">• Term: Autumn 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Institutional Governance & System Audit</h1>
          <p className="text-xs text-slate-400">
            University-wide attendance compliance, biometric risk threshold policy, and hardware device security
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link to="/admin/verification">
            <Button variant="primary" size="md">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              <span>Configure Verification Policy</span>
            </Button>
          </Link>
          <Link to="/admin/audit">
            <Button variant="outline" size="md">
              <History className="w-4 h-4 mr-1.5" />
              <span>Full Audit Trail</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Institutional Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <AttendanceCard
          title="Total Students"
          value="3,420"
          subtitle="Enrolled active"
          variant="default"
          icon="check"
        />
        <AttendanceCard
          title="Faculty Members"
          value="148"
          subtitle="Teaching staff"
          variant="default"
          icon="check"
        />
        <AttendanceCard
          title="Active Sessions"
          value="8 Live"
          subtitle="Campus wide"
          variant="primary"
          icon="clock"
        />
        <AttendanceCard
          title="Today's Attendance"
          value="89.2%"
          subtitle="Aggregate"
          variant="success"
          icon="percent"
        />
        <AttendanceCard
          title="Risk Alerts"
          value="14"
          subtitle="Under review"
          variant="warning"
          icon="alert"
        />
        <AttendanceCard
          title="System Health"
          value="99.98%"
          subtitle="All nodes active"
          variant="success"
          icon="check"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/students">
          <Card className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Student Directory</h3>
            <p className="text-xs text-slate-400">Manage student enrollment, department assignments, and attendance status.</p>
          </Card>
        </Link>

        <Link to="/admin/verification">
          <Card className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Verification Policies</h3>
            <p className="text-xs text-slate-400">Configure ArcFace similarity thresholds, campus geofence, and liveness algorithms.</p>
          </Card>
        </Link>

        <Link to="/admin/devices">
          <Card className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 w-fit">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Device Trust Engine</h3>
            <p className="text-xs text-slate-400">Review student hardware registrations, manage suspicious MAC addresses, and revocations.</p>
          </Card>
        </Link>

        <Link to="/admin/audit">
          <Card className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors space-y-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-fit">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">System Audit Trail</h3>
            <p className="text-xs text-slate-400">Immutable ledger of every manual override, teacher review, and security anomaly.</p>
          </Card>
        </Link>
      </div>

      {/* Recent System Audit Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Recent System Audit Events</span>
          </h3>
          <Link to="/admin/audit" className="text-xs text-emerald-400 hover:text-emerald-300">
            View full log stream →
          </Link>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{log.userName}</td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 text-[11px]">{log.target}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.result === 'Success' || log.result === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : log.result === 'Flagged'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
