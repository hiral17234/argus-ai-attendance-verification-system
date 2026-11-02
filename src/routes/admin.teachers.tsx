import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GraduationCap, Plus, Search, ShieldCheck } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/admin/teachers')({
  component: AdminTeachersPage,
})

function AdminTeachersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const teachers = [
    { id: 't1', name: 'Dr. Ankit Sharma', empId: 'EMP-CS-8812', dept: 'Computer Science', designation: 'Associate Professor', courses: 'CS601, CS401' },
    { id: 't2', name: 'Prof. Meenakshi Sundaram', empId: 'EMP-CS-4120', dept: 'Computer Science', designation: 'Professor & Dean', courses: 'CS602' },
    { id: 't3', name: 'Dr. Rajesh Deshmukh', empId: 'EMP-CS-6619', dept: 'Computer Science', designation: 'Assistant Professor', courses: 'CS603' },
    { id: 't4', name: 'Dr. Sunita Kulkarni', empId: 'EMP-MA-1082', dept: 'Mathematics', designation: 'Associate Professor', courses: 'MA604' },
  ]

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.empId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <span>Faculty & Academic Staff Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage instructor credentials, assigned courses, and department roles</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => alert('Faculty creation modal')}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Faculty Member</span>
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <input
          type="text"
          placeholder="Search by faculty name or Employee ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Faculty Name</th>
              <th className="py-3 px-4">Employee ID</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">Assigned Courses</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">{t.name}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">{t.empId}</td>
                <td className="py-3 px-4 text-slate-300">{t.dept}</td>
                <td className="py-3 px-4 text-slate-300">{t.designation}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{t.courses}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Edit Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
