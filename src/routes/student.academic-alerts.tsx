import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2, Calculator } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/student/academic-alerts')({
  component: StudentAcademicAlertsPage,
})

function StudentAcademicAlertsPage() {
  const [attended, setAttended] = useState(26)
  const [total, setTotal] = useState(38)
  const target = 75

  // Calculate classes required to reach 75%
  // (attended + x) / (total + x) >= 0.75
  // attended + x >= 0.75 * total + 0.75 * x
  // 0.25 * x >= 0.75 * total - attended
  // x = ceil((0.75 * total - attended) / 0.25)
  const calculateRequired = () => {
    const needed = Math.ceil((0.75 * total - attended) / 0.25)
    return Math.max(0, needed)
  }

  const requiredClasses = calculateRequired()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span>Academic Attendance Alerts & Compliance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official institutional warnings regarding the 75% minimum examination attendance threshold
          </p>
        </div>
      </div>

      {/* Primary Alert Card */}
      <Card className="p-6 bg-rose-950/20 border-rose-600/40 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                CRITICAL SHORTAGE
              </span>
              <h3 className="text-base font-bold text-white mt-1">Operating Systems & Concurrency (CS603)</h3>
              <p className="text-xs text-rose-300">Faculty: Dr. Rajesh Deshmukh • Department of CSE</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-rose-400">68.4%</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          Notice: University Ordinance Section 12.4 mandates a minimum of 75.0% aggregate attendance in each registered
          course to qualify for end-semester examinations. You currently have 26 attendances across 38 conducted
          sessions.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-amber-300 font-semibold">
            Action: Attend next {requiredClasses} consecutive classes without absence to restore eligibility.
          </span>
          <Link to="/student/appeals">
            <Button variant="outline" size="sm">
              <span>Submit Absence Appeal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Interactive Recovery Calculator */}
      <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <div className="flex items-center space-x-2.5">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Attendance Recovery Target Calculator</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Classes Attended So Far</label>
            <input
              type="number"
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Total Classes Conducted</label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              className="w-full h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block">Current Standing:</span>
            <span className="text-lg font-mono font-bold text-amber-400">
              {total > 0 ? ((attended / total) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">Consecutive Classes Required:</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">{requiredClasses} sessions</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
