import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type EyebrowProps = {
  children: ReactNode
  icon?: ReactNode
  className?: string
  tone?: 'light' | 'dark'
}

/** Small capsule label that sits above a section title. */
export function Eyebrow({ children, icon, className, tone = 'light' }: EyebrowProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase',
        tone === 'light'
          ? 'bg-white text-ink-500 ring-1 ring-ink-900/8 shadow-xs'
          : 'bg-white/6 text-ink-200 ring-1 ring-white/12 backdrop-blur-sm',
        className,
      )}
    >
      {icon ? (
        <span
          className={cx(
            'grid size-4 place-items-center',
            tone === 'light' ? 'text-cobalt-600' : 'text-cobalt-300',
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  )
}
