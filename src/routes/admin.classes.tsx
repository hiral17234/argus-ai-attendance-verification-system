import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Plus, Users } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/admin/classes')({
  component: AdminClassesPage,
})

function AdminClassesPage() {
  const classes = [
    { name: 'B.Tech CSE - 6th Semester (Sec A)', students: 48, faculty: 'Dr. Ankit Sharma, Dr. Rajesh Deshmukh', dept: 'CSE' },
    { name: 'B.Tech CSE - 6th Semester (Sec B)', students: 46, faculty: 'Dr. Ankit Sharma, Prof. M. Sundaram', dept: 'CSE' },
    { name: 'B.Tech CSE - 4th Semester (Sec A)', students: 52, faculty: 'Dr. Ankit Sharma, Dr. Sunita Kulkarni', dept: 'CSE' },
    { name: 'B.Tech ECE - 6th Semester (Sec A)', students: 42, faculty: 'Prof. Alok Narang', dept: 'ECE' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Academic Classes & Section Allocation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure semester cohorts, student section assignments, and faculty advisors</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => alert('Create class modal')}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Create Academic Class</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes.map((cls, idx) => (
          <Card key={idx} className="p-5 bg-slate-900/80 border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">{cls.name}</h3>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Department: <span className="text-slate-200">{cls.dept}</span></p>
              <p>Faculty Assigned: <span className="text-slate-200">{cls.faculty}</span></p>
              <p>Enrolled Cohort: <span className="text-emerald-400 font-mono font-bold">{cls.students} Students</span></p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
