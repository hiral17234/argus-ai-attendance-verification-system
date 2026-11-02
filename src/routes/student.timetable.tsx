import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, Calendar, MapPin, User, BookOpen } from 'lucide-react'
import { Card } from '../components/ui/card'
import { MOCK_TIMETABLE } from '../lib/mockData'

export const Route = createFileRoute('/student/timetable')({
  component: StudentTimetablePage,
})

function StudentTimetablePage() {
  const [selectedDay, setSelectedDay] = useState('Monday')

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const dayEntries = MOCK_TIMETABLE.filter((entry) => entry.day === selectedDay)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            <span>Weekly Academic Timetable</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official class schedule with room locations and lecture/lab time slots
          </p>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedDay === day
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid for Selected Day */}
      <div className="space-y-3">
        {dayEntries.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 bg-slate-900/40">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs">No scheduled lectures or labs for {selectedDay}.</p>
          </Card>
        ) : (
          dayEntries.map((item) => (
            <Card
              key={item.id}
              className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {item.subjectCode}
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.subjectName}</h3>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                    {item.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.teacherName}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Room {item.room}</span>
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <span className="text-xs font-mono font-bold text-white">{item.time}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded mt-1 ${
                    item.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
