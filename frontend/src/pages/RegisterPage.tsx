import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { AuthBackdrop } from '@/components/auth/AuthBackdrop'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Logo } from '@/components/ui/Logo'
import { Link } from '@/lib/router'
import { useRouter } from '@/lib/useRouter'
import { easeOutExpo } from '@/animations/motion'

/**
 * Intentional holding view for /register until the full sign-up flow ships.
 * Keeps the "Create an account" action on a real destination instead of
 * bouncing users back to the landing page.
 */
export function RegisterPage() {
  const { navigate } = useRouter()
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
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      <AuthBackdrop />

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

      <main className="relative flex flex-1 items-center justify-center">
        <div className="shell w-full py-14 text-center">
          <motion.div className="flex justify-center" {...rise(0.07)}>
            <Eyebrow icon={<Sparkles className="size-3.5" />}>Coming soon</Eyebrow>
          </motion.div>

          <motion.h1
            className="mx-auto mt-5 max-w-[24ch] text-[clamp(1.875rem,1.4rem+1.9vw,2.5rem)] leading-[1.08]"
            {...rise(0.13)}
          >
            Create your account
          </motion.h1>

          <motion.p
            className="mx-auto mt-3 max-w-[44ch] text-[1.0625rem] leading-relaxed text-ink-500"
            {...rise(0.19)}
          >
            Registration isn&rsquo;t open in this preview yet. Sign in with the
            demo credentials, or head back and explore the product first.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            {...rise(0.25)}
          >
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
              Back to sign in
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/')}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to homepage
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
