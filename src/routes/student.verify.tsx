import React, { useState, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  ScanFace,
  Eye,
  Activity,
  Smartphone,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Video,
  ArrowRight,
  Maximize2,
} from 'lucide-react'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import {
  INITIAL_VERIFICATION_STAGES,
  RANDOM_CHALLENGES,
  computeAdaptiveVerification,
} from '../lib/verificationEngine'
import { MOCK_ACTIVE_SESSION } from '../lib/mockData'

export const Route = createFileRoute('/student/verify')({
  component: StudentVerifyPage,
})

function StudentVerifyPage() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [sessionCode, setSessionCode] = useState(MOCK_ACTIVE_SESSION.code)
  const [sessionValidated, setSessionValidated] = useState(false)
  const [scenario, setScenario] = useState<'success' | 'review' | 'rejected'>('success')

  // Verification step state
  const [stages, setStages] = useState(INITIAL_VERIFICATION_STAGES)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  // Challenge stage state
  const [activeChallenge, setActiveChallenge] = useState(RANDOM_CHALLENGES[0])
  const [challengeTimer, setChallengeTimer] = useState(5)
  const [challengeActive, setChallengeActive] = useState(false)

  // Camera stream
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  // Initialize or mock webcam
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraActive(true)
          setCameraError(null)
        }
      } else {
        setCameraActive(true) // Simulation mode
      }
    } catch (err) {
      // Permission denied or mock environment fallback
      setCameraActive(true)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setCameraActive(false)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Start the verification sequence
  const startVerification = async () => {
    setIsVerifying(true)
    setIsFinished(false)
    setCurrentStepIndex(0)

    // Pick a random gesture challenge
    const randomChallenge = RANDOM_CHALLENGES[Math.floor(Math.random() * RANDOM_CHALLENGES.length)]
    setActiveChallenge(randomChallenge)

    // Reset stages
    setStages(INITIAL_VERIFICATION_STAGES.map((s) => ({ ...s, status: 'idle' })))

    await startCamera()

    // Step 0: Camera Check
    updateStageStatus(0, 'running')
    setTimeout(() => {
      updateStageStatus(0, 'passed', 'Camera 1080p stream active (30 fps)')
      proceedToStep(1)
    }, 700)
  }

  const proceedToStep = (index: number) => {
    setCurrentStepIndex(index)

    // Step 1: Face Detection
    if (index === 1) {
      updateStageStatus(1, 'running')
      setTimeout(() => {
        updateStageStatus(1, 'passed', 'Face box isolated (Bounding confidence: 99.1%)')
        proceedToStep(2)
      }, 800)
    }

    // Step 2: Image Quality
    else if (index === 2) {
      updateStageStatus(2, 'running')
      setTimeout(() => {
        if (scenario === 'rejected') {
          updateStageStatus(2, 'warning', 'Low lux & motion blur detected')
        } else {
          updateStageStatus(2, 'passed', 'Sharpness: 88, Lux: 340, Occlusion: 0%')
        }
        proceedToStep(3)
      }, 700)
    }

    // Step 3: Liveness
    else if (index === 3) {
      updateStageStatus(3, 'running')
      setTimeout(() => {
        if (scenario === 'rejected') {
          updateStageStatus(3, 'failed', 'Anti-spoofing alert: Planar reflection detected')
        } else {
          updateStageStatus(3, 'passed', 'Anti-spoof micro-texture verified')
        }
        proceedToStep(4)
      }, 900)
    }

    // Step 4: Random Gesture Challenge
    else if (index === 4) {
      updateStageStatus(4, 'running', `Awaiting: ${activeChallenge.instruction}`)
      setChallengeActive(true)
      setChallengeTimer(4)

      const timerInterval = setInterval(() => {
        setChallengeTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval)
            setChallengeActive(false)
            if (scenario === 'rejected') {
              updateStageStatus(4, 'failed', 'Gesture reaction timeout / mismatch')
            } else {
              updateStageStatus(4, 'passed', `Gesture "${activeChallenge.type}" confirmed`)
            }
            proceedToStep(5)
            return 0
          }
          return prev - 1
        })
      }, 700)
    }

    // Step 5: ArcFace Match
    else if (index === 5) {
      updateStageStatus(5, 'running')
      setTimeout(() => {
        if (scenario === 'rejected') {
          updateStageStatus(5, 'failed', 'ArcFace similarity 0.43 (Below 0.80 threshold)')
        } else if (scenario === 'review') {
          updateStageStatus(5, 'warning', 'ArcFace similarity 0.74 (Borderline)')
        } else {
          updateStageStatus(5, 'passed', 'ArcFace similarity 0.96 (High confidence)')
        }
        proceedToStep(6)
      }, 800)
    }

    // Step 6: Device Trust
    else if (index === 6) {
      updateStageStatus(6, 'running')
      setTimeout(() => {
        if (scenario === 'review') {
          updateStageStatus(6, 'warning', 'Device unrecognized; not in student profile')
        } else if (scenario === 'rejected') {
          updateStageStatus(6, 'failed', 'Device hardware signature flagged')
        } else {
          updateStageStatus(6, 'passed', 'Device hardware certificate matched')
        }
        proceedToStep(7)
      }, 600)
    }

    // Step 7: Campus Geofence
    else if (index === 7) {
      updateStageStatus(7, 'running')
      setTimeout(() => {
        if (scenario === 'rejected') {
          updateStageStatus(7, 'failed', 'Outside campus perimeter (820m away)')
        } else {
          updateStageStatus(7, 'passed', 'Inside Lecture Hall 204 perimeter (18m from AP)')
        }
        proceedToStep(8)
      }, 700)
    }

    // Step 8: Adaptive Risk Decision
    else if (index === 8) {
      updateStageStatus(8, 'running')
      setTimeout(() => {
        const { signals, outcome } = computeAdaptiveVerification(scenario, activeChallenge.type)
        if (outcome === 'ACCEPTED') {
          updateStageStatus(8, 'passed', 'LOW RISK: Attendance Approved & Logged')
        } else if (outcome === 'REVIEW') {
          updateStageStatus(8, 'warning', 'MEDIUM RISK: Forwarded to Teacher for Review')
        } else {
          updateStageStatus(8, 'failed', 'HIGH RISK: Verification Rejected')
        }

        setIsVerifying(false)
        setIsFinished(true)
        stopCamera()
      }, 900)
    }
  }

  const updateStageStatus = (
    index: number,
    status: 'idle' | 'running' | 'passed' | 'warning' | 'failed',
    details?: string
  ) => {
    setStages((prev) =>
      prev.map((stage, i) => (i === index ? { ...stage, status, details: details || stage.details } : stage))
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <ScanFace className="w-6 h-6 text-emerald-400" />
            <span>ARGUS Biometric Verification Session</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Adaptive verification combines camera landmarks, passive liveness, random gesture & device trust
          </p>
        </div>

        {/* Prototype scenario switcher for testing all 3 paths */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
          <span className="text-[10px] text-slate-400 px-2 font-mono">Test Scenario:</span>
          <button
            onClick={() => setScenario('success')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              scenario === 'success' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Normal (Pass)
          </button>
          <button
            onClick={() => setScenario('review')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              scenario === 'review' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Borderline (Review)
          </button>
          <button
            onClick={() => setScenario('rejected')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              scenario === 'rejected' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anomaly (Reject)
          </button>
        </div>
      </div>

      {/* Session Entry / Validation Card */}
      {!sessionValidated && (
        <Card className="p-6 bg-slate-900/90 border-slate-800 max-w-xl mx-auto space-y-5 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Join Attendance Session</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter the dynamic 6-digit session code provided by your instructor or on classroom screen.
            </p>
          </div>

          <div className="flex items-center space-x-2 max-w-xs mx-auto">
            <input
              type="text"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              placeholder="e.g. MNC-DBMS-241"
              className="flex-1 h-11 px-3 text-center uppercase font-mono font-bold tracking-widest text-emerald-400 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => setSessionValidated(true)}
              className="h-11 px-4"
            >
              Verify Code
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 text-left space-y-2">
            <p className="font-semibold text-slate-300">Active Campus Session Detected:</p>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{MOCK_ACTIVE_SESSION.subjectName}</p>
                <p className="text-[11px] text-slate-400">
                  {MOCK_ACTIVE_SESSION.room} • {MOCK_ACTIVE_SESSION.teacherName}
                </p>
              </div>
              <button
                onClick={() => {
                  setSessionCode(MOCK_ACTIVE_SESSION.code)
                  setSessionValidated(true)
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Auto-Fill & Join
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Verification Stage (Camera + Radar Overlay + Steps) */}
      {sessionValidated && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Camera Viewport & Challenge Overlay */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="relative overflow-hidden bg-slate-950 border-slate-800 p-0 shadow-2xl">
              {/* Camera Header status */}
              <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SESSION: {sessionCode}</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-slate-300 border border-slate-700">
                  POLICY: ADAPTIVE RISK
                </span>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {!cameraActive && (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-xs text-slate-400">Camera preview will activate when verification begins</p>
                  </div>
                )}

                {/* Biometric Scanning Reticle */}
                {isVerifying && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Bounding Box */}
                    <div className="w-56 h-72 border-2 border-emerald-400/70 rounded-3xl relative animate-pulse shadow-lg shadow-emerald-500/20">
                      {/* Corner brackets */}
                      <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                      {/* Radar sweep line */}
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-radar" />
                    </div>
                  </div>
                )}

                {/* Live Random Gesture Challenge Overlay */}
                {challengeActive && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in fade-in">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                      Random Verification Challenge
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                      {activeChallenge.instruction}
                    </h3>
                    <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center font-mono text-2xl font-extrabold text-amber-300 shadow-lg shadow-amber-500/20">
                      0{challengeTimer}s
                    </div>
                    <p className="text-xs text-slate-300 max-w-xs">
                      Hold natural posture and complete motion smoothly. Do not hide your eyes.
                    </p>
                  </div>
                )}
              </div>

              {/* Viewport Footer */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  {isVerifying ? (
                    <span className="text-emerald-400 flex items-center space-x-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Stage {currentStepIndex + 1} of {stages.length}: {stages[currentStepIndex]?.name}</span>
                    </span>
                  ) : isFinished ? (
                    <span className="text-slate-200 font-medium">Verification Cycle Concluded</span>
                  ) : (
                    <span>Position face inside framing reticle</span>
                  )}
                </div>

                {!isVerifying && !isFinished && (
                  <Button variant="primary" size="sm" onClick={startVerification}>
                    <Camera className="w-4 h-4 mr-1.5" />
                    <span>Begin Verification</span>
                  </Button>
                )}

                {isFinished && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={startVerification}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      <span>Re-test</span>
                    </Button>
                    <Link
                      to="/student/verification-result"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center space-x-1"
                    >
                      <span>View Outcome Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Privacy note */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Biometric Protection: Only mathematical 512-d feature vectors are computed. Raw camera frames are immediately discarded.
              </span>
            </div>
          </div>

          {/* Sequential Verification Stages Progress */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 bg-slate-900/80 border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white">Adaptive Verification Pipeline</h3>
                <span className="text-[10px] font-mono text-slate-400">
                  {stages.filter((s) => s.status === 'passed').length}/{stages.length} Completed
                </span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {stages.map((stage, idx) => {
                  const isCurrent = idx === currentStepIndex
                  const isPassed = stage.status === 'passed'
                  const isWarning = stage.status === 'warning'
                  const isFailed = stage.status === 'failed'

                  return (
                    <div
                      key={stage.id}
                      className={`p-2.5 rounded-lg border transition-all text-xs ${
                        isCurrent
                          ? 'bg-emerald-950/30 border-emerald-500/60 shadow-sm'
                          : isPassed
                          ? 'bg-slate-950/40 border-slate-800 text-slate-300'
                          : isWarning
                          ? 'bg-amber-950/20 border-amber-600/40 text-amber-200'
                          : isFailed
                          ? 'bg-rose-950/20 border-rose-600/40 text-rose-200'
                          : 'bg-slate-950/20 border-slate-800/40 opacity-60 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 font-medium">
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isWarning ? (
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : isFailed ? (
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                              {idx + 1}
                            </span>
                          )}
                          <span className={isCurrent ? 'text-white font-semibold' : ''}>{stage.name}</span>
                        </div>

                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isPassed
                              ? 'bg-emerald-950 text-emerald-300'
                              : isWarning
                              ? 'bg-amber-950 text-amber-300'
                              : isFailed
                              ? 'bg-rose-950 text-rose-300'
                              : isCurrent
                              ? 'bg-cyan-950 text-cyan-300 animate-pulse'
                              : 'text-slate-500'
                          }`}
                        >
                          {stage.status}
                        </span>
                      </div>

                      {stage.details && (
                        <p className="text-[11px] text-slate-400 mt-1 pl-6 leading-tight font-mono">
                          {stage.details}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
