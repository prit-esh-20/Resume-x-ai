import { cx } from '@/lib/cx'

type LogoProps = {
  className?: string
  tone?: 'light' | 'dark'
  /** Renders the mark only, without the wordmark. */
  markOnly?: boolean
}

/**
 * ResumeX AI wordmark. The mark is an abstract chevron-X: forward motion
 * crossed with the product initial.
 */
export function Logo({ className, tone = 'light', markOnly = false }: LogoProps) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <span
        className="relative grid size-8 shrink-0 place-items-center rounded-[0.5625rem] bg-linear-to-br from-cobalt-500 to-cobalt-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_2px_6px_-1px_var(--color-cobalt-700)]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-[1.15rem]" fill="none">
          <path
            d="M6.4 6.2 12.4 12l-6 5.8"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.9 17.8 18.2 6.2"
            stroke="white"
            strokeOpacity="0.62"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {markOnly ? null : (
        <span
          className={cx(
            'font-display text-[1.0625rem] font-bold tracking-[-0.02em]',
            tone === 'dark' ? 'text-white' : 'text-ink-900',
          )}
        >
          ResumeX
          <span className={tone === 'dark' ? 'text-cobalt-300' : 'text-cobalt-600'}>
            {' '}
            AI
          </span>
        </span>
      )}
    </span>
  )
}
