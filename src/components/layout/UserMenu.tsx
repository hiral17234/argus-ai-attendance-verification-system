import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { User, LogOut, ShieldCheck, ChevronDown, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../lib/types'

export function UserMenu() {
  const { currentUser, currentRole, switchRole, logout, allUsers } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'student', label: 'Student', desc: 'Hiral Goyal (0901CS221045)' },
    { role: 'teacher', label: 'Teacher', desc: 'Dr. Ankit Sharma (EMP-CS-8812)' },
    { role: 'admin', label: 'Administrator', desc: 'Prof. R. K. Mukherjee' },
    { role: 'coordinator', label: 'Coordinator', desc: 'Dr. Sneha Roy' },
    { role: 'security', label: 'IT / Security', desc: 'Vikramaditya Rao' },
    { role: 'superadmin', label: 'Super Admin', desc: 'Chancellor Root Account' },
  ]

  const handleRoleChange = (role: UserRole) => {
    switchRole(role)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-700 transition-all text-left"
      >
        <img
          src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
          alt={currentUser.name}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/40"
        />
        <div className="hidden sm:block leading-tight text-left">
          <p className="text-xs font-semibold text-slate-100">{currentUser.name}</p>
          <p className="text-[10px] text-slate-400 capitalize">{currentRole}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-2 space-y-2 animate-in fade-in duration-100">
            <div className="px-3 py-2 border-b border-slate-800">
              <p className="text-xs font-semibold text-white">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400">{currentUser.email}</p>
              <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-emerald-400 font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>{currentUser.department}</span>
              </div>
            </div>

            <div className="px-2 pt-1 pb-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Switch Demo Portal Role
            </div>

            <div className="space-y-0.5">
              {roles.map((r) => {
                const isSelected = currentRole === r.role
                return (
                  <button
                    key={r.role}
                    onClick={() => handleRoleChange(r.role)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{r.label}</p>
                      <p className="text-[10px] text-slate-400">{r.desc}</p>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-2">
              <Link
                to={currentRole === 'teacher' ? '/teacher/profile' : '/student/profile'}
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/"
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
