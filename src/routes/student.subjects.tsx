import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, User, ArrowRight, Award, AlertCircle } from 'lucide-react'
import { Card } from '../components/ui/card'
import { MOCK_SUBJECTS } from '../lib/mockData'

export const Route = createFileRoute('/student/subjects')({
  component: StudentSubjectsPage,
})

function StudentSubjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Enrolled Academic Subjects</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Current semester coursework, credit allocations, and attendance compliance
          </p>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SUBJECTS.map((sub) => {
          const isShortage = sub.attendanceRate < 75
          return (
            <Card
              key={sub.id}
              className={`p-5 space-y-4 border transition-all hover:border-slate-600 ${
                isShortage ? 'border-amber-600/40 bg-slate-900/90' : 'border-slate-800 bg-slate-900/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                    {sub.code}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2 leading-tight">{sub.name}</h3>
                </div>
                <span className="text-xs font-mono text-slate-400 font-semibold">{sub.credits} Credits</span>
              </div>

              <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{sub.teacherName}</span>
              </div>

              {/* Progress and Stats */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Attendance</span>
                  <span
                    className={`font-mono font-bold ${
                      isShortage ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {sub.attendanceRate}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isShortage ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${sub.attendanceRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>
                    Attended: <strong className="text-white">{sub.attendedClasses}</strong>/{sub.totalClasses}
                  </span>
                  {isShortage && <span className="text-rose-400 font-sans font-semibold">Shortage Alert</span>}
                </div>
              </div>

              <Link
                to="/student/subject-details"
                className="w-full pt-2 flex items-center justify-between text-xs text-emerald-400 hover:text-emerald-300 font-semibold border-t border-slate-800/60"
              >
                <span>View Details & Sessions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
