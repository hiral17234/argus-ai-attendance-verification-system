import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher')({
  component: TeacherLayout,
})

function TeacherLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  )
}
