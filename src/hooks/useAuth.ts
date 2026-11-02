import { useState, useEffect } from 'react'
import { User, UserRole } from '../lib/types'
import { MOCK_USERS } from '../lib/mockData'

const AUTH_STORAGE_KEY = 'argus_current_user_role'

export function useAuth() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      if (saved && saved in MOCK_USERS) {
        return saved as UserRole
      }
    } catch {}
    return 'student'
  })

  const currentUser: User = MOCK_USERS[currentRole] || MOCK_USERS.student

  const switchRole = (role: UserRole) => {
    setCurrentRole(role)
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, role)
    } catch {}
  }

  const loginAs = (email: string) => {
    const foundRole = (Object.keys(MOCK_USERS) as UserRole[]).find(
      (role) => MOCK_USERS[role].email.toLowerCase() === email.toLowerCase()
    )
    if (foundRole) {
      switchRole(foundRole)
      return foundRole
    }
    // Default fallback to student
    switchRole('student')
    return 'student'
  }

  const logout = () => {
    switchRole('student')
  }

  return {
    currentUser,
    currentRole,
    switchRole,
    loginAs,
    logout,
    allUsers: MOCK_USERS,
  }
}
