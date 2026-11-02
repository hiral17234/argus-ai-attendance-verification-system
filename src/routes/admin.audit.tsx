import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { History, Search, Filter, ShieldCheck, Download } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useAttendanceSession } from '../hooks/useAttendanceSession'

export const Route = createFileRoute('/admin/audit')({
  component: AdminAuditPage,
})

function AdminAuditPage() {
  const { auditLogs } = useAttendanceSession()
  const [searchTerm, setSearchTerm] = useState('')

  const filtered = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>Institutional Security & System Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable cryptographic audit ledger recording every manual attendance override, verification approval, and policy change
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => alert('Exporting audit ledger CSV...')}>
          <Download className="w-4 h-4 mr-1.5" />
          <span>Export Audit Ledger</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search action, user, or target..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">Outcome</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">Details & Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3 px-4 font-semibold text-slate-200">{log.userName}</td>
                <td className="py-3 px-4">
                  <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {log.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-white">{log.action}</td>
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
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                <td className="py-3 px-4 text-slate-300 max-w-xs">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
