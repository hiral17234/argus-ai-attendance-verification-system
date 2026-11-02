// TanStack Start Client / App Entry
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createStart() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
  })
}
