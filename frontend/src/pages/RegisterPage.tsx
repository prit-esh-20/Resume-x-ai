import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { AuthShell } from '@/components/auth/AuthShell'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { SignupAside } from '@/components/auth/SignupAside'
import { Link } from '@/lib/router'
import { easeOutExpo } from '@/animations/motion'

/**
 * Sign-up view. Sits beside /login on the shared AuthShell scaffold — same
 * ambience, same card language, with a motivation column instead of the
 * product mockup.
 */
export function RegisterPage() {
  const prefersReduced = useReducedMotion()

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
    document.title = 'Create your account · ResumeX AI'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <AuthShell
      labelledBy="register-heading"
      skipLabel="Skip to sign-up form"
      aside={<SignupAside className="hidden lg:block" />}
    >
      <motion.h1
        id="register-heading"
        className="text-[clamp(1.875rem,1.4rem+1.9vw,2.5rem)] leading-[1.08]"
        {...rise(0.07)}
      >
        Create your account
      </motion.h1>

      <motion.p
        className="mt-3 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-500"
        {...rise(0.13)}
      >
        Start building ATS-ready resumes in minutes. Free to start — no credit
        card required.
      </motion.p>

      <motion.div
        id="auth-form"
        tabIndex={-1}
        className="mt-7 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink-900/8 outline-none sm:p-8"
        {...rise(0.19)}
      >
        <RegisterForm />

        <p className="mt-6 border-t border-ink-900/8 pt-5 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="rounded font-semibold text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
          >
            Sign in
          </Link>
        </p>
      </motion.div>

      <motion.p
        className="mx-auto mt-4 max-w-[44ch] text-center text-xs leading-relaxed text-ink-500"
        {...rise(0.25)}
      >
        Preview build — any details with an 8+ character password create a demo
        account. Use the password &ldquo;wrong&rdquo; to see the error state.
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
    </AuthShell>
  )
}
