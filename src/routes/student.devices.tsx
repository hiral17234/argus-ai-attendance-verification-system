import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Smartphone, Laptop, ShieldCheck, Trash2, AlertOctagon, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { MOCK_DEVICES } from '../lib/mockData'
import { DeviceRecord } from '../lib/types'

export const Route = createFileRoute('/student/devices')({
  component: StudentDevicesPage,
})

function StudentDevicesPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>(MOCK_DEVICES)
  const [notification, setNotification] = useState<string | null>(null)

  const handleRemoveDevice = (id: string, name: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id))
    setNotification(`Device "${name}" has been de-registered.`)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleReportSuspicious = (id: string, name: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, trustStatus: 'Suspicious' as const } : d))
    )
    setNotification(`Security flag logged for "${name}". Security office notified.`)
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-emerald-400" />
            <span>Registered Hardware & Trusted Devices</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ARGUS utilizes device hardware fingerprints to evaluate session risk and reduce verification friction
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Device List */}
      <div className="space-y-3">
        {devices.map((device) => {
          const isCurrent = device.isCurrentDevice
          const isTrusted = device.trustStatus === 'Trusted'

          return (
            <Card
              key={device.id}
              className={`p-5 space-y-4 border transition-colors ${
                isCurrent ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400">
                    {device.type === 'Laptop' ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white">{device.name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active Session Device
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {device.os} • {device.browser}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={isTrusted ? 'success' : device.trustStatus === 'Suspicious' ? 'danger' : 'warning'}
                  className="uppercase text-[10px] self-start sm:self-auto"
                >
                  {device.trustStatus}
                </Badge>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="space-y-0.5">
                  <div>
                    Last verified: <strong className="text-slate-200">{device.lastUsed}</strong>
                  </div>
                  <div>
                    Location: <span className="text-slate-300">{device.location}</span>
                  </div>
                </div>

                {!isCurrent && (
                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReportSuspicious(device.id, device.name)}
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-950/20"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 mr-1" />
                      <span>Report Suspicious</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDevice(device.id, device.name)}
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      <span>Remove</span>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
