import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { AuthBackdrop } from '@/components/auth/AuthBackdrop'
import { Logo } from '@/components/ui/Logo'
import { Link } from '@/lib/router'
import { easeOutExpo } from '@/animations/motion'
import { cx } from '@/lib/cx'

type AuthShellProps = {
  /** Form column content (heading, copy, card). */
  children: ReactNode
  /** Optional desktop-only proof column; hidden below `lg`. */
  aside?: ReactNode
  /** Id of the page's `h1`, so the section names itself for AT. */
  labelledBy: string
  skipLabel?: string
}

/**
 * Shared authentication scaffold, contained to the viewport on `lg`+:
 * brand bar + a main region that centers its content and only scrolls if a
 * transient state (e.g. an open error banner) genuinely outgrows the screen,
 * so nothing is ever clipped. Below `lg` the page flows normally — mobile
 * keeps native scrolling.
 */
export function AuthShell({
  children,
  aside,
  labelledBy,
  skipLabel = 'Skip to form',
}: AuthShellProps) {
  const prefersReduced = useReducedMotion()

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-hidden lg:h-dvh lg:min-h-0 lg:overflow-y-hidden">
      <AuthBackdrop />

      <a
        href="#auth-form"
        className="sr-focusable inline-flex min-h-11 items-center rounded-full bg-cobalt-600 px-4 text-sm font-semibold text-white shadow-lg"
      >
        {skipLabel}
      </a>

      <header className="relative shell flex h-14 shrink-0 items-center justify-between lg:h-16">
        <motion.div
          {...(prefersReduced
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.7, ease: easeOutExpo },
              })}
        >
          <Link
            href="/"
            className="-m-2 inline-flex rounded-xl p-2 transition-opacity duration-200 hover:opacity-80"
          >
            <Logo />
            <span className="sr-only">ResumeX AI — back to homepage</span>
          </Link>
        </motion.div>

        {/* Desktop escape hatch — frees the bottom of the form column */}
        <Link
          href="/"
          className="hidden -mx-2 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-500 transition-colors duration-200 hover:text-ink-900 lg:inline-flex"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to ResumeX AI
        </Link>
      </header>

      {/* `min-h-0` lets this region shrink inside the fixed-height root;
          `overflow-y-auto` is the graceful-degradation valve, not the layout */}
      <main className="relative flex min-h-0 flex-1 justify-center overflow-y-auto">
        <div className="shell my-auto w-full py-3 sm:py-4 lg:py-3">
          <div
            className={cx(
              'mx-auto grid w-full items-center',
              aside
                ? 'max-w-[56rem] lg:grid-cols-[minmax(0,26rem)_minmax(0,20rem)] lg:gap-20 xl:gap-24'
                : 'max-w-[30rem]',
            )}
          >
            <section aria-labelledby={labelledBy}>{children}</section>
            {aside}
          </div>
        </div>
      </main>
    </div>
  )
}
