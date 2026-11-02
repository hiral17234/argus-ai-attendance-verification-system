import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, TrendingUp, ShieldCheck, Cpu, Clock, Award, Activity } from 'lucide-react'
import { Card } from '../components/ui/card'
import { AttendanceChart } from '../components/attendance/AttendanceChart'
import { AttendanceCard } from '../components/attendance/AttendanceCard'
import { MOCK_ANALYTICS } from '../lib/mockData'

export const Route = createFileRoute('/teacher/analytics')({
  component: TeacherAnalyticsPage,
})

function TeacherAnalyticsPage() {
  const metrics = MOCK_ANALYTICS.verificationMetrics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <span>Class Attendance & AI Verification Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Attendance trends, biometric pipeline metrics, FAR/FRR benchmarks, and adaptive risk engine telemetry
        </p>
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AttendanceCard
          title="Average Attendance Rate"
          value="86.4%"
          subtitle="Across all sections"
          variant="success"
          icon="percent"
        />
        <AttendanceCard
          title="Highest Class Rate"
          value="95.6%"
          subtitle="DSA Section B"
          variant="primary"
          icon="check"
        />
        <AttendanceCard
          title="Shortage Risk Students"
          value="14"
          subtitle="Below 75% threshold"
          variant="danger"
          icon="alert"
        />
        <AttendanceCard
          title="Avg Verification Time"
          value="1.42s"
          subtitle="Sub-second response target"
          variant="default"
          icon="clock"
        />
      </div>

      {/* Weekly Trend Chart */}
      <AttendanceChart data={MOCK_ANALYTICS.weeklyTrend} />

      {/* Computer Vision & Verification Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CV Pipeline Metrics */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Biometric Pipeline Validation Rates</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                PROTOTYPE METRICS
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>ArcFace Facial Similarity Pass Rate</span>
                  <span className="font-mono text-emerald-400 font-bold">{metrics.faceMatchSuccessRate}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metrics.faceMatchSuccessRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Passive Liveness (Anti-Replay) Pass Rate</span>
                  <span className="font-mono text-emerald-400 font-bold">{metrics.livenessPassRate}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metrics.livenessPassRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Random Gesture Challenge Completion</span>
                  <span className="font-mono text-cyan-400 font-bold">{metrics.challengeCompletionRate}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${metrics.challengeCompletionRate}%` }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Security & Error Tradeoff Targets */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>FAR / FRR Security Targets</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">BENCHMARK MODEL</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">False Match Target (FAR)</span>
                <p className="font-mono text-emerald-400 font-bold text-sm">{metrics.targetFAR}</p>
                <p className="text-[10px] text-slate-500">Preventing proxy attendance</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">False Rejection Target (FRR)</span>
                <p className="font-mono text-amber-400 font-bold text-sm">{metrics.targetFRR}</p>
                <p className="text-[10px] text-slate-500">Minimizing student friction</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Teacher Review Rate</span>
                <p className="font-mono text-cyan-400 font-bold text-sm">{metrics.reviewRate}</p>
                <p className="text-[10px] text-slate-500">Low cognitive burden on faculty</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Anomaly Interception</span>
                <p className="font-mono text-rose-400 font-bold text-sm">{metrics.anomalyRejectionRate}</p>
                <p className="text-[10px] text-slate-500">Auto-blocked attacks</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Research Novelty Evaluation: Baseline vs ARGUS */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Comparative Research Evaluation</h3>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4">Baseline (Fixed Threshold Face Scan)</th>
                <th className="py-3 px-4 text-emerald-400 font-bold">ARGUS (Adaptive Multi-Signal Risk)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Photo / Screen Replay Vulnerability</td>
                <td className="py-3 px-4 text-rose-400">High (Susceptible to 2D screen playback)</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Low (Defeated by passive liveness + gesture)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Proxy from Dormitory / Outside Class</td>
                <td className="py-3 px-4 text-rose-400">Possible (No geofence validation)</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Blocked (Campus AP polygon verified)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">False Rejections in Poor Lighting</td>
                <td className="py-3 px-4 text-rose-400">High (Rejects student directly)</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Low (Adapts: prompts challenge / teacher review)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Biometric Storage Privacy</td>
                <td className="py-3 px-4 text-amber-400">Often stores raw facial photographs</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Zero-raw frame storage; 512-d embeddings only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
