import { Card } from '../ui/card'

interface AttendanceChartProps {
  data?: { day: string; rate: number; present: number; absent: number }[]
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const chartData = data || [
    { day: 'Mon', rate: 89, present: 285, absent: 35 },
    { day: 'Tue', rate: 84, present: 269, absent: 51 },
    { day: 'Wed', rate: 88, present: 282, absent: 38 },
    { day: 'Thu', rate: 91, present: 291, absent: 29 },
    { day: 'Fri', rate: 82, present: 262, absent: 58 },
  ]

  const maxVal = 100

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">Institutional Attendance Trends</h4>
          <p className="text-xs text-slate-400">Weekly aggregate across all semester classes</p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center space-x-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span>Attendance Rate (%)</span>
          </span>
        </div>
      </div>

      <div className="pt-4 h-48 flex items-end justify-between gap-4 px-2">
        {chartData.map((d) => {
          const heightPercent = (d.rate / maxVal) * 100
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                {d.rate}%
              </div>
              <div className="w-full bg-slate-800/80 rounded-t-lg h-36 flex items-end overflow-hidden">
                <div
                  className="w-full bg-emerald-500/80 hover:bg-emerald-400 rounded-t-lg transition-all duration-300 relative group-hover:shadow-lg group-hover:shadow-emerald-500/20"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400">{d.day}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
