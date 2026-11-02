import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Modal } from '../components/ui/modal'

export const Route = createFileRoute('/student/calendar')({
  component: StudentCalendarPage,
})

function StudentCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('November 2026')
  const [selectedDayInfo, setSelectedDayInfo] = useState<{ day: number; status: string; classes: string[] } | null>(null)

  // Generate 30 mock calendar days for November 2026
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const dayOfWeek = (day + 5) % 7 // Nov 1 2026 was a Sunday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    if (isWeekend) {
      return { day, status: 'No class', classes: [] }
    }
    if (day === 12) {
      return { day, status: 'Holiday', classes: ['Diwali Observance / Institutional Recess'] }
    }
    if (day === 5 || day === 18) {
      return { day, status: 'Absent', classes: ['Operating Systems (09:00 AM)'] }
    }
    if (day === 10 || day === 24) {
      return { day, status: 'Late', classes: ['Database Systems (10:00 AM - Check-in 10:07 AM)'] }
    }
    return {
      day,
      status: 'Present',
      classes: ['DBMS (10:00 AM)', 'Machine Learning (11:30 AM)', 'Computer Networks (02:00 PM)'],
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            <span>Attendance Calendar Overview</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual day-by-day record of verified attendance, absences, and holidays
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-3 font-mono">{currentMonth}</span>
          <button className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/80" />
          <span>Present (Full)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/80" />
          <span>Late Check-in</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-rose-500/80" />
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-cyan-500/80" />
          <span>Holiday / Recess</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded bg-slate-800" />
          <span>Weekend / No Class</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4 bg-slate-900/80 border-slate-800">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 pb-3 border-b border-slate-800">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-3">
          {calendarDays.map((item) => {
            const isPresent = item.status === 'Present'
            const isLate = item.status === 'Late'
            const isAbsent = item.status === 'Absent'
            const isHoliday = item.status === 'Holiday'

            return (
              <div
                key={item.day}
                onClick={() => setSelectedDayInfo(item)}
                className={`aspect-square p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-105 ${
                  isPresent
                    ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400'
                    : isLate
                    ? 'bg-amber-950/30 border-amber-500/40 hover:border-amber-400'
                    : isAbsent
                    ? 'bg-rose-950/30 border-rose-500/40 hover:border-rose-400'
                    : isHoliday
                    ? 'bg-cyan-950/30 border-cyan-500/40 hover:border-cyan-400'
                    : 'bg-slate-950/30 border-slate-800/60 opacity-40'
                }`}
              >
                <span className="text-xs font-mono font-bold text-slate-200">{item.day}</span>
                <span
                  className={`text-[9px] font-bold uppercase truncate px-1 py-0.5 rounded text-center ${
                    isPresent
                      ? 'text-emerald-400 bg-emerald-950'
                      : isLate
                      ? 'text-amber-400 bg-amber-950'
                      : isAbsent
                      ? 'text-rose-400 bg-rose-950'
                      : isHoliday
                      ? 'text-cyan-400 bg-cyan-950'
                      : 'text-slate-600'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Date Details Modal */}
      {selectedDayInfo && (
        <Modal
          isOpen={!!selectedDayInfo}
          onClose={() => setSelectedDayInfo(null)}
          title={`Attendance Details: Nov ${selectedDayInfo.day}, 2026`}
          description={`Overall Day Status: ${selectedDayInfo.status}`}
        >
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scheduled Sessions:</h4>
            {selectedDayInfo.classes.length === 0 ? (
              <p className="text-xs text-slate-400">No academic sessions conducted on this date.</p>
            ) : (
              selectedDayInfo.classes.map((cls, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  {cls}
                </div>
              ))
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
