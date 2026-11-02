import { AttendanceStatus } from '../../lib/types'
import { getStatusBadgeClass } from '../../lib/utils'
import { CheckCircle2, Clock, HelpCircle, XCircle, Loader2 } from 'lucide-react'

interface VerificationStatusProps {
  status: AttendanceStatus
  showIcon?: boolean
  className?: string
}

export function VerificationStatus({ status, showIcon = true, className }: VerificationStatusProps) {
  const getIcon = () => {
    switch (status) {
      case 'Present':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      case 'Late':
        return <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      case 'Review':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
      case 'Rejected':
        return <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      case 'Verifying':
        return <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    }
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadgeClass(
        status
      )} ${className || ''}`}
    >
      {showIcon && getIcon()}
      <span>{status}</span>
    </span>
  )
}
