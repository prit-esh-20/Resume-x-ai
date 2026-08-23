import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { notifications } from '@/data/dashboard'
import { easeOutExpo } from '@/animations/motion'
import { cx } from '@/lib/cx'

type NotificationsMenuProps = {
  /** Ring colour around the unread dot — matches the surface behind it. */
  badgeRingClass?: string
  placement?: 'top' | 'bottom'
  align?: 'end' | 'start'
  className?: string
}

const unreadCount = notifications.filter((item) => item.unread).length

/**
 * Compact notification popover for the dashboard header / mobile top bar.
 * Demo data only — the panel is intentionally minimal.
 */
export function NotificationsMenu({
  badgeRingClass = 'ring-white',
  placement = 'bottom',
  align = 'end',
  className,
}: NotificationsMenuProps) {
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

  return (
    <div ref={rootRef} className={cx('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative grid size-10 place-items-center rounded-xl text-ink-500 transition-colors duration-200 hover:bg-ink-900/5 hover:text-ink-900"
      >
        <Bell className="size-[1.15rem]" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span
            aria-hidden="true"
            className={cx(
              'absolute top-2 right-2.5 size-2 rounded-full bg-cobalt-500 ring-2',
              badgeRingClass,
            )}
          />
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: easeOutExpo }}
            className={cx(
              'absolute z-50 w-[19rem] overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-lg',
              placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            )}
          >
            <div className="flex items-center justify-between border-b border-ink-900/8 px-4 py-3">
              <p className="text-sm font-semibold text-ink-900">Notifications</p>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-cobalt-50 px-2 py-0.5 text-[0.6875rem] font-bold text-cobalt-700 tnum">
                  {unreadCount} new
                </span>
              ) : null}
            </div>

            <ul className="max-h-72 overflow-y-auto p-1.5">
              {notifications.map((item) => (
                <li key={item.id}>
                  <div className="flex gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-ink-50">
                    <span
                      aria-hidden="true"
                      className={cx(
                        'mt-1.5 size-1.5 shrink-0 rounded-full',
                        item.unread ? 'bg-cobalt-500' : 'bg-transparent',
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-[0.8125rem] leading-snug font-semibold text-ink-800">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-ink-500">{item.detail}</p>
                      <p className="mt-1 text-[0.6875rem] font-medium text-ink-400">
                        {item.timeLabel}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
