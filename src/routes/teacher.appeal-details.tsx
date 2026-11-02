import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/teacher/appeal-details')({
  component: TeacherAppealDetailsPage,
})

function TeacherAppealDetailsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <Link to="/teacher/appeals" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Appeals Queue</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Student Appeal Detailed Adjudication</h1>
      </div>

      <Card className="p-6 bg-slate-900 border-slate-800 space-y-4 text-xs text-slate-300">
        <p>Please use the interactive adjudication drawer on the Appeals Queue page.</p>
        <Link to="/teacher/appeals">
          <Button variant="primary" size="sm">
            Go to Appeals Queue
          </Button>
        </Link>
      </Card>
    </div>
  )
}
