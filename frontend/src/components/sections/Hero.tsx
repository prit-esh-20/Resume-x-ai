import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, CheckCircle2, FileDown, ShieldCheck, Sparkles } from 'lucide-react'
import { AmbientBackdrop } from '@/components/ui/AmbientBackdrop'
import { HeroProductMockup } from '@/components/HeroProductMockup'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { easeOutExpo } from '@/animations/motion'

const assurances = [
  { icon: CheckCircle2, label: 'Free to start — no card required' },
  { icon: ShieldCheck, label: 'ATS-safe, single-column templates' },
  { icon: FileDown, label: 'Export to PDF or DOCX' },
]

export function Hero() {
  const prefersReduced = useReducedMotion()

  // One shared entrance sequence for the copy block — not per-word animation.
  const rise = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: easeOutExpo },
        }

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24">
      <AmbientBackdrop variant="hero" />

      <div className="shell relative">
        <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
          <motion.div {...rise(0)}>
            <Eyebrow icon={<Sparkles className="size-3.5" />}>
              Resume intelligence, not templates
            </Eyebrow>
          </motion.div>

          <motion.h1
            className="mt-6 text-[clamp(2.25rem,1.3rem+4.2vw,4.25rem)] leading-[1.03]"
            {...rise(0.07)}
          >
            Write a resume that gets{' '}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-linear-to-r from-cobalt-600 via-cobalt-500 to-aurora bg-clip-text text-transparent">
                past the filter
              </span>
              <svg
                className="absolute -bottom-1 left-0 h-[0.42em] w-full text-cobalt-300"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9.2C38 4.1 96 2.4 198 5.6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            and gets read.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-ink-500 sm:text-lg"
            {...rise(0.14)}
          >
            ResumeX AI scores your resume the way applicant tracking systems parse it,
            shows the keywords you are missing for a specific role, and helps you rewrite
            the lines that hold you back.
          </motion.p>

          <motion.div
            className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
            {...rise(0.21)}
          >
            <Button href="#pricing" size="lg" className="w-full sm:w-auto">
              Build My Resume Free
              <ArrowRight
                className="size-[1.15rem] transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
            <Button
              href="#ats-breakdown"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              See how scoring works
            </Button>
          </motion.div>

          <motion.ul
            className="mt-8 flex flex-col items-center gap-x-7 gap-y-2.5 text-[0.8125rem] font-medium text-ink-500 sm:flex-row sm:flex-wrap sm:justify-center"
            {...rise(0.28)}
          >
            {assurances.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-signal-600" aria-hidden="true" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroProductMockup className="mx-auto mt-14 max-w-[68rem] sm:mt-16 lg:mt-20" />
      </div>
    </section>
  )
}
