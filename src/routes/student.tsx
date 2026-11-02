import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/student')({
  component: StudentLayout,
})

function StudentLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  )
}
