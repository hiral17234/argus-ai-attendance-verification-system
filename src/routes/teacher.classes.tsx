import { createFileRoute, Link } from '@tanstack/react-router'
import { GraduationCap, Users, Clock, ArrowRight, Video } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/teacher/classes')({
  component: TeacherClassesPage,
})

function TeacherClassesPage() {
  const classes = [
    {
      id: 'cls-1',
      name: 'B.Tech CSE - 6th Semester (Section A)',
      subject: 'Database Management Systems (CS601)',
      studentsCount: 48,
      avgAttendance: 88.8,
      todaySession: '10:00 AM (Active Now)',
      room: 'LH-204',
      status: 'active',
    },
    {
      id: 'cls-2',
      name: 'B.Tech CSE - 6th Semester (Section B)',
      subject: 'Database Management Systems (CS601)',
      studentsCount: 46,
      avgAttendance: 84.2,
      todaySession: '02:00 PM (Scheduled)',
      room: 'LH-201',
      status: 'scheduled',
    },
    {
      id: 'cls-3',
      name: 'B.Tech CSE - 4th Semester (Section A)',
      subject: 'Data Structures & Algorithms (CS401)',
      studentsCount: 52,
      avgAttendance: 91.5,
      todaySession: 'None Today',
      room: 'LH-102',
      status: 'none',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <span>Assigned Academic Classes & Sections</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Classes and subject cohorts assigned to Dr. Ankit Sharma for Academic Session 2026-27
          </p>
        </div>

        <Link to="/teacher/create-session">
          <Button variant="primary" size="sm">
            <Video className="w-4 h-4 mr-1.5" />
            <span>Start Attendance Session</span>
          </Button>
        </Link>
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card
            key={cls.id}
            className="p-5 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all space-y-4"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                {cls.id.toUpperCase()}
              </span>
              <h3 className="text-base font-bold text-white mt-2 leading-tight">{cls.name}</h3>
              <p className="text-xs text-slate-400">{cls.subject}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Enrolled Students:</span>
                <strong className="text-white font-mono">{cls.studentsCount} Students</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Class Average:</span>
                <strong className="text-emerald-400 font-mono font-bold">{cls.avgAttendance}%</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Today's Slot:</span>
                <span className="text-slate-300 font-mono text-[11px]">{cls.todaySession}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/teacher/class-details"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>Class Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {cls.status === 'active' && (
                <Link to="/teacher/live">
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800 animate-pulse">
                    Live Now
                  </span>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
