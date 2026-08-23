import { useId } from 'react'

/**
 * Authentication backdrop — the landing page's ambient language, reduced to
 * what a focused form needs. Static on purpose: no scroll parallax, no grid
 * floor, just the canvas wash, two very soft light pools behind the card and
 * a faint hairline grid so the page still reads unmistakably as ResumeX AI.
 *
 * Decorative only: `aria-hidden`, `pointer-events-none`, low contrast.
 */
export function AuthBackdrop() {
  const patternId = useId()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base wash — identical to the landing sections */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-canvas to-canvas" />

      {/* Ambient light — one cobalt pool above the card, one aurora pool
          anchored low-right; both held well below hero intensity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(46% 40% at 50% 30%, color-mix(in oklab, var(--color-cobalt-500) 9%, transparent), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(38% 36% at 82% 80%, color-mix(in oklab, var(--color-aurora) 7%, transparent), transparent 72%)',
        }}
      />

      {/* Hairline grid, masked to a soft pool so edges never read as a screen */}
      <svg
        className="absolute inset-0 size-full text-ink-900/[0.04] [mask-image:radial-gradient(64%_58%_at_50%_38%,black,transparent_78%)]"
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
    </div>
  )
}
