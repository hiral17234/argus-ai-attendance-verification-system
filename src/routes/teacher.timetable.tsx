import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Clock, Calendar, MapPin, Users } from 'lucide-react'
import { Card } from '../components/ui/card'

export const Route = createFileRoute('/teacher/timetable')({
  component: TeacherTimetablePage,
})

function TeacherTimetablePage() {
  const [selectedDay, setSelectedDay] = useState('Monday')

  const schedule = [
    { day: 'Monday', time: '10:00 - 11:00 AM', subject: 'Database Management Systems', class: 'B.Tech CSE - 6th Sem A', room: 'LH-204', type: 'Lecture' },
    { day: 'Monday', time: '02:00 - 04:00 PM', subject: 'DBMS Query Optimization Lab', class: 'B.Tech CSE - 6th Sem A', room: 'CS-LAB-4', type: 'Lab' },
    { day: 'Wednesday', time: '10:00 - 11:00 AM', subject: 'Database Management Systems', class: 'B.Tech CSE - 6th Sem A', room: 'LH-204', type: 'Lecture' },
    { day: 'Wednesday', time: '11:15 - 12:15 PM', subject: 'Database Systems (Elective)', class: 'B.Tech CSE - 6th Sem B', room: 'LH-201', type: 'Lecture' },
    { day: 'Friday', time: '10:00 - 11:00 AM', subject: 'Database Management Systems', class: 'B.Tech CSE - 6th Sem A', room: 'LH-204', type: 'Lecture' },
    { day: 'Friday', time: '03:00 - 05:00 PM', subject: 'AI & Biometrics Research Lab', class: 'M.Tech / Honors', room: 'AI-RESEARCH-LAB', type: 'Research' },
  ]

  const filtered = schedule.filter((s) => s.day === selectedDay)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Clock className="w-6 h-6 text-emerald-400" />
          <span>Faculty Academic Teaching Timetable</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Weekly instructional workload, lab sessions, and lecture venues</p>
      </div>

      {/* Day Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedDay === day
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 bg-slate-900/40">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs">No scheduled teaching lectures or labs for {selectedDay}.</p>
          </Card>
        ) : (
          filtered.map((item, idx) => (
            <Card
              key={idx}
              className="p-4 bg-slate-900/80 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white">{item.subject}</h3>
                  <span className="text-[10px] uppercase font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {item.class} • Room {item.room}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-white block">{item.time}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
