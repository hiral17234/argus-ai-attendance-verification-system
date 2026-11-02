import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Smartphone, Laptop, ShieldCheck, Search, Filter, Ban, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export const Route = createFileRoute('/admin/devices')({
  component: AdminDevicesPage,
})

function AdminDevicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [devices, setDevices] = useState([
    { id: 'dev-1', name: 'MacBook Air M2', user: 'Hiral Goyal (0901CS221045)', role: 'Student', trust: 'Trusted', ip: '10.14.22.81', lastSeen: 'Today 10:42 AM' },
    { id: 'dev-2', name: 'OnePlus 11R', user: 'Rahul Sharma (0901CS221078)', role: 'Student', trust: 'Unknown', ip: '10.14.22.95', lastSeen: 'Today 10:44 AM' },
    { id: 'dev-3', name: 'Dell XPS 15', user: 'Dr. Ankit Sharma (EMP-CS-8812)', role: 'Teacher', trust: 'Trusted', ip: '10.14.1.44', lastSeen: 'Today 10:00 AM' },
    { id: 'dev-4', name: 'Linux Workstation', user: 'Priya Patel (0901CS221089)', role: 'Student', trust: 'Suspicious', ip: '172.16.8.12', lastSeen: 'Today 10:48 AM' },
  ])

  const setDeviceTrust = (id: string, trust: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, trust } : d)))
  }

  const filtered = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.user.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Smartphone className="w-6 h-6 text-emerald-400" />
          <span>Institutional Hardware Device Registry</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Hardware fingerprint inventory, cryptographic device trust classification, and proxy attack prevention
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by device, student, or IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Device Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Device & Hardware</th>
              <th className="py-3 px-4">Associated User</th>
              <th className="py-3 px-4">Campus IP</th>
              <th className="py-3 px-4">Trust Status</th>
              <th className="py-3 px-4">Last Verified</th>
              <th className="py-3 px-4 text-right">Administrative Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">{d.name}</td>
                <td className="py-3 px-4 text-slate-300">{d.user}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">{d.ip}</td>
                <td className="py-3 px-4">
                  <Badge
                    variant={d.trust === 'Trusted' ? 'success' : d.trust === 'Suspicious' ? 'danger' : 'warning'}
                    className="text-[10px] uppercase font-bold"
                  >
                    {d.trust}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-slate-400">{d.lastSeen}</td>
                <td className="py-3 px-4 text-right space-x-1.5">
                  <button
                    onClick={() => setDeviceTrust(d.id, 'Trusted')}
                    className="px-2.5 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                  >
                    Trust
                  </button>
                  <button
                    onClick={() => setDeviceTrust(d.id, 'Blocked')}
                    className="px-2.5 py-1 text-xs rounded bg-rose-600 hover:bg-rose-500 text-white font-medium"
                  >
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
