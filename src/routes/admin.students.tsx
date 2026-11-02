import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Users, Search, Plus, CheckCircle2, UserX } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Modal } from '../components/ui/modal'

export const Route = createFileRoute('/admin/students')({
  component: AdminStudentsPage,
})

function AdminStudentsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [students, setStudents] = useState([
    { id: '1', name: 'Hiral Goyal', enrollment: '0901CS221045', department: 'CSE', semester: 6, section: 'A', status: 'Active' },
    { id: '2', name: 'Rahul Sharma', enrollment: '0901CS221078', department: 'CSE', semester: 6, section: 'A', status: 'Active' },
    { id: '3', name: 'Ananya Singh', enrollment: '0901CS221012', department: 'CSE', semester: 6, section: 'A', status: 'Active' },
    { id: '4', name: 'Aman Verma', enrollment: '0901CS221008', department: 'CSE', semester: 6, section: 'A', status: 'Active' },
    { id: '5', name: 'Priya Patel', enrollment: '0901CS221089', department: 'CSE', semester: 6, section: 'B', status: 'Active' },
  ])

  const [newName, setNewName] = useState('')
  const [newEnrollment, setNewEnrollment] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setStudents((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newName,
        enrollment: newEnrollment,
        department: 'CSE',
        semester: 6,
        section: 'A',
        status: 'Active',
      },
    ])
    setIsAddOpen(false)
    setNewName('')
    setNewEnrollment('')
  }

  const toggleStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Deactivated' : 'Active' } : s))
    )
  }

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollment.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Student Institutional Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Enrollment directory, department assignments, and biometric status</p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Student</span>
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <input
          type="text"
          placeholder="Search by student name or enrollment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 h-10 px-3 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Enrollment Number</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Semester & Section</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-semibold text-white">{s.name}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">{s.enrollment}</td>
                <td className="py-3 px-4 text-slate-300">{s.department}</td>
                <td className="py-3 px-4 text-slate-300">Sem {s.semester} (Sec {s.section})</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      s.status === 'Active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => toggleStatus(s.id)}
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700"
                  >
                    {s.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Enroll New University Student"
        description="Register a new student record into the institutional directory"
      >
        <form onSubmit={handleAdd} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Full Legal Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Maya Krishnan"
              className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Enrollment Number</label>
            <input
              type="text"
              required
              value={newEnrollment}
              onChange={(e) => setNewEnrollment(e.target.value)}
              placeholder="e.g. 0901CS221099"
              className="w-full h-10 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
          <div className="pt-2 flex justify-end space-x-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
