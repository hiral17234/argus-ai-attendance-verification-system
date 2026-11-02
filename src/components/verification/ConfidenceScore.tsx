import { getConfidenceColor } from '../../lib/utils'

interface ConfidenceScoreProps {
  score: number // 0-100
  label?: string
  showBar?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ConfidenceScore({ score, label = 'Confidence', showBar = true, size = 'md' }: ConfidenceScoreProps) {
  const colorClass = getConfidenceColor(score)

  const textSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-extrabold',
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className={`font-mono ${textSizes[size]} ${colorClass}`}>{Math.round(score)}%</span>
      </div>
      {showBar && (
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              score >= 85 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  )
}
