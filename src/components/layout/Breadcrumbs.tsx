import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const routerState = useRouterState()
  const path = routerState.location.pathname
  const segments = path.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400">
      <Link to="/" className="hover:text-slate-200 flex items-center transition-colors">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((segment, idx) => {
        const isLast = idx === segments.length - 1
        const routeTo = `/${segments.slice(0, idx + 1).join('/')}`
        const label = segment
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')

        return (
          <div key={routeTo} className="flex items-center space-x-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isLast ? (
              <span className="text-emerald-400 font-medium">{label}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-200 transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
