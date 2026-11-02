import { Card } from '../ui/card'
import { CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react'

interface AttendanceCardProps {
  title: string
  value: string | number
  subtitle?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  icon?: 'check' | 'cross' | 'clock' | 'alert' | 'percent'
  onClick?: () => void
}

export function AttendanceCard({
  title,
  value,
  subtitle,
  variant = 'default',
  icon = 'percent',
  onClick,
}: AttendanceCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'check':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case 'cross':
        return <XCircle className="w-5 h-5 text-rose-400" />
      case 'clock':
        return <Clock className="w-5 h-5 text-amber-400" />
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />
      default:
        return null
    }
  }

  const borderVariants = {
    primary: 'border-emerald-500/30 bg-emerald-950/10',
    success: 'border-emerald-500/30 bg-emerald-950/20',
    warning: 'border-amber-500/30 bg-amber-950/20',
    danger: 'border-rose-500/30 bg-rose-950/20',
    default: 'border-slate-800 bg-slate-900/80',
  }

  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 ${borderVariants[variant]} ${
        onClick ? 'cursor-pointer hover:border-slate-600 hover:translate-y-[-2px]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">{title}</p>
        {getIcon()}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-extrabold font-mono tracking-tight text-white">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </Card>
  )
}
