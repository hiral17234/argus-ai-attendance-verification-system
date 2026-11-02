import { RiskLevel } from '../../lib/types'
import { getRiskBadgeClass } from '../../lib/utils'
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react'

interface RiskBadgeProps {
  level: RiskLevel
  showIcon?: boolean
  className?: string
}

export function RiskBadge({ level, showIcon = true, className }: RiskBadgeProps) {
  const icons = {
    LOW: ShieldCheck,
    MEDIUM: AlertTriangle,
    HIGH: AlertOctagon,
  }

  const Icon = icons[level]

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border uppercase tracking-wider ${getRiskBadgeClass(
        level
      )} ${className || ''}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{level} RISK</span>
    </span>
  )
}
