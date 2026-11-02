/**
 * ARGUS Institutional Platform — Unified API Service Layer
 * Direct interface to the FastAPI Backend (/api/v1)
 */

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api/v1'

const ACCESS_TOKEN_KEY = 'argus_access_token'
const REFRESH_TOKEN_KEY = 'argus_refresh_token'

export function getStoredAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredTokens(accessToken: string, refreshToken?: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  } catch {}
}

export function clearStoredTokens(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {}
}

export interface ApiErrorResponse {
  detail: string | Array<{ msg: string; loc: string[] }>
  status?: number
}

export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.status = status
    this.detail = detail
    this.name = 'ApiError'
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} Error`
    try {
      const errorJson = await response.json()
      if (typeof errorJson.detail === 'string') {
        errorMessage = errorJson.detail
      } else if (Array.isArray(errorJson.detail)) {
        errorMessage = errorJson.detail.map((d: any) => d.msg).join(', ')
      }
    } catch {}
    throw new ApiError(response.status, errorMessage)
  }

  return response.json() as Promise<T>
}

// -------------------------------------------------------------
// Authentication API Contracts
// -------------------------------------------------------------

export interface LoginPayload {
  email: string
  password: string
  device_fingerprint?: string
  device_name?: string
  browser?: string
  os?: string
}

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
  role: 'student' | 'teacher' | 'admin'
  phone_number?: string
  enrollment_number?: string
  roll_number?: string
  section?: string
  faculty_id?: string
  designation?: string
  department_id?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: {
    id: string
    email: string
    full_name: string
    role: string
    status: string
    is_verified: boolean
    avatar_url?: string
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
  status: string
  is_active: boolean
  is_verified: boolean
  phone_number?: string
  avatar_url?: string
  institution_id?: string
  department_id?: string
  enrollment_number?: string
  faculty_id?: string
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const data = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    setStoredTokens(data.access_token, data.refresh_token)
    return data
  },

  register: async (payload: RegisterPayload) => {
    return apiClient<{ success: boolean; message: string; email: string; user_id: string; dev_otp?: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    )
  },

  verifyEmail: async (email: string, otp: string) => {
    return apiClient<{ success: boolean; message: string; status: string }>(
      '/auth/verify-email',
      {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      }
    )
  },

  getMe: async (): Promise<UserProfile> => {
    return apiClient<UserProfile>('/auth/me')
  },

  forgotPassword: async (email: string) => {
    return apiClient<{ success: boolean; message: string; dev_reset_token?: string }>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    )
  },

  resetPassword: async (email: string, token: string, newPassword: string) => {
    return apiClient<{ success: boolean; message: string }>(
      '/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({ email, token, new_password: newPassword }),
      }
    )
  },

  logout: () => {
    clearStoredTokens()
  },
}

export const enrollmentApi = {
  validateLivePhoto: async (imageBase64: string) => {
    return apiClient<{
      success: boolean
      face_count: number
      quality_score: number
      bounding_box?: { x: number; y: number; width: number; height: number }
      message: string
    }>('/enrollment/validate-live-photo', {
      method: 'POST',
      body: JSON.stringify({ image_base64: imageBase64 }),
    })
  },

  validateIdCard: async (imageBase64: string, expectedName?: string, expectedEnrollment?: string) => {
    return apiClient<{
      success: boolean
      analysis: {
        is_valid: boolean
        aspect_ratio: number
        detected_institution: string
        extracted_name: string
        extracted_enrollment: string
        card_format: string
      }
      message: string
    }>('/enrollment/validate-id-card', {
      method: 'POST',
      body: JSON.stringify({
        image_base64: imageBase64,
        expected_name: expectedName,
        expected_enrollment: expectedEnrollment,
      }),
    })
  },

  submitEnrollment: async (payload: {
    live_photo_base64: string
    id_card_base64: string
    biometric_consent: boolean
  }) => {
    return apiClient<{
      success: boolean
      message: string
      status: string
      enrollment_id?: string
    }>('/enrollment/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}

export const adminApi = {
  getPendingApprovals: async () => {
    return apiClient<{
      students: Array<{
        student_id: string
        user_id: string
        name: string
        email: string
        enrollment_number: string
        section: string
        id_verified: boolean
        face_verified: boolean
        biometric_consent: boolean
        status: string
      }>
      teachers: Array<{
        teacher_id: string
        user_id: string
        name: string
        email: string
        faculty_id: string
        designation: string
        verified_by_admin: boolean
        status: string
      }>
    }>('/admin/pending-approvals')
  },

  approveStudent: async (studentId: string) => {
    return apiClient<{ success: boolean; message: string; status: string }>(
      `/admin/students/${studentId}/approve`,
      { method: 'POST' }
    )
  },

  rejectStudent: async (studentId: string, reason: string) => {
    return apiClient<{ success: boolean; message: string; status: string }>(
      `/admin/students/${studentId}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }
    )
  },

  approveTeacher: async (teacherId: string) => {
    return apiClient<{ success: boolean; message: string; status: string }>(
      `/admin/teachers/${teacherId}/approve`,
      { method: 'POST' }
    )
  },
}

export const healthApi = {
  check: async () => {
    return apiClient<{
      status: string
      app_name: string
      version: string
      environment: string
      database: { status: string; dialect: string }
      institutional_domains: Record<string, string>
    }>('/health')
  },
}
