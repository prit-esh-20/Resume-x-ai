import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { AuthBackdrop } from '@/components/auth/AuthBackdrop'
import { AuthVisual } from '@/components/auth/AuthVisual'
import { LoginForm } from '@/components/auth/LoginForm'
import { Logo } from '@/components/ui/Logo'
import { Link } from '@/lib/router'
import { easeOutExpo } from '@/animations/motion'

/**
 * Sign-in view. Same "Ink & Cobalt" system as the landing page — canvas
 * wash, ambient light pools, hairline grid — held at lower intensity so the
 * form owns the user's attention.
 */
export function LoginPage() {
  const prefersReduced = useReducedMotion()

  // One shared entrance rhythm: brand → heading → copy → form → proof.
  const rise = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: easeOutExpo },
        }

  useEffect(() => {
    const previous = document.title
    document.title = 'Sign in · ResumeX AI'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <AuthBackdrop />

      <a href="#auth-form" className="sr-focusable inline-flex min-h-11 items-center rounded-full bg-cobalt-600 px-4 text-sm font-semibold text-white shadow-lg">
        Skip to sign-in form
      </a>

      <header className="relative shell flex h-16 shrink-0 items-center lg:h-[4.5rem]">
        <motion.div {...rise(0)}>
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
          <div className="mx-auto grid w-full max-w-[56rem] items-center gap-16 py-10 sm:py-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,20rem)] lg:gap-20 xl:gap-24">
            {/* Form column */}
            <section aria-labelledby="login-heading">
              <motion.h1
                id="login-heading"
                className="text-[clamp(1.875rem,1.4rem+1.9vw,2.5rem)] leading-[1.08]"
                {...rise(0.07)}
              >
                Welcome back
              </motion.h1>

              <motion.p
                className="mt-3 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-500"
                {...rise(0.13)}
              >
                Sign in to continue building better resumes with AI.
              </motion.p>

              <motion.div
                id="auth-form"
                tabIndex={-1}
                className="mt-7 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink-900/8 outline-none sm:p-8"
                {...rise(0.19)}
              >
                <LoginForm />

                <p className="mt-6 border-t border-ink-900/8 pt-5 text-center text-sm text-ink-500">
                  Don&rsquo;t have an account?{' '}
                  <Link
                    href="/register"
                    className="rounded font-semibold text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
                  >
                    Create an account
                  </Link>
                </p>
              </motion.div>

              <motion.p
                className="mx-auto mt-4 max-w-[44ch] text-center text-xs leading-relaxed text-ink-500"
                {...rise(0.25)}
              >
                Preview build — any email with an 8+ character password signs
                in. Use the password &ldquo;wrong&rdquo; to see the error state.
              </motion.p>

              <motion.div className="mt-6 text-center" {...rise(0.28)}>
                <Link
                  href="/"
                  className="-mx-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-500 transition-colors duration-200 hover:text-ink-900"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to ResumeX AI
                </Link>
              </motion.div>
            </section>

            {/* Product proof column — desktop only */}
            <AuthVisual className="hidden lg:block" />
          </div>
        </div>
      </main>
    </div>
  )
}
