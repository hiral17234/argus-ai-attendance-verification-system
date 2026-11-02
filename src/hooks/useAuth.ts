import { useState, useEffect, useCallback } from 'react'
import { User, UserRole } from '../lib/types'
import { MOCK_USERS } from '../lib/mockData'
import { authApi, getStoredAccessToken, clearStoredTokens, UserProfile } from '../lib/api'

const AUTH_STORAGE_KEY = 'argus_current_user_role'
const USER_DATA_STORAGE_KEY = 'argus_user_profile_data'

export function useAuth() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      if (saved && (saved in MOCK_USERS || saved === 'student' || saved === 'teacher' || saved === 'admin')) {
        return saved as UserRole
      }
    } catch {}
    return 'student'
  })

  const [backendUser, setBackendUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_DATA_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return null
  })

  const [isLoadingAuth, setIsLoadingAuth] = useState(false)

  // Sync with backend on startup if token is available
  useEffect(() => {
    const token = getStoredAccessToken()
    if (token) {
      setIsLoadingAuth(true)
      authApi.getMe()
        .then((profile) => {
          setBackendUser(profile)
          const resolvedRole = (profile.role as UserRole) || 'student'
          setCurrentRole(resolvedRole)
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, resolvedRole)
            localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(profile))
          } catch {}
        })
        .catch(() => {
          // Token expired or server unreachable
          clearStoredTokens()
        })
        .finally(() => {
          setIsLoadingAuth(false)
        })
    }
  }, [])

  const switchRole = useCallback((role: UserRole) => {
    setCurrentRole(role)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, role)
    } catch {}
  }, [])

  // Real backend authentication
  const loginWithBackend = async (email: string, password: string): Promise<UserRole> => {
    const res = await authApi.login({ email, password })
    const role = (res.user.role as UserRole) || 'student'
    switchRole(role)
    try {
      const profile: UserProfile = {
        id: res.user.id,
        email: res.user.email,
        full_name: res.user.full_name,
        role: res.user.role,
        status: res.user.status,
        is_active: true,
        is_verified: res.user.is_verified,
        avatar_url: res.user.avatar_url,
      }
      setBackendUser(profile)
      localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(profile))
    } catch {}
    return role
  }

  // Fallback demo login helper
  const loginAs = (email: string) => {
    const foundRole = (Object.keys(MOCK_USERS) as UserRole[]).find(
      (role) => MOCK_USERS[role].email.toLowerCase() === email.toLowerCase()
    )
    if (foundRole) {
      switchRole(foundRole)
      return foundRole
    }
    switchRole('student')
    return 'student'
  }

  const logout = () => {
    clearStoredTokens()
    setBackendUser(null)
    try {
      localStorage.removeItem(USER_DATA_STORAGE_KEY)
    } catch {}
    switchRole('student')
  }

  // Derive current user object combining real backend profile with default avatar/title
  const baseMockUser = MOCK_USERS[currentRole] || MOCK_USERS.student
  const currentUser: User = backendUser
    ? {
        ...baseMockUser,
        id: backendUser.id,
        name: backendUser.full_name,
        email: backendUser.email,
        role: (backendUser.role as UserRole) || currentRole,
        enrollmentNo: backendUser.enrollment_number || baseMockUser.enrollmentNo,
        employeeId: backendUser.faculty_id || baseMockUser.employeeId,
      }
    : baseMockUser

  return {
    currentUser,
    currentRole,
    switchRole,
    loginAs,
    loginWithBackend,
    logout,
    isLoadingAuth,
    backendUser,
    allUsers: MOCK_USERS,
  }
}
