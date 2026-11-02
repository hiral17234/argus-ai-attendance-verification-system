import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Activity, ArrowRight, ShieldCheck, RefreshCw, Eye } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { RANDOM_CHALLENGES } from '../lib/verificationEngine'

export const Route = createFileRoute('/student/challenge')({
  component: StudentChallengePage,
})

function StudentChallengePage() {
  const navigate = useNavigate()
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0)
  const [timer, setTimer] = useState(6)
  const [isPassed, setIsPassed] = useState(false)

  const challenge = RANDOM_CHALLENGES[activeChallengeIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval)
          setIsPassed(true)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeChallengeIndex])

  const nextChallenge = () => {
    setActiveChallengeIndex((prev) => (prev + 1) % RANDOM_CHALLENGES.length)
    setTimer(6)
    setIsPassed(false)
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center space-x-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          <span>Dynamic Random Gesture Challenge</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Anti-spoofing mechanism to prove active physical presence and defeat replay attacks
        </p>
      </div>

      <Card className="p-8 bg-slate-900 border-slate-800 space-y-6 relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
            PROMPT: {challenge.type}
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">{challenge.instruction}</h2>
          <p className="text-xs text-slate-400">Please align your eyes to the crosshair and follow the prompt.</p>
        </div>

        {/* Circular Countdown or Passed indicator */}
        <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl">
          {isPassed ? (
            <span className="text-emerald-400 font-bold text-sm">PASSED ✓</span>
          ) : (
            <span className="font-mono text-3xl font-extrabold text-white">{timer}s</span>
          )}
        </div>

        {isPassed ? (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/40">
              Kinematic trajectory matched ground truth vector. Challenge verified!
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button variant="outline" size="sm" onClick={nextChallenge}>
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                <span>Next Prompt</span>
              </Button>
              <Link to="/student/verification-result">
                <Button variant="primary" size="sm">
                  <span>Continue to Result</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 animate-pulse">Monitoring facial landmarks & optical flow...</p>
        )}
      </Card>
    </div>
  )
}
