import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react'
import { RouterContext, type RouterValue } from '@/lib/routerContext'

function currentPath() {
  const path = window.location.pathname
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path || '/'
}

/**
 * Minimal history-based router. Deep links resolve through Vite's SPA
 * fallback in dev and preview; no hash routing, so the landing page's
 * in-page anchors keep working untouched.
 */
export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const sync = () => setPath(currentPath())
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState({}, '', to)
      setPath(currentPath())
      return
    }
    if (to === currentPath()) {
      window.scrollTo(0, 0)
      return
    }
    window.history.pushState({}, '', to)
    setPath(currentPath())
    window.scrollTo(0, 0)
  }, [])

  const value = useMemo<RouterValue>(() => ({ path, navigate }), [path, navigate])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/**
 * Internal link that participates in client-side navigation. Modifier
 * clicks, middle clicks and explicit targets fall through to the browser.
 * Hash anchors (`#pricing`) are left completely alone.
 */
export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const router = useContext(RouterContext)
  const isInternal = href.startsWith('/') && rest.target !== '_blank' && !rest.download

  return (
    <a
      {...rest}
      href={href}
      onClick={
        isInternal && router
          ? (event) => {
              onClick?.(event)
              if (event.defaultPrevented) return
              if (event.button !== 0) return
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              event.preventDefault()
              router.navigate(href)
            }
          : onClick
      }
    >
      {children}
    </a>
  )
}
