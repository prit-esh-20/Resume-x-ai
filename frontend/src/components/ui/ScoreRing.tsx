import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AnimatedNumber } from './AnimatedNumber'
import { easeOutExpo } from '@/animations/motion'
import { cx } from '@/lib/cx'

type ScoreRingProps = {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  tone?: 'light' | 'dark'
  className?: string
  /** Accessible name for the whole dial. */
  label: string
  /** Skip the viewport gate — used inside the hero, which reveals on load. */
  immediate?: boolean
  /** Font size of the numeric readout, in rem. */
  numberClassName?: string
  caption?: string
}

/**
 * Circular ATS dial. The arc is drawn with an animated `pathLength`, so the
 * sweep is a single GPU-friendly stroke animation rather than a per-frame
 * layout change.
 */
export function ScoreRing({
  value,
  max = 100,
  size = 168,
  strokeWidth = 10,
  tone = 'light',
  className,
  label,
  immediate = false,
  numberClassName = 'text-[2.75rem]',
  caption,
}: ScoreRingProps) {
  const gradientId = useId()
  const prefersReduced = useReducedMotion()

  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const fraction = Math.max(0, Math.min(1, value / max))

  return (
    <div
      className={cx('relative shrink-0', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-cobalt-500)" />
            <stop offset="58%" stopColor="var(--color-signal-500)" />
            <stop offset="100%" stopColor="var(--color-signal-400)" />
          </linearGradient>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={tone === 'dark' ? 'stroke-white/10' : 'stroke-ink-900/8'}
        />

        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: prefersReduced ? fraction : 0 }}
          {...(immediate
            ? { animate: { pathLength: fraction } }
            : { whileInView: { pathLength: fraction }, viewport: { once: true, amount: 0.5 } })}
          transition={{
            duration: prefersReduced ? 0 : 1.6,
            delay: prefersReduced ? 0 : 0.15,
            ease: easeOutExpo,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <div className="flex items-baseline gap-0.5">
          <AnimatedNumber
            value={value}
            immediate={immediate}
            className={cx(
              'font-display font-bold tracking-[-0.03em] tabular-nums',
              numberClassName,
              tone === 'dark' ? 'text-white' : 'text-ink-900',
            )}
          />
          <span
            className={cx(
              'font-display text-sm font-semibold',
              tone === 'dark' ? 'text-ink-300' : 'text-ink-500',
            )}
            aria-hidden="true"
          >
            /{max}
          </span>
        </div>
        {caption ? (
          <span
            className={cx(
              'text-[0.6875rem] font-semibold tracking-[0.1em] uppercase',
              tone === 'dark' ? 'text-signal-300' : 'text-signal-600',
            )}
            aria-hidden="true"
          >
            {caption}
          </span>
        ) : null}
      </div>
    </div>
  )
}
