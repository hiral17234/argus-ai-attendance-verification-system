import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Users, Video, ArrowRight } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/teacher/subjects')({
  component: TeacherSubjectsPage,
})

function TeacherSubjectsPage() {
  const subjects = [
    {
      code: 'CS601',
      name: 'Database Management Systems',
      classesCount: 2,
      totalStudents: 94,
      avgAttendance: 86.5,
      syllabus: '78% completed',
    },
    {
      code: 'CS401',
      name: 'Data Structures & Algorithms',
      classesCount: 1,
      totalStudents: 52,
      avgAttendance: 91.5,
      syllabus: '82% completed',
    },
    {
      code: 'CS802',
      name: 'Advanced Biometric Computing & ML',
      classesCount: 1,
      totalStudents: 28,
      avgAttendance: 94.0,
      syllabus: '65% completed',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Assigned Teaching Courses</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Course modules, enrolled cohort tallies, and aggregate attendance</p>
        </div>

        <Link to="/teacher/create-session">
          <Button variant="primary" size="sm">
            <Video className="w-4 h-4 mr-1.5" />
            <span>Create Session</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <Card key={s.code} className="p-5 bg-slate-900/80 border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                {s.code}
              </span>
              <h3 className="text-base font-bold text-white mt-2 leading-tight">{s.name}</h3>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Assigned Sections:</span>
                <strong className="text-white">{s.classesCount} Sections</strong>
              </div>
              <div className="flex justify-between">
                <span>Enrolled Total:</span>
                <strong className="text-white">{s.totalStudents} Students</strong>
              </div>
              <div className="flex justify-between">
                <span>Aggregate Attendance:</span>
                <strong className="text-emerald-400 font-mono font-bold">{s.avgAttendance}%</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <Link
                to="/teacher/classes"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                <span>View Classes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
