import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, CircleUserRound, LogOut, Settings } from 'lucide-react'
import { useRouter } from '@/lib/useRouter'
import type { DashboardUser } from '@/data/dashboard'
import { easeOutExpo } from '@/animations/motion'
import { cx } from '@/lib/cx'

const REMEMBERED_EMAIL_KEY = 'resumex:remembered-email'

type UserMenuProps = {
  user: DashboardUser
  /** `card` = labelled row (sidebar footer); `avatar` = compact icon trigger. */
  variant?: 'card' | 'avatar'
  /** Direction the panel opens towards. */
  placement?: 'top' | 'bottom'
  align?: 'start' | 'end'
  className?: string
}

/**
 * Profile popover shared by the desktop sidebar and the mobile top bar.
 * Sign-out clears the frontend demo auth state and returns to the landing
 * page; no real session exists yet.
 */
export function UserMenu({
  user,
  variant = 'card',
  placement = 'top',
  align = 'start',
  className,
}: UserMenuProps) {
  const { navigate } = useRouter()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleSignOut = () => {
    setOpen(false)
    try {
      window.localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    } catch {
      /* storage unavailable — the demo sign-out still navigates away */
    }
    navigate('/')
  }

  const avatar = (
    <span
      aria-hidden="true"
      className={cx(
        'grid shrink-0 place-items-center rounded-full bg-linear-to-br from-cobalt-400 to-cobalt-700 font-display font-bold text-white',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_2px_6px_-1px_var(--color-cobalt-800)]',
        variant === 'card' ? 'size-9 text-[0.8125rem]' : 'size-9 text-sm',
      )}
    >
      {user.initials}
    </span>
  )

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cx(
          'group flex w-full items-center gap-3 rounded-xl outline-offset-4 transition-colors duration-200',
          variant === 'card'
            ? 'px-2 py-2 text-left hover:bg-white/[0.07] focus-visible:bg-white/[0.07]'
            : 'justify-center rounded-full p-1 hover:ring-2 hover:ring-white/25 focus-visible:ring-2 focus-visible:ring-white/25',
        )}
      >
        {avatar}
        {variant === 'card' ? (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.8125rem] font-semibold leading-tight text-white">
                {user.name}
              </span>
              <span className="block truncate text-xs leading-tight text-ink-400">
                {user.role}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cx(
                'size-4 shrink-0 text-ink-400 transition-transform duration-200 group-hover:text-ink-200',
                open && 'rotate-180',
              )}
            />
          </>
        ) : (
          <span className="sr-only">Open profile menu</span>
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            aria-label={`${user.name} — account menu`}
            initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: easeOutExpo }}
            className={cx(
              'absolute z-50 w-60 rounded-xl border border-ink-900/10 bg-white p-1.5 shadow-lg',
              'origin-bottom-left',
              placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              align === 'end' ? 'right-0 origin-bottom-right' : 'left-0',
            )}
          >
            <div className="border-b border-ink-900/8 px-3 py-2.5">
              <p className="truncate text-[0.8125rem] font-semibold text-ink-900">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-500">{user.email}</p>
            </div>

            <div className="pt-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  navigate('/settings')
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-50 hover:text-ink-900"
              >
                <CircleUserRound className="size-4 text-ink-400" aria-hidden="true" />
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  navigate('/settings')
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-50 hover:text-ink-900"
              >
                <Settings className="size-4 text-ink-400" aria-hidden="true" />
                Settings
              </button>
            </div>

            <div className="mt-1.5 border-t border-ink-900/8 pt-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50 hover:text-danger-700"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
