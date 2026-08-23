import { createContext } from 'react'

export type RouterValue = {
  /** Current pathname, normalized (no trailing slash, `/` for root). */
  path: string
  navigate: (to: string, options?: { replace?: boolean }) => void
}

/** Read through `useRouter()` — kept in its own module for fast refresh. */
export const RouterContext = createContext<RouterValue | null>(null)
