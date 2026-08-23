import { useId } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { AuroraField } from '@/components/ui/AuroraField'
import { cx } from '@/lib/cx'

type AmbientBackdropProps = {
  /**
   * `hero` — light canvas with a drifting aurora field, a soft stage floor and
   * ambient light. The most treated surface on the page.
   * `deep` — dark surface used by the closing CTA.
   * `quiet` — light canvas, ambient light only, no grid.
   */
  variant?: 'hero' | 'deep' | 'quiet'
  className?: string
}

/**
 * Decorative depth layer. Everything here is `aria-hidden`, non-interactive
 * and held at very low opacity so it can never compete with content — the
 * dimension comes from soft ambient light plus one perspective plane, not
 * from floating geometry.
 */
export function AmbientBackdrop({ variant = 'quiet', className }: AmbientBackdropProps) {
  const patternId = useId()
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()

  const drift = useTransform(scrollY, [0, 900], [0, 110])
  const driftSlow = useTransform(scrollY, [0, 900], [0, 48])

  const isDeep = variant === 'deep'
  const isHero = variant === 'hero'

  return (
    <div
      className={cx('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {/* Base wash */}
      {isDeep ? (
        <div className="absolute inset-0 bg-ink-950" />
      ) : (
        <div className="absolute inset-0 bg-linear-to-b from-white via-canvas to-canvas" />
      )}

      {/* Aurora field — sits on the base wash, under every other layer here, so
          the grid, stage floor and seams all still read on top of it */}
      {isHero ? <AuroraField /> : null}

      {/* Ambient light — two very soft radial pools, gently parallaxed. Held
          lower on the hero than elsewhere, since the aurora already carries
          most of the ambient light there */}
      <motion.div
        className="absolute inset-0"
        style={prefersReduced ? undefined : { y: drift }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDeep
              ? 'radial-gradient(46% 48% at 50% 108%, color-mix(in oklab, var(--color-cobalt-500) 30%, transparent), transparent 72%)'
              : `radial-gradient(52% 46% at 76% 12%, color-mix(in oklab, var(--color-cobalt-500) ${isHero ? 7 : 13}%, transparent), transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={prefersReduced ? undefined : { y: driftSlow }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDeep
              ? 'radial-gradient(40% 44% at 14% 18%, color-mix(in oklab, var(--color-aurora) 22%, transparent), transparent 72%)'
              : `radial-gradient(42% 40% at 10% 26%, color-mix(in oklab, var(--color-aurora) ${isHero ? 5 : 9}%, transparent), transparent 72%)`,
          }}
        />
      </motion.div>

      {/* Hairline grid, masked to a soft pool so edges never read as a screen */}
      {variant !== 'quiet' ? (
        <svg
          className={cx(
            'absolute inset-0 size-full',
            isDeep ? 'text-white/[0.07]' : 'text-ink-900/[0.055]',
            '[mask-image:radial-gradient(72%_62%_at_50%_30%,black,transparent_78%)]',
          )}
        >
          <defs>
            <pattern
              id={patternId}
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
              x="50%"
              y="0"
            >
              <path d="M60 0H0V60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      ) : null}

      {/* Perspective stage floor — one plane, faint, desktop only */}
      {variant !== 'quiet' ? (
        <div className="absolute inset-x-0 bottom-0 hidden h-[34vh] [perspective:820px] lg:block">
          <div
            className="absolute inset-x-[-30%] bottom-0 h-[150%] origin-bottom [mask-image:linear-gradient(to_top,black,transparent_82%)] [transform:rotateX(72deg)]"
            style={{
              backgroundImage: isDeep
                ? 'linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)'
                : 'linear-gradient(to right, rgb(13 21 38 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgb(13 21 38 / 0.07) 1px, transparent 1px)',
              backgroundSize: '78px 78px',
            }}
          />
        </div>
      ) : null}

      {/* Vignette / seam so the section blends into its neighbours */}
      {isDeep ? (
        <div className="absolute inset-0 bg-[radial-gradient(78%_70%_at_50%_44%,transparent,color-mix(in_oklab,var(--color-ink-950)_82%,transparent))]" />
      ) : (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-canvas" />
      )}
    </div>
  )
}
