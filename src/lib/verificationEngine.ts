import { VerificationSignals, RiskLevel, VerificationOutcome } from './types'

export interface VerificationStage {
  id: string
  name: string
  description: string
  status: 'idle' | 'running' | 'passed' | 'warning' | 'failed'
  details?: string
}

export const INITIAL_VERIFICATION_STAGES: VerificationStage[] = [
  { id: 'camera', name: 'Camera & Sensor', description: 'Initializing secure video stream', status: 'idle' },
  { id: 'face_detection', name: 'Face Detection', description: 'Scanning bounding box & landmarks', status: 'idle' },
  { id: 'image_quality', name: 'Image Quality Assessment', description: 'Checking blur, lux & resolution', status: 'idle' },
  { id: 'liveness', name: 'Passive Liveness Check', description: 'Anti-spoofing screen replay check', status: 'idle' },
  { id: 'challenge', name: 'Random Gesture Challenge', description: 'Adaptive real-time movement prompt', status: 'idle' },
  { id: 'face_match', name: 'ArcFace Biometric Match', description: '512-d feature vector comparison', status: 'idle' },
  { id: 'device_trust', name: 'Device Trust Verification', description: 'Hardware fingerprint & cert status', status: 'idle' },
  { id: 'location', name: 'Campus Geofence Audit', description: 'Verifying GPS & WiFi BSSID range', status: 'idle' },
  { id: 'adaptive_decision', name: 'ARGUS Adaptive Decision', description: 'Computing multi-signal risk matrix', status: 'idle' },
]

export const RANDOM_CHALLENGES = [
  { type: 'Turn head left' as const, instruction: 'Slowly turn your head to the LEFT', icon: 'ArrowLeft' },
  { type: 'Turn head right' as const, instruction: 'Slowly turn your head to the RIGHT', icon: 'ArrowRight' },
  { type: 'Blink' as const, instruction: 'Blink your eyes twice firmly', icon: 'Eye' },
  { type: 'Smile' as const, instruction: 'Please smile gently towards camera', icon: 'Smile' },
  { type: 'Nod' as const, instruction: 'Nod your head up and down once', icon: 'MoveVertical' },
]

export function computeAdaptiveVerification(
  scenario: 'success' | 'review' | 'rejected' = 'success',
  challengeType: typeof RANDOM_CHALLENGES[number]['type'] = 'Turn head left'
): { signals: VerificationSignals; outcome: VerificationOutcome } {
  if (scenario === 'review') {
    const signals: VerificationSignals = {
      faceScore: 0.74,
      livenessScore: 0.92,
      challengeScore: 0.90,
      imageQualityScore: 0.84,
      deviceTrustScore: 0.45,
      locationScore: 0.95,
      compositeConfidence: 76,
      riskLevel: 'MEDIUM',
      riskFactors: [
        'ArcFace biometric similarity 0.74 is borderline (acceptance baseline: 0.80)',
        'Unregistered mobile device detected — hardware fingerprint not in trusted profile',
      ],
      humanExplanation:
        'Face match confidence was borderline (74%) and this device was not previously registered. Because liveness and campus geofence passed, this attempt has been forwarded to the course teacher for visual review rather than rejected.',
      challengeType,
    }
    return { signals, outcome: 'REVIEW' }
  }

  if (scenario === 'rejected') {
    const signals: VerificationSignals = {
      faceScore: 0.43,
      livenessScore: 0.38,
      challengeScore: 0.25,
      imageQualityScore: 0.60,
      deviceTrustScore: 0.20,
      locationScore: 0.30,
      compositeConfidence: 34,
      riskLevel: 'HIGH',
      riskFactors: [
        'ArcFace embedding similarity 0.43 (far below 0.80 threshold)',
        'Liveness micro-texture failed — suspicious 2D planar reflection detected',
        'Device GPS reported 820m away from permitted classroom perimeter',
      ],
      humanExplanation:
        'Unable to establish sufficient identity confidence. Multiple high-severity risk signals were detected across facial recognition, liveness anti-spoofing, and campus location boundaries.',
      challengeType,
    }
    return { signals, outcome: 'REJECTED' }
  }

  // Success / Low Risk
  const signals: VerificationSignals = {
    faceScore: 0.96,
    livenessScore: 0.98,
    challengeScore: 1.0,
    imageQualityScore: 0.95,
    deviceTrustScore: 0.96,
    locationScore: 0.99,
    compositeConfidence: 97,
    riskLevel: 'LOW',
    riskFactors: [],
    humanExplanation:
      'High-confidence identity match verified. ArcFace 512-d embedding matches student profile with 96% similarity. Known trusted device and verified presence inside lecture hall boundary.',
    challengeType,
  }
  return { signals, outcome: 'ACCEPTED' }
}
