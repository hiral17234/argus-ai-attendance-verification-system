import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  FileText,
  Clock,
  Smartphone,
  MapPin,
  Eye,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { RiskBadge } from '../components/verification/RiskBadge'
import { ConfidenceScore } from '../components/verification/ConfidenceScore'
import { MOCK_VERIFICATION_ATTEMPTS } from '../lib/mockData'

export const Route = createFileRoute('/student/verification-result')({
  component: StudentVerificationResultPage,
})

function StudentVerificationResultPage() {
  const [outcome, setOutcome] = useState<'success' | 'review' | 'rejected'>('success')

  const currentAttempt =
    outcome === 'success'
      ? MOCK_VERIFICATION_ATTEMPTS[0]
      : outcome === 'review'
      ? MOCK_VERIFICATION_ATTEMPTS[1]
      : MOCK_VERIFICATION_ATTEMPTS[4]

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Scenario test toggle */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <span className="text-slate-400 font-mono">Simulate Result State:</span>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setOutcome('success')}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              outcome === 'success' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Accepted (96%)
          </button>
          <button
            onClick={() => setOutcome('review')}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              outcome === 'review' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Review (74%)
          </button>
          <button
            onClick={() => setOutcome('rejected')}
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              outcome === 'rejected' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rejected (33%)
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <Card
        className={`p-6 sm:p-8 space-y-6 text-center border-2 ${
          outcome === 'success'
            ? 'border-emerald-500/40 bg-slate-900/90'
            : outcome === 'review'
            ? 'border-amber-500/40 bg-slate-900/90'
            : 'border-rose-500/40 bg-slate-900/90'
        }`}
      >
        {/* Status Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          {outcome === 'success' && (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          )}
          {outcome === 'review' && (
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-9 h-9" />
            </div>
          )}
          {outcome === 'rejected' && (
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <XCircle className="w-9 h-9" />
            </div>
          )}
        </div>

        {/* Title & Status */}
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-white">
            {outcome === 'success' && 'Attendance Recorded ✓'}
            {outcome === 'review' && 'Attendance Submitted for Review'}
            {outcome === 'rejected' && 'Verification Unsuccessful'}
          </h2>
          <p className="text-xs text-slate-400">
            Session: <strong className="text-white">{currentAttempt.sessionCode}</strong> • {currentAttempt.subjectName}
          </p>
        </div>

        {/* Confidence & Risk Matrix Summary */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Identity Confidence</span>
            <RiskBadge level={currentAttempt.signals.riskLevel} />
          </div>

          <ConfidenceScore score={currentAttempt.signals.compositeConfidence} size="lg" />

          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
            <div className="text-slate-400">
              Timestamp: <span className="text-slate-200 font-mono">{currentAttempt.timestamp}</span>
            </div>
            <div className="text-slate-400">
              Biometric Match:{' '}
              <span className="text-slate-200 font-mono">
                {Math.round(currentAttempt.signals.faceScore * 100)}%
              </span>
            </div>
            <div className="text-slate-400">
              Liveness Check:{' '}
              <span className="text-slate-200 font-mono">
                {currentAttempt.signals.livenessScore >= 0.8 ? 'Passed' : 'Failed'}
              </span>
            </div>
            <div className="text-slate-400">
              Hardware Trust:{' '}
              <span className="text-slate-200 font-mono">
                {currentAttempt.signals.deviceTrustScore >= 0.8 ? 'Verified' : 'Unregistered'}
              </span>
            </div>
          </div>
        </div>

        {/* Human Explanation text */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 text-left space-y-1.5 text-xs text-slate-300">
          <p className="font-semibold text-white">ARGUS Risk Rationale:</p>
          <p className="leading-relaxed text-slate-400">{currentAttempt.signals.humanExplanation}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {outcome === 'rejected' ? (
            <>
              <Link to="/student/verify" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  <span>Try Verification Again</span>
                </Button>
              </Link>
              <Link to="/student/appeals" className="w-full sm:w-auto">
                <Button variant="secondary" size="md" className="w-full">
                  <FileText className="w-4 h-4 mr-1.5" />
                  <span>Submit Attendance Appeal</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/student" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full">
                  <span>Return to Dashboard</span>
                </Button>
              </Link>
              <Link to="/student/verification-details" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full">
                  <span>Inspect Signal Breakdown</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
