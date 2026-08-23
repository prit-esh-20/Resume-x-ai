import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { AuthBackdrop } from '@/components/auth/AuthBackdrop'
import { Logo } from '@/components/ui/Logo'
import { Link } from '@/lib/router'
import { easeOutExpo } from '@/animations/motion'
import { cx } from '@/lib/cx'

type AuthShellProps = {
  /** Form column content (heading, copy, card, footnotes). */
  children: ReactNode
  /** Optional desktop-only proof column; hidden below `lg`. */
  aside?: ReactNode
  /** Id of the page's `h1`, so the section names itself for AT. */
  labelledBy: string
  skipLabel?: string
}

/**
 * Shared authentication scaffold: ambient backdrop, brand header and the
 * two-column grid that keeps every auth page recognisably ResumeX AI.
 */
export function AuthShell({
  children,
  aside,
  labelledBy,
  skipLabel = 'Skip to form',
}: AuthShellProps) {
  const prefersReduced = useReducedMotion()

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <AuthBackdrop />

      <a
        href="#auth-form"
        className="sr-focusable inline-flex min-h-11 items-center rounded-full bg-cobalt-600 px-4 text-sm font-semibold text-white shadow-lg"
      >
        {skipLabel}
      </a>

      <header className="relative shell flex h-16 shrink-0 items-center lg:h-[4.5rem]">
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
      </header>

      <main className="relative flex flex-1 items-center">
        <div className="shell w-full">
          <div
            className={cx(
              'mx-auto grid w-full items-center gap-16 py-10 sm:py-14',
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
