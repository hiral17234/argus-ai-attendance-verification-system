import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Users, Search, Filter } from 'lucide-react'
import { StudentTable, StudentRowData } from '../components/students/StudentTable'

export const Route = createFileRoute('/teacher/students')({
  component: TeacherStudentsPage,
})

function TeacherStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('ALL')

  const mockStudents: StudentRowData[] = [
    {
      id: 'stu-1',
      name: 'Hiral Goyal',
      enrollment: '0901CS221045',
      attendanceRate: 88.8,
      present: 32,
      absent: 3,
      late: 1,
      riskStatus: 'Normal',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'stu-2',
      name: 'Rahul Sharma',
      enrollment: '0901CS221078',
      attendanceRate: 83.3,
      present: 30,
      absent: 5,
      late: 1,
      riskStatus: 'Under Review',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'stu-3',
      name: 'Ananya Singh',
      enrollment: '0901CS221012',
      attendanceRate: 94.4,
      present: 34,
      absent: 2,
      late: 0,
      riskStatus: 'Normal',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'stu-4',
      name: 'Aman Verma',
      enrollment: '0901CS221008',
      attendanceRate: 80.5,
      present: 29,
      absent: 5,
      late: 2,
      riskStatus: 'Normal',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    },
    {
      id: 'stu-5',
      name: 'Devansh Saxena',
      enrollment: '0901CS221033',
      attendanceRate: 68.4,
      present: 26,
      absent: 9,
      late: 3,
      riskStatus: 'Shortage Alert',
    },
  ]

  const filtered = mockStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'ALL' || s.riskStatus === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <Users className="w-6 h-6 text-emerald-400" />
          <span>Enrolled Students Roster</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Search students across your classes, monitor attendance percentages, and identify debarment alerts
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student by name or enrollment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-auto"
          >
            <option value="ALL">All Statuses</option>
            <option value="Normal">Normal Standing</option>
            <option value="Shortage Alert">Shortage Alert (&lt;75%)</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      <StudentTable students={filtered} />
    </div>
  )
}
