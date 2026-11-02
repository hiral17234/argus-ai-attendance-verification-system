import { createFileRoute } from '@tanstack/react-router'
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/admin/reports')({
  component: AdminReportsPage,
})

function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Institutional Analytics & Regulatory Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">University-wide attendance compliance, debarment rosters, and AI audit statistics</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => alert('Compiling institutional audit report...')}>
          <Download className="w-4 h-4 mr-1.5" />
          <span>Export University Census</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Debarment & Shortage Roster</h3>
          <p className="text-xs text-slate-400">List of students across all engineering branches below 75% attendance cutoff.</p>
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => alert('Exporting Debarment Roster...')}>
            Download CSV
          </Button>
        </Card>

        <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
          <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Biometric Risk Interception Log</h3>
          <p className="text-xs text-slate-400">Detailed security log of spoofing attempts, replay attacks, and geofence anomalies.</p>
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => alert('Exporting Risk Log...')}>
            Download PDF
          </Button>
        </Card>

        <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
          <FileSpreadsheet className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Department Aggregate Audit</h3>
          <p className="text-xs text-slate-400">Term-wide attendance percentages categorized by department, semester, and faculty.</p>
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => alert('Exporting Aggregate Audit...')}>
            Download Excel
          </Button>
        </Card>
      </div>
    </div>
  )
}
