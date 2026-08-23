import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { UserMenu } from '@/components/dashboard/UserMenu'
import {
  navSections,
  settingsNavItem,
  user,
  type NavItem,
} from '@/data/dashboard'
import { Link } from '@/lib/router'
import { useRouter } from '@/lib/useRouter'
import { easeOutExpo } from '@/animations/motion'
import { cx } from '@/lib/cx'

/* ------------------------------------------------------------------ items */

type NavLinkProps = {
  item: NavItem
  active: boolean
  collapsed: boolean
  onNavigate?: () => void
}

function NavLink({ item, active, collapsed, onNavigate }: NavLinkProps) {
  const Icon = item.icon

  return (
    <li className="group/tip relative">
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-label={collapsed ? item.label : undefined}
        aria-current={active ? 'page' : undefined}
        className={cx(
          'flex h-11 items-center gap-3 rounded-xl text-[0.875rem] font-medium outline-offset-2',
          'transition-[background-color,color,box-shadow] duration-200',
          collapsed ? 'w-11 justify-center' : 'px-3',
          active
            ? 'bg-cobalt-500/[0.18] text-white ring-1 ring-inset ring-cobalt-400/30'
            : 'text-ink-300 hover:bg-white/[0.06] hover:text-white',
        )}
      >
        <Icon
          aria-hidden="true"
          className={cx(
            'size-[1.15rem] shrink-0 transition-colors duration-200',
            active
              ? 'text-cobalt-300'
              : 'text-ink-400 group-hover/tip:text-ink-200',
          )}
        />
        {collapsed ? (
          <span
            aria-hidden="true"
            className={cx(
              'pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 rounded-md bg-ink-800 px-2.5 py-1.5',
              'text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-md ring-1 ring-white/10',
              'transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100',
            )}
          >
            {item.label}
          </span>
        ) : (
          <span className="truncate">{item.label}</span>
        )}
      </Link>
    </li>
  )
}

/* ------------------------------------------------------- shared nav body */

/**
 * Scrollable navigation + pinned account footer. Rendered inside the desktop
 * rail and the mobile drawer so both surfaces stay identical.
 */
function SidebarBody({
  collapsed,
  path,
  onNavigate,
}: {
  collapsed: boolean
  path: string
  onNavigate?: () => void
}) {
  return (
    <>
      <nav
        aria-label="Dashboard"
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pt-5 pb-3"
      >
        {navSections.map((section, index) => (
          <div key={section.id} className={index > 0 ? 'mt-6' : undefined}>
            {collapsed ? (
              <div aria-hidden="true" className="mx-auto mb-3 h-px w-7 bg-white/10" />
            ) : (
              <p className="mb-2 px-3 text-[0.6875rem] font-bold tracking-[0.14em] text-ink-500 uppercase">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  active={path === item.href}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/[0.07] p-3">
        <ul className="mb-2 space-y-1">
          <NavLink
            item={settingsNavItem}
            active={path === settingsNavItem.href}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </ul>
        <UserMenu user={user} variant="card" placement="top" align="start" />
      </div>
    </>
  )
}

/* ------------------------------------------------------------- desktop rail */

export function Sidebar({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
}) {
  const { path } = useRouter()

  // Clip content only while the width transition runs — otherwise flyout
  // tooltips and the profile menu would be cut off by the rail's bounds.
  const [clipping, setClipping] = useState(false)
  const clipTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(clipTimer.current), [])

  const handleToggle = () => {
    onToggleCollapse()
    setClipping(true)
    window.clearTimeout(clipTimer.current)
    clipTimer.current = window.setTimeout(() => setClipping(false), 340)
  }

  return (
    <aside
      className={cx(
        'sticky top-0 z-40 hidden h-dvh shrink-0 flex-col lg:flex',
        'rim-light bg-linear-to-b from-ink-900 to-ink-950',
        'transition-[width] duration-300 ease-[var(--ease-out-quint)]',
        collapsed ? 'w-[4.75rem]' : 'w-[16.75rem]',
        clipping && 'overflow-hidden',
      )}
      aria-label="Primary"
    >
      <div
        className={cx(
          'flex h-16 shrink-0 items-center border-b border-white/[0.07]',
          collapsed ? 'flex-col justify-center gap-3 px-0' : 'justify-between px-4',
        )}
      >
        <Link
          href="/dashboard"
          aria-label="ResumeX AI — dashboard home"
          className="-m-1 rounded-xl p-1 transition-opacity duration-200 hover:opacity-80"
        >
          <Logo tone="dark" markOnly={collapsed} />
        </Link>

        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={collapsed}
          className={cx(
            'grid size-9 place-items-center rounded-xl text-ink-400 transition-colors duration-200',
            'hover:bg-white/[0.07] hover:text-white focus-visible:bg-white/[0.07]',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-[1.15rem]" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-[1.15rem]" aria-hidden="true" />
          )}
          <span className="sr-only">
            {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </span>
        </button>
      </div>

      <SidebarBody collapsed={collapsed} path={path} />
    </aside>
  )
}

/* ----------------------------------------------------------- mobile drawer */

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { path } = useRouter()
  const prefersReduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  // Escape closes; background scroll is locked while the drawer is out;
  // focus moves into the dialog and returns to the trigger on close.
  useEffect(() => {
    if (!open) return

    previouslyFocusedElement.current =
      document.activeElement as HTMLElement | null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (
        previouslyFocusedElement.current &&
        document.contains(previouslyFocusedElement.current)
      ) {
        previouslyFocusedElement.current.focus()
      }
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <div
          key="mobile-drawer"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <motion.button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="absolute inset-0 size-full cursor-default bg-ink-950/55 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={prefersReduced ? false : { x: '-100%' }}
            animate={{ x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { x: '-100%' }}
            transition={{ duration: 0.32, ease: easeOutExpo }}
            className="absolute inset-y-0 left-0 flex w-[17.5rem] max-w-[86vw] flex-col rim-light bg-linear-to-b from-ink-900 to-ink-950 shadow-float"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
              <Link
                href="/dashboard"
                aria-label="ResumeX AI — dashboard home"
                onClick={onClose}
                className="-m-1 rounded-xl p-1 transition-opacity duration-200 hover:opacity-80"
              >
                <Logo tone="dark" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="grid size-9 place-items-center rounded-xl text-ink-400 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
              >
                <X className="size-[1.15rem]" aria-hidden="true" />
                <span className="sr-only">Close navigation</span>
              </button>
            </div>

            <SidebarBody collapsed={false} path={path} onNavigate={onClose} />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
