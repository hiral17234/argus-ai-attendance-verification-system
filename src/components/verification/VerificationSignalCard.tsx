import { VerificationSignals } from '../../lib/types'
import { ConfidenceScore } from './ConfidenceScore'
import { RiskBadge } from './RiskBadge'
import {
  ScanFace,
  Eye,
  Activity,
  Image as ImageIcon,
  Smartphone,
  MapPin,
  AlertCircle,
  Info,
} from 'lucide-react'

interface VerificationSignalCardProps {
  signals: VerificationSignals
  detailed?: boolean
  className?: string
}

export function VerificationSignalCard({ signals, detailed = true, className }: VerificationSignalCardProps) {
  const signalItems = [
    {
      name: 'ArcFace Biometric Match',
      shortName: 'Face Match',
      score: Math.round(signals.faceScore * 100),
      icon: ScanFace,
      desc: 'Cosine similarity against 512-d enrollment vector',
    },
    {
      name: 'Passive Liveness',
      shortName: 'Liveness',
      score: Math.round(signals.livenessScore * 100),
      icon: Eye,
      desc: 'Screen replay & print anti-spoofing micro-texture check',
    },
    {
      name: `Random Gesture (${signals.challengeType})`,
      shortName: 'Challenge',
      score: Math.round(signals.challengeScore * 100),
      icon: Activity,
      desc: 'Real-time reaction latency and kinematic match',
    },
    {
      name: 'Image Quality Assessment',
      shortName: 'Quality',
      score: Math.round(signals.imageQualityScore * 100),
      icon: ImageIcon,
      desc: 'Lighting lux level, focus sharpness and face occlusion',
    },
    {
      name: 'Device Trust Verification',
      shortName: 'Device Trust',
      score: Math.round(signals.deviceTrustScore * 100),
      icon: Smartphone,
      desc: 'Hardware device fingerprint and prior session history',
    },
    {
      name: 'Campus Geofence Audit',
      shortName: 'Location',
      score: Math.round(signals.locationScore * 100),
      icon: MapPin,
      desc: 'GPS polygon and institutional Wi-Fi BSSID verification',
    },
  ]

  return (
    <div className={`bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5 ${className || ''}`}>
      {/* Top Header with Composite Confidence & Risk */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
            <span>Adaptive Verification Signals</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              6 Signals Evaluated
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Verification strength dynamically calibrated to contextual attempt risk
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <RiskBadge level={signals.riskLevel} />
          <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Composite</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              {signals.compositeConfidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Individual Verification Signals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {signalItems.map((item) => {
          const Icon = item.icon
          const isHealthy = item.score >= 80
          const isBorderline = item.score >= 60 && item.score < 80

          return (
            <div
              key={item.name}
              className={`p-3.5 rounded-lg border transition-all ${
                isHealthy
                  ? 'bg-slate-950/50 border-slate-800/80'
                  : isBorderline
                  ? 'bg-amber-950/20 border-amber-600/40'
                  : 'bg-rose-950/20 border-rose-600/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-1.5 rounded-md ${
                      isHealthy
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : isBorderline
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{item.shortName}</span>
                </div>
                <span
                  className={`font-mono text-xs font-bold ${
                    isHealthy ? 'text-emerald-400' : isBorderline ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {item.score}%
                </span>
              </div>

              <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isHealthy ? 'bg-emerald-500' : isBorderline ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              {detailed && <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{item.desc}</p>}
            </div>
          )
        })}
      </div>

      {/* Human-Readable Explainability Section */}
      <div className="rounded-lg bg-slate-950/90 border border-slate-800 p-4 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Explainable Decision Insight</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{signals.humanExplanation}</p>

        {signals.riskFactors && signals.riskFactors.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Risk Factors Flagged:</span>
            </span>
            <ul className="text-xs text-amber-300/90 list-disc list-inside space-y-0.5">
              {signals.riskFactors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
