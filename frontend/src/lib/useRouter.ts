import { useContext } from 'react'
import { RouterContext, type RouterValue } from '@/lib/routerContext'

/** Read the current path and navigate — must render under `RouterProvider`. */
export function useRouter(): RouterValue {
  const router = useContext(RouterContext)
  if (!router) throw new Error('useRouter must be used within <RouterProvider>.')
  return router
}
