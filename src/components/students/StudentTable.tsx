import { Link } from '@tanstack/react-router'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ArrowUpRight } from 'lucide-react'

export interface StudentRowData {
  id: string
  name: string
  enrollment: string
  attendanceRate: number
  present: number
  absent: number
  late: number
  riskStatus: 'Normal' | 'Shortage Alert' | 'Under Review'
  avatar?: string
}

interface StudentTableProps {
  students: StudentRowData[]
}

export function StudentTable({ students }: StudentTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <th className="py-3 px-4">Student</th>
            <th className="py-3 px-4">Enrollment No.</th>
            <th className="py-3 px-4">Attendance %</th>
            <th className="py-3 px-4">Present</th>
            <th className="py-3 px-4">Late</th>
            <th className="py-3 px-4">Absent</th>
            <th className="py-3 px-4">Status / Alert</th>
            <th className="py-3 px-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      student.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                    }
                    alt={student.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <span className="font-semibold text-slate-200">{student.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-slate-400">{student.enrollment}</td>
              <td className="py-3 px-4">
                <span
                  className={`font-mono font-bold ${
                    student.attendanceRate >= 75
                      ? 'text-emerald-400'
                      : student.attendanceRate >= 65
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {student.attendanceRate}%
                </span>
              </td>
              <td className="py-3 px-4 text-emerald-400 font-mono">{student.present}</td>
              <td className="py-3 px-4 text-amber-400 font-mono">{student.late}</td>
              <td className="py-3 px-4 text-rose-400 font-mono">{student.absent}</td>
              <td className="py-3 px-4">
                <Badge
                  variant={
                    student.riskStatus === 'Normal'
                      ? 'success'
                      : student.riskStatus === 'Shortage Alert'
                      ? 'danger'
                      : 'warning'
                  }
                  className="text-[10px]"
                >
                  {student.riskStatus}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <Link
                  to="/teacher/student-details"
                  className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <span>Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
