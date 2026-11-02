// TanStack Start Server Handler definition
import { router } from './router'

export function createStartHandler() {
  return {
    router,
    status: 'ready',
    version: '2.0.0',
    mode: 'adaptive-risk-guided-verification',
  }
}
