import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FileSpreadsheet, Download, FileText, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MOCK_SUBJECTS } from '../lib/mockData'

export const Route = createFileRoute('/teacher/reports')({
  component: TeacherReportsPage,
})

function TeacherReportsPage() {
  const [reportType, setReportType] = useState('Attendance Register Aggregate')
  const [subject, setSubject] = useState(MOCK_SUBJECTS[0].name)
  const [format, setFormat] = useState('PDF')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFile, setGeneratedFile] = useState<string | null>(null)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setGeneratedFile(null)

    setTimeout(() => {
      setIsGenerating(false)
      const filename = `ARGUS_${reportType.replace(/\s+/g, '_')}_${Date.now()}.${format.toLowerCase()}`
      setGeneratedFile(filename)
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
          <span>Institutional Attendance & Audit Reports</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export certified attendance records, biometric audit summaries, and debarment compliance spreadsheets
        </p>
      </div>

      {generatedFile && (
        <Card className="p-4 bg-emerald-950/30 border-emerald-500/40 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">Report Generated Successfully</p>
              <p className="text-[11px] text-emerald-400/90 font-mono">{generatedFile}</p>
            </div>
          </div>
          <Button
            variant="success"
            size="sm"
            onClick={() => alert(`Downloading ${generatedFile}...`)}
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>Download</span>
          </Button>
        </Card>
      )}

      {/* Report Generator Form */}
      <Card className="p-6 sm:p-8 bg-slate-900/90 border-slate-800 space-y-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
              >
                <option value="Attendance Register Aggregate">Course Attendance Register</option>
                <option value="Student Debarment Shortage Report">Debarment / Shortage Audit (&lt;75%)</option>
                <option value="Biometric Verification Telemetry Report">Biometric Telemetry & Risk Log</option>
                <option value="Teacher Manual Override Audit Log">Manual Override Audit Log</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Subject Cohort</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
              >
                {MOCK_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Date Range</label>
              <select className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white">
                <option>Current Semester to Date (Full Term)</option>
                <option>Last 30 Days</option>
                <option>Current Week</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Export File Format</label>
              <div className="grid grid-cols-3 gap-2 h-10">
                {['PDF', 'CSV', 'Excel'].map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setFormat(fmt)}
                    className={`rounded-lg border text-xs font-semibold transition-all ${
                      format === fmt
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="lg" isLoading={isGenerating}>
              <Download className="w-4 h-4 mr-2" />
              <span>Compile & Export Report</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
