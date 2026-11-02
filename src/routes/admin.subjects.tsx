import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Plus } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { MOCK_SUBJECTS } from '../lib/mockData'

export const Route = createFileRoute('/admin/subjects')({
  component: AdminSubjectsPage,
})

function AdminSubjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Institutional Courses & Subjects Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Official course syllabus registry, credit structures, and faculty in-charge</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => alert('New subject modal')}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Subject</span>
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Course Code</th>
              <th className="py-3 px-4">Subject Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Credits</th>
              <th className="py-3 px-4">Course Coordinator</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {MOCK_SUBJECTS.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">{s.code}</td>
                <td className="py-3 px-4 font-semibold text-white">{s.name}</td>
                <td className="py-3 px-4 text-slate-300">{s.department}</td>
                <td className="py-3 px-4 font-mono text-slate-200">{s.credits} Credits</td>
                <td className="py-3 px-4 text-slate-400">{s.teacherName}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
