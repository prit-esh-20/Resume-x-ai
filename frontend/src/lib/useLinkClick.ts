import { useContext, type MouseEvent } from 'react'
import { RouterContext } from '@/lib/routerContext'

type ClickHandler<E extends HTMLElement> = (event: MouseEvent<E>) => void

/** The anchor props that mean "let the browser own this click". */
type BrowserOwned = {
  target?: string
  download?: unknown
}

/**
 * Wraps an anchor's `onClick` so internal `/path` hrefs navigate client-side.
 *
 * Returns the original handler untouched whenever the browser should own the
 * click — external URLs, hash anchors, `target="_blank"`, downloads, or no
 * router above — so an anchor using this stays a plain `<a>` in every case
 * that isn't in-app navigation. Modifier and non-primary clicks always fall
 * through, which is what keeps open-in-new-tab and middle-click working.
 *
 * Shared by `Link` and `Button` so the two cannot drift apart.
 */
export function useLinkClick<E extends HTMLElement>(
  href: string | undefined,
  onClick: ClickHandler<E> | undefined,
  options?: BrowserOwned,
): ClickHandler<E> | undefined {
  const router = useContext(RouterContext)

  // Narrowed to a string here so the closure below doesn't need a re-check.
  const internalHref =
    typeof href === 'string' &&
    href.startsWith('/') &&
    options?.target !== '_blank' &&
    !options?.download
      ? href
      : null

  if (internalHref === null || !router) return onClick

  return (event) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    router.navigate(internalHref)
  }
}
