import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { AttendanceStatus, RiskLevel } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function getStatusBadgeClass(status: AttendanceStatus): string {
  switch (status) {
    case 'Present':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    case 'Late':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    case 'Review':
      return 'bg-amber-400/20 text-amber-300 border-amber-400/40 animate-pulse'
    case 'Rejected':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    case 'Absent':
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30'
    case 'Verifying':
      return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
    case 'Waiting':
      return 'bg-slate-700/30 text-slate-400 border-slate-700'
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700'
  }
}

export function getRiskBadgeClass(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW':
      return 'bg-emerald-950/80 text-emerald-400 border-emerald-700/50'
    case 'MEDIUM':
      return 'bg-amber-950/80 text-amber-300 border-amber-700/50'
    case 'HIGH':
      return 'bg-rose-950/80 text-rose-400 border-rose-700/50'
    default:
      return 'bg-slate-900 text-slate-400 border-slate-700'
  }
}

export function getConfidenceColor(score: number): string {
  if (score >= 85) return 'text-emerald-400'
  if (score >= 70) return 'text-amber-400'
  return 'text-rose-400'
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return isoString
  }
}
