import React, { useState, useRef, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ScanFace,
  Activity,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Smartphone,
  MapPin,
  Camera,
  Upload,
  RefreshCw,
  FileText,
  UserCheck,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { UserRole } from '../lib/types'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Modal } from '../components/ui/modal'
import { Badge } from '../components/ui/badge'
import { authApi, enrollmentApi, ApiError } from '../lib/api'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate()
  const { loginWithBackend, loginAs } = useAuth()

  // Login Form State
  const [email, setEmail] = useState('student@mitsgwl.ac.in')
  const [password, setPassword] = useState('Student@Argus2026!')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null)

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)
  const [showSeedCredentials, setShowSeedCredentials] = useState(true)

  // Registration Multi-Step State
  const [regStep, setRegStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student')
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regShowPassword, setRegShowPassword] = useState(false)
  const [regPhone, setRegPhone] = useState('')
  const [regEnrollmentNo, setRegEnrollmentNo] = useState('')
  const [regRollNo, setRegRollNo] = useState('')
  const [regSection, setRegSection] = useState('A')
  const [regFacultyId, setRegFacultyId] = useState('')
  const [regDesignation, setRegDesignation] = useState('Assistant Professor')
  const [regError, setRegError] = useState<string | null>(null)
  const [regLoading, setRegLoading] = useState(false)

  // Step 2: Live Camera Capture State
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [livePhotoBase64, setLivePhotoBase64] = useState<string | null>(null)
  const [faceCheckResult, setFaceCheckResult] = useState<{
    passed: boolean
    faceCount: number
    qualityScore: number
    message: string
  } | null>(null)
  const [livePhotoVerifying, setLivePhotoVerifying] = useState(false)

  // Step 3: ID Card Upload State
  const [idCardBase64, setIdCardBase64] = useState<string | null>(null)
  const [idCardResult, setIdCardResult] = useState<{
    isValid: boolean
    institution: string
    name: string
    enrollment: string
  } | null>(null)
  const [idCardVerifying, setIdCardVerifying] = useState(false)

  // Step 4: Biometric Consent
  const [biometricConsent, setBiometricConsent] = useState(false)

  // Step 5: Email OTP State
  const [otpCode, setOtpCode] = useState('')
  const [otpTimer, setOtpTimer] = useState(600) // 10 minutes
  const [otpSentMessage, setOtpSentMessage] = useState('')
  const [registrationComplete, setRegistrationComplete] = useState(false)

  // Forgot Password State
  const [fpEmail, setFpEmail] = useState('')
  const [fpToken, setFpToken] = useState('')
  const [fpNewPassword, setFpNewPassword] = useState('')
  const [fpShowPassword, setFpShowPassword] = useState(false)
  const [fpStep, setFpStep] = useState<1 | 2>(1)
  const [fpLoading, setFpLoading] = useState(false)
  const [fpError, setFpError] = useState<string | null>(null)
  const [fpSuccess, setFpSuccess] = useState<string | null>(null)

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any
    if (regStep === 5 && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [regStep, otpTimer])

  // Camera Management for Step 2
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraActive(true)
        }
      }
    } catch {
      setRegError('Unable to access webcam. Please verify camera permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)
    setLoginSuccess(null)

    try {
      const role = await loginWithBackend(email, password)
      setLoginSuccess(`Authenticated as ${role.toUpperCase()}. Redirecting...`)
      setTimeout(() => {
        if (role === 'teacher') navigate({ to: '/teacher' })
        else if (role === 'admin' || role === 'superadmin' || role === 'coordinator' || role === 'security')
          navigate({ to: '/admin' })
        else navigate({ to: '/student' })
      }, 500)
    } catch (err: any) {
      // If backend is offline during local development, fall back with explicit advisory
      if (err.message && err.message.includes('Failed to fetch')) {
        setLoginError('Backend connection offline. Use the Preset Development Credentials below to test offline.')
      } else {
        setLoginError(err.message || 'Invalid institutional email or password.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Capture Live Photo and Call Real Backend Face Validator
  const captureLivePhoto = async () => {
    if (!videoRef.current) return
    setLivePhotoVerifying(true)
    setRegError(null)

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth || 640
    canvas.height = videoRef.current.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const b64 = canvas.toDataURL('image/jpeg', 0.85)
      setLivePhotoBase64(b64)

      try {
        const res = await enrollmentApi.validateLivePhoto(b64)
        setFaceCheckResult({
          passed: res.success,
          faceCount: res.face_count,
          qualityScore: res.quality_score,
          message: res.message,
        })
      } catch (err: any) {
        setFaceCheckResult({
          passed: false,
          faceCount: 0,
          qualityScore: 0,
          message: err.detail || 'Validation failed: Single face could not be confirmed.',
        })
        setRegError(err.detail || 'Face validation failed.')
      } finally {
        setLivePhotoVerifying(false)
      }
    }
  }

  // Handle ID Card Upload and Analyze
  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIdCardVerifying(true)
    setRegError(null)

    const reader = new FileReader()
    reader.onload = async () => {
      const b64 = reader.result as string
      setIdCardBase64(b64)

      try {
        const res = await enrollmentApi.validateIdCard(b64, regFullName, regEnrollmentNo)
        setIdCardResult({
          isValid: res.success,
          institution: res.analysis.detected_institution,
          name: res.analysis.extracted_name,
          enrollment: res.analysis.extracted_enrollment,
        })
      } catch (err: any) {
        setRegError(err.detail || 'ID card verification failed. Image may be illegible.')
      } finally {
        setIdCardVerifying(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // Step 1 -> Step 2
  const handleProceedToBiometrics = (e: React.FormEvent) => {
    e.preventDefault()
    setRegError(null)

    // Validate institutional domain
    const expectedDomain = regRole === 'student' ? 'mitsgwl.ac.in' : 'mitsgwalior.ac.in'
    if (!regEmail.toLowerCase().endsWith(`@${expectedDomain}`)) {
      setRegError(`Institutional requirement: ${regRole} accounts must end in @${expectedDomain}`)
      return
    }

    // Validate password complexity
    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.')
      return
    }

    if (regRole === 'student') {
      setRegStep(2)
      setTimeout(startCamera, 200)
    } else {
      // Faculty members proceed directly to OTP verification
      handleDispatchRegistration()
    }
  }

  // Dispatch Registration Payload to Backend
  const handleDispatchRegistration = async () => {
    setRegLoading(true)
    setRegError(null)

    try {
      const res = await authApi.register({
        full_name: regFullName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        phone_number: regPhone,
        enrollment_number: regRole === 'student' ? regEnrollmentNo : undefined,
        roll_number: regRole === 'student' ? regRollNo : undefined,
        section: regRole === 'student' ? regSection : undefined,
        faculty_id: regRole === 'teacher' ? regFacultyId : undefined,
        designation: regRole === 'teacher' ? regDesignation : undefined,
      })

      setOtpSentMessage(res.message)
      if (res.dev_otp) {
        setOtpCode(res.dev_otp) // Auto-fill for quick testing in dev mode
      }
      stopCamera()
      setRegStep(5)
    } catch (err: any) {
      setRegError(err.detail || 'Registration failed. Check institutional email format.')
    } finally {
      setRegLoading(false)
    }
  }

  // Step 5: Verify Email OTP and Complete Enrollment
  const handleVerifyOtpAndComplete = async () => {
    setRegLoading(true)
    setRegError(null)

    try {
      // 1. Verify email OTP
      await authApi.verifyEmail(regEmail, otpCode)

      // 2. If student, submit biometric enrollment package
      if (regRole === 'student' && livePhotoBase64 && idCardBase64) {
        // Log in to obtain Bearer token for enrollment
        await loginWithBackend(regEmail, regPassword)
        await enrollmentApi.submitEnrollment({
          live_photo_base64: livePhotoBase64,
          id_card_base64: idCardBase64,
          biometric_consent: biometricConsent,
        })
      }

      setRegistrationComplete(true)
    } catch (err: any) {
      setRegError(err.detail || 'Verification code invalid or expired.')
    } finally {
      setRegLoading(false)
    }
  }

  // Forgot Password: Step 1
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFpLoading(true)
    setFpError(null)

    try {
      const res = await authApi.forgotPassword(fpEmail)
      setFpSuccess(res.message)
      if (res.dev_reset_token) {
        setFpToken(res.dev_reset_token)
      }
      setFpStep(2)
    } catch (err: any) {
      setFpError(err.detail || 'Failed to dispatch password reset request.')
    } finally {
      setFpLoading(false)
    }
  }

  // Forgot Password: Step 2
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFpLoading(true)
    setFpError(null)

    try {
      const res = await authApi.resetPassword(fpEmail, fpToken, fpNewPassword)
      setFpSuccess(res.message)
      setTimeout(() => {
        setIsForgotPasswordOpen(false)
        setFpStep(1)
        setEmail(fpEmail)
        setPassword(fpNewPassword)
      }, 1500)
    } catch (err: any) {
      setFpError(err.detail || 'Failed to reset password. Token may be expired.')
    } finally {
      setFpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] flex flex-col justify-between selection:bg-[#238636]/30 selection:text-white">
      {/* GitHub-Inspired Institutional Header */}
      <header className="border-b border-[#30363D] bg-[#161B22]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md bg-[#21262D] border border-[#30363D] flex items-center justify-center text-[#238636] shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-wide font-mono text-white">ARGUS</span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#21262D] text-[#8B949E] border border-[#30363D]">
                MITS Gwalior Institutional
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-[#8B949E] hidden md:inline-block font-mono">Session: Autumn 2026-27</span>
            <div className="h-4 w-px bg-[#30363D] hidden md:block" />
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#21262D] hover:bg-[#30363D] text-white border border-[#30363D] transition-colors"
            >
              Register Account
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication & Institutional Overview */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Institutional Architecture */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#21262D] border border-[#30363D] text-xs text-[#8B949E]">
              <Lock className="w-3.5 h-3.5 text-[#238636]" />
              <span>Strict Institutional Email Restrictions Enforced</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Institutional Identity Verification & Adaptive Smart Attendance
              </h1>
              <p className="text-sm text-[#8B949E] leading-relaxed max-w-2xl">
                ARGUS replaces unverified proximity check-ins with an integrated, multi-signal biometric framework.
                Live attendance is cryptographically anchored to student identity templates, device trust records,
                and active campus geofence boundaries.
              </p>
            </div>

            {/* Institutional Rules Card */}
            <div className="p-4 rounded-md bg-[#161B22] border border-[#30363D] text-xs space-y-2.5">
              <div className="font-semibold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Institutional Governance Policy (MITS Gwalior)</span>
              </div>
              <ul className="text-[#8B949E] space-y-1.5 list-disc pl-4">
                <li><strong className="text-slate-200">Student Accounts:</strong> Authorized exclusively on <code className="text-emerald-400 font-mono">@mitsgwl.ac.in</code>.</li>
                <li><strong className="text-slate-200">Faculty Accounts:</strong> Authorized exclusively on <code className="text-emerald-400 font-mono">@mitsgwalior.ac.in</code>.</li>
                <li><strong className="text-slate-200">Zero Raw Video Storage:</strong> Raw camera frames are destroyed immediately upon 512-d feature vector extraction.</li>
                <li><strong className="text-slate-200">Strict Single-Face Rule:</strong> Frame captures with 0 or multiple detected faces are immediately rejected.</li>
              </ul>
            </div>

            {/* Core Verification Signals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-1">
                <ScanFace className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-semibold text-white">ArcFace Biometrics</p>
                <p className="text-[11px] text-[#8B949E]">512-d cosine vector match</p>
              </div>
              <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-1">
                <Activity className="w-4 h-4 text-cyan-400" />
                <p className="text-xs font-semibold text-white">Passive Liveness</p>
                <p className="text-[11px] text-[#8B949E]">Screen anti-spoof analysis</p>
              </div>
              <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-1">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <p className="text-xs font-semibold text-white">Device Trust</p>
                <p className="text-[11px] text-[#8B949E]">Hardware fingerprinting</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#161B22] border border-[#30363D] rounded-lg shadow-xl p-6 sm:p-7 space-y-5">
              <div className="space-y-1 border-b border-[#30363D] pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">Institutional Sign In</h2>
                  <KeyRound className="w-4 h-4 text-[#8B949E]" />
                </div>
                <p className="text-xs text-[#8B949E]">
                  Enter your registered institutional credentials to access your portal.
                </p>
              </div>

              {/* Login Error / Success Alerts */}
              {loginError && (
                <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}
              {loginSuccess && (
                <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-slate-300">Institutional Email</label>
                    <span className="text-[10px] text-[#8B949E] font-mono">@mitsgwl.ac.in</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-[#238636] font-mono"
                    placeholder="student@mitsgwl.ac.in"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-[11px] text-[#238636] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-9 px-3 pr-9 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-[#238636]"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#8B949E] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-9 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Sign In with Institutional ID</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Google Workspace Sign In Option */}
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#30363D]"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-[#8B949E] uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-[#30363D]"></div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="w-full h-9 rounded-md bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-medium text-white flex items-center justify-center space-x-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Institutional Google Workspace</span>
                </button>
              </div>

              {/* New Student / Faculty Registration Trigger */}
              <div className="pt-3 border-t border-[#30363D] text-center">
                <p className="text-xs text-[#8B949E]">
                  New to ARGUS?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    className="text-[#238636] font-semibold hover:underline"
                  >
                    Register & Enroll Identity
                  </button>
                </p>
              </div>

              {/* Seed Test Credentials Accordion */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSeedCredentials(!showSeedCredentials)}
                  className="w-full flex items-center justify-between text-[11px] text-[#8B949E] hover:text-white"
                >
                  <span className="font-mono uppercase font-bold text-[10px]">Verified Seed Test Credentials</span>
                  <span>{showSeedCredentials ? '−' : '+'}</span>
                </button>

                {showSeedCredentials && (
                  <div className="mt-2 space-y-1.5 text-xs font-mono">
                    <div
                      onClick={() => {
                        setEmail('student@mitsgwl.ac.in')
                        setPassword('Student@Argus2026!')
                      }}
                      className="p-2 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-between cursor-pointer hover:border-[#238636] transition-colors"
                    >
                      <div>
                        <p className="text-slate-200 font-semibold font-sans">Student: Hiral Goyal</p>
                        <p className="text-[10px] text-[#8B949E]">student@mitsgwl.ac.in</p>
                      </div>
                      <span className="text-[10px] text-[#238636] font-bold">Auto-Fill</span>
                    </div>

                    <div
                      onClick={() => {
                        setEmail('teacher@mitsgwalior.ac.in')
                        setPassword('Teacher@Argus2026!')
                      }}
                      className="p-2 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-between cursor-pointer hover:border-[#238636] transition-colors"
                    >
                      <div>
                        <p className="text-slate-200 font-semibold font-sans">Faculty: Dr. Ankit Sharma</p>
                        <p className="text-[10px] text-[#8B949E]">teacher@mitsgwalior.ac.in</p>
                      </div>
                      <span className="text-[10px] text-[#238636] font-bold">Auto-Fill</span>
                    </div>

                    <div
                      onClick={() => {
                        setEmail('admin@mitsadmin.ac.in')
                        setPassword('Admin@Argus2026!')
                      }}
                      className="p-2 rounded bg-[#0D1117] border border-[#30363D] flex items-center justify-between cursor-pointer hover:border-[#238636] transition-colors"
                    >
                      <div>
                        <p className="text-slate-200 font-semibold font-sans">Admin: Prof. R. K. Mukherjee</p>
                        <p className="text-[10px] text-[#8B949E]">admin@mitsadmin.ac.in</p>
                      </div>
                      <span className="text-[10px] text-[#238636] font-bold">Auto-Fill</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363D] bg-[#161B22] py-4 text-xs text-[#8B949E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026-2027 Madhav Institute of Technology & Science — ARGUS v2.0</p>
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span>FastAPI Backend Active</span>
            <span>•</span>
            <span>Argon2id Hashing</span>
            <span>•</span>
            <span>Zero Raw Biometrics Stored</span>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* MULTI-STEP INSTITUTIONAL REGISTRATION MODAL                   */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => {
          stopCamera()
          setIsRegisterOpen(false)
          setRegStep(1)
          setRegError(null)
        }}
        title="Institutional Account Registration & Identity Enrollment"
        description="Enforces institutional email domains, mandatory live single-face capture, and ID card verification."
        maxWidth="2xl"
      >
        <div className="space-y-5 text-xs text-[#F0F6FC]">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3 text-[11px]">
            <span className={regStep >= 1 ? 'text-[#238636] font-bold' : 'text-[#8B949E]'}>1. Profile</span>
            <span>→</span>
            <span className={regStep >= 2 ? 'text-[#238636] font-bold' : 'text-[#8B949E]'}>2. Live Photo</span>
            <span>→</span>
            <span className={regStep >= 3 ? 'text-[#238636] font-bold' : 'text-[#8B949E]'}>3. ID Card</span>
            <span>→</span>
            <span className={regStep >= 4 ? 'text-[#238636] font-bold' : 'text-[#8B949E]'}>4. Consent</span>
            <span>→</span>
            <span className={regStep >= 5 ? 'text-[#238636] font-bold' : 'text-[#8B949E]'}>5. Email OTP</span>
          </div>

          {regError && (
            <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{regError}</span>
            </div>
          )}

          {/* STEP 1: Profile & Credentials */}
          {regStep === 1 && (
            <form onSubmit={handleProceedToBiometrics} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('student')
                      setRegEmail('')
                    }}
                    className={`p-3 rounded-md border text-left transition-all ${
                      regRole === 'student'
                        ? 'bg-[#238636]/15 border-[#238636] text-white'
                        : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
                    }`}
                  >
                    <p className="font-bold text-xs">Student Registration</p>
                    <p className="text-[10px] font-mono text-[#8B949E]">@mitsgwl.ac.in</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole('teacher')
                      setRegEmail('')
                    }}
                    className={`p-3 rounded-md border text-left transition-all ${
                      regRole === 'teacher'
                        ? 'bg-[#238636]/15 border-[#238636] text-white'
                        : 'bg-[#0D1117] border-[#30363D] text-[#8B949E]'
                    }`}
                  >
                    <p className="font-bold text-xs">Faculty Registration</p>
                    <p className="text-[10px] font-mono text-[#8B949E]">@mitsgwalior.ac.in</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Hiral Goyal"
                    className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white focus:outline-none focus:border-[#238636]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">
                    Institutional Email ({regRole === 'student' ? '@mitsgwl.ac.in' : '@mitsgwalior.ac.in'})
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder={regRole === 'student' ? 'enrollment@mitsgwl.ac.in' : 'faculty@mitsgwalior.ac.in'}
                    className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white focus:outline-none focus:border-[#238636] font-mono"
                  />
                </div>
              </div>

              {/* Password with Eye Toggle & Strength Checklist */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Account Password (Argon2id)</label>
                <div className="relative">
                  <input
                    type={regShowPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol"
                    className="w-full h-9 px-3 pr-9 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white focus:outline-none focus:border-[#238636]"
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPassword(!regShowPassword)}
                    className="absolute right-2.5 top-2.5 text-[#8B949E] hover:text-white"
                  >
                    {regShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] text-[#8B949E] pt-1">
                  <span className={regPassword.length >= 8 ? 'text-emerald-400' : ''}>✓ 8+ Characters</span>
                  <span className={/[A-Z]/.test(regPassword) ? 'text-emerald-400' : ''}>✓ Uppercase</span>
                  <span className={/\d/.test(regPassword) ? 'text-emerald-400' : ''}>✓ Number</span>
                  <span className={/[@$!%*?&^#()_+=]/.test(regPassword) ? 'text-emerald-400' : ''}>✓ Special Symbol</span>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {regRole === 'student' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Enrollment Number</label>
                    <input
                      type="text"
                      required
                      value={regEnrollmentNo}
                      onChange={(e) => setRegEnrollmentNo(e.target.value.toUpperCase())}
                      placeholder="0901CS221045"
                      className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white font-mono focus:outline-none focus:border-[#238636]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Roll Number</label>
                    <input
                      type="text"
                      value={regRollNo}
                      onChange={(e) => setRegRollNo(e.target.value)}
                      placeholder="221045"
                      className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white font-mono focus:outline-none focus:border-[#238636]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Section</label>
                    <input
                      type="text"
                      value={regSection}
                      onChange={(e) => setRegSection(e.target.value.toUpperCase())}
                      placeholder="A"
                      className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white font-mono focus:outline-none focus:border-[#238636]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Faculty Employee ID</label>
                    <input
                      type="text"
                      required
                      value={regFacultyId}
                      onChange={(e) => setRegFacultyId(e.target.value.toUpperCase())}
                      placeholder="EMP-CS-8812"
                      className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white font-mono focus:outline-none focus:border-[#238636]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300">Designation</label>
                    <input
                      type="text"
                      value={regDesignation}
                      onChange={(e) => setRegDesignation(e.target.value)}
                      placeholder="Associate Professor"
                      className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white focus:outline-none focus:border-[#238636]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <span>{regRole === 'student' ? 'Proceed to Mandatory Live Photo' : 'Proceed to OTP Verification'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Live Photo Capture (Single-Face Verification) */}
          {regStep === 2 && (
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-1 text-xs">
                <p className="font-semibold text-white flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Mandatory Live Facial Capture (Single-Face Rule)</span>
                </p>
                <p className="text-[#8B949E]">
                  Position your face clearly inside the camera frame. Exactly one face must be detected. Gallery uploads are strictly disallowed.
                </p>
              </div>

              <div className="relative aspect-video w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden border border-[#30363D] flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                {/* Face Framing Box */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-60 border-2 border-emerald-400/80 rounded-2xl relative animate-pulse">
                    <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                    <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                  </div>
                </div>
              </div>

              {faceCheckResult && (
                <div
                  className={`p-3 rounded-md text-xs border flex items-center space-x-2 ${
                    faceCheckResult.passed
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800 text-rose-300'
                  }`}
                >
                  {faceCheckResult.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{faceCheckResult.message}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera()
                    setRegStep(1)
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-white text-xs"
                >
                  Back
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={captureLivePhoto}
                    disabled={livePhotoVerifying}
                    className="px-4 py-2 rounded-md bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-white text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{livePhotoVerifying ? 'Analyzing Frame...' : 'Capture & Validate'}</span>
                  </button>
                  {faceCheckResult?.passed && (
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1"
                    >
                      <span>Proceed to ID Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Institutional ID Card Upload */}
          {regStep === 3 && (
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-1 text-xs">
                <p className="font-semibold text-white flex items-center space-x-1.5">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Institutional ID Card Photograph</span>
                </p>
                <p className="text-[#8B949E]">
                  Upload a clear photograph of your physical university student ID card. Optical evaluation will extract institution, student name, and enrollment ID.
                </p>
              </div>

              <div className="border-2 border-dashed border-[#30363D] rounded-lg p-6 text-center space-y-3 hover:border-[#238636] transition-colors">
                {idCardBase64 ? (
                  <div className="space-y-2">
                    <img src={idCardBase64} alt="ID Card Preview" className="max-h-48 mx-auto rounded border border-[#30363D]" />
                    <p className="text-emerald-400 text-xs font-semibold">✓ ID Card Loaded</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-[#8B949E] mx-auto" />
                    <div>
                      <p className="text-xs text-slate-200 font-semibold">Click to upload physical ID card image</p>
                      <p className="text-[10px] text-[#8B949E]">JPEG or PNG, minimum 480x300 resolution</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleIdCardUpload}
                  className="hidden"
                  id="id-card-upload-input"
                />
                <label
                  htmlFor="id-card-upload-input"
                  className="inline-block px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-white text-xs cursor-pointer border border-[#30363D]"
                >
                  Browse File
                </label>
              </div>

              {idCardResult && (
                <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-1 text-xs">
                  <p className="text-white font-semibold">Extracted Identity Metadata:</p>
                  <p className="text-[#8B949E]">Institution: <strong className="text-slate-200">{idCardResult.institution}</strong></p>
                  <p className="text-[#8B949E]">Extracted Name: <strong className="text-slate-200">{idCardResult.name}</strong></p>
                  <p className="text-[#8B949E]">Enrollment Match: <strong className="text-slate-200">{idCardResult.enrollment}</strong></p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setRegStep(2)}
                  className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-white text-xs"
                >
                  Back
                </button>
                {idCardResult?.isValid && (
                  <button
                    type="button"
                    onClick={() => setRegStep(4)}
                    className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>Proceed to Biometric Consent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Biometric Consent */}
          {regStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#161B22] border border-[#30363D] space-y-3 text-xs">
                <div className="font-semibold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Institutional Biometric Consent & Template Disclosure</span>
                </div>
                <p className="text-[#8B949E] leading-relaxed">
                  By enrolling in the ARGUS system, you consent to the computation of a 512-dimensional numerical
                  feature embedding derived from your facial landmarks.
                </p>
                <div className="p-3 rounded bg-[#0D1117] border border-[#30363D] text-[11px] text-[#8B949E] space-y-1">
                  <p className="text-slate-200 font-semibold">Privacy Commitments:</p>
                  <p>1. Raw facial video frames and high-resolution camera feeds are destroyed immediately.</p>
                  <p>2. Mathematical templates are encrypted and utilized strictly for institutional attendance compliance.</p>
                  <p>3. Biometric templates are automatically purged upon graduation or student account termination.</p>
                </div>

                <label className="flex items-start space-x-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={biometricConsent}
                    onChange={(e) => setBiometricConsent(e.target.checked)}
                    className="mt-0.5 rounded bg-[#0D1117] border-[#30363D] text-[#238636] focus:ring-0"
                  />
                  <span className="text-slate-200 font-medium">
                    I have read and agree to the institutional biometric verification terms and template retention policy.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setRegStep(3)}
                  className="px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] text-white text-xs"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!biometricConsent || regLoading}
                  onClick={handleDispatchRegistration}
                  className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <span>{regLoading ? 'Registering...' : 'Submit & Receive OTP'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Email OTP Verification */}
          {regStep === 5 && (
            <div className="space-y-4">
              {!registrationComplete ? (
                <>
                  <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-1 text-xs">
                    <p className="font-semibold text-white flex items-center space-x-1.5">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span>Verify Institutional Email Address</span>
                    </p>
                    <p className="text-[#8B949E]">
                      A 6-digit verification code has been dispatched to <strong className="text-white font-mono">{regEmail}</strong>.
                    </p>
                    <p className="text-[11px] text-[#8B949E]">
                      Code expires in: <span className="font-mono text-emerald-400 font-bold">{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span>
                    </p>
                  </div>

                  <div className="space-y-2 max-w-xs mx-auto text-center">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.trim())}
                      placeholder="123456"
                      className="w-full h-11 text-center font-mono font-bold tracking-widest text-lg rounded-md bg-[#0D1117] border border-[#30363D] text-white focus:outline-none focus:border-[#238636]"
                    />
                    <p className="text-[10px] text-[#8B949E]">Single-use cryptographic OTP</p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => handleDispatchRegistration()}
                      disabled={regLoading}
                      className="text-xs text-[#8B949E] hover:text-white"
                    >
                      Resend Code
                    </button>
                    <button
                      type="button"
                      disabled={otpCode.length !== 6 || regLoading}
                      onClick={handleVerifyOtpAndComplete}
                      className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {regLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Verify & Finalize</span>}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#238636]/20 text-[#238636] flex items-center justify-center mx-auto border border-[#238636]/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Institutional Registration Submitted</h4>
                    <p className="text-xs text-[#8B949E] mt-1 max-w-md mx-auto">
                      Your institutional email, live facial photograph, and student ID card have been recorded.
                      Your account is currently in <strong className="text-amber-400 font-mono">PENDING_ADMIN_APPROVAL</strong> status.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterOpen(false)
                      setEmail(regEmail)
                      setPassword(regPassword)
                    }}
                    className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* FORGOT PASSWORD WORKFLOW MODAL                                */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => {
          setIsForgotPasswordOpen(false)
          setFpStep(1)
          setFpError(null)
          setFpSuccess(null)
        }}
        title="Institutional Password Reset"
        description="Verify your registered institutional email to reset your access password."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-[#F0F6FC]">
          {fpError && (
            <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{fpError}</span>
            </div>
          )}
          {fpSuccess && (
            <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{fpSuccess}</span>
            </div>
          )}

          {fpStep === 1 ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Registered Institutional Email</label>
                <input
                  type="email"
                  required
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  placeholder="name@mitsgwl.ac.in"
                  className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white focus:outline-none focus:border-[#238636] font-mono"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={fpLoading}
                  className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {fpLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Dispatch Reset Token</span>}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Reset Token</label>
                <input
                  type="text"
                  required
                  value={fpToken}
                  onChange={(e) => setFpToken(e.target.value)}
                  placeholder="Paste URL-safe reset token"
                  className="w-full h-9 px-3 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white focus:outline-none focus:border-[#238636] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">New Password (Argon2id)</label>
                <div className="relative">
                  <input
                    type={fpShowPassword ? 'text' : 'password'}
                    required
                    value={fpNewPassword}
                    onChange={(e) => setFpNewPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 symbol"
                    className="w-full h-9 px-3 pr-9 rounded-md bg-[#0D1117] border border-[#30363D] text-xs text-white focus:outline-none focus:border-[#238636]"
                  />
                  <button
                    type="button"
                    onClick={() => setFpShowPassword(!fpShowPassword)}
                    className="absolute right-2.5 top-2.5 text-[#8B949E] hover:text-white"
                  >
                    {fpShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={fpLoading}
                  className="px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {fpLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Update Password</span>}
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* GOOGLE WORKSPACE OPENID CONNECT MODAL                         */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        title="Google Workspace Institutional SSO (OpenID Connect)"
        description="Single Sign-On integration status and configuration details."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-[#8B949E]">
          <div className="p-3 rounded-md bg-[#161B22] border border-[#30363D] space-y-2">
            <p className="text-white font-semibold flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Institutional Provider Requirements</span>
            </p>
            <p>
              Google Workspace OAuth 2.0 requires an authorized Google Cloud Client ID (<code className="text-emerald-400 font-mono">VITE_GOOGLE_CLIENT_ID</code>)
              registered for the <strong className="text-white">mitsgwl.ac.in</strong> and <strong className="text-white">mitsgwalior.ac.in</strong> domains.
            </p>
          </div>

          <div className="p-3 rounded-md bg-[#0D1117] border border-[#30363D] font-mono text-[11px] space-y-1">
            <p className="text-slate-300 font-bold">Integration Status:</p>
            <p>Provider: Google Cloud Identity / OpenID Connect</p>
            <p>Domain Allowlist: @mitsgwl.ac.in, @mitsgwalior.ac.in</p>
            <p>Client ID: Unconfigured (Set in .env)</p>
          </div>

          <p className="text-[11px]">
            Please sign in with your institutional email and Argon2 password, or contact the Academic Computing Center to provision direct Google SSO tokens.
          </p>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(false)}
              className="px-4 py-2 rounded-md bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
