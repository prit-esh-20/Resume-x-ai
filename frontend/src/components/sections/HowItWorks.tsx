import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Route } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { inViewOnce, riseIn, stagger } from '@/animations/motion'
import { steps } from '@/data/steps'

export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 62%'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  })

  const fill = prefersReduced ? 1 : progress

  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 lg:py-28">
      {/* Section surface — a shade cooler than the page so it reads as a band */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-ink-50/60" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-ink-900/7" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink-900/7" />
      </div>

      <div className="shell">
        <SectionHeading
          eyebrow="How It Works"
          eyebrowIcon={<Route className="size-3.5" />}
          title="Five steps from first draft to a resume you are ready to send."
        />

        <div ref={trackRef} className="relative mt-14 lg:mt-20">
          {/* Desktop rail */}
          <div
            className="pointer-events-none absolute top-7 right-0 left-0 hidden h-px lg:block"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-ink-900/10" />
            <motion.div
              className="absolute inset-y-0 left-0 w-full origin-left bg-linear-to-r from-cobalt-500 to-signal-500"
              style={{ scaleX: fill }}
            />
          </div>

          {/* Mobile / tablet rail */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-[1.4375rem] w-px lg:hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-ink-900/10" />
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-linear-to-b from-cobalt-500 to-signal-500"
              style={{ scaleY: fill }}
            />
          </div>

          <motion.ol
            className="relative grid gap-8 lg:grid-cols-5 lg:gap-6"
            variants={stagger(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
          >
            {steps.map(({ index, title, description, icon: Icon }) => (
              <motion.li
                key={index}
                variants={riseIn}
                className="flex gap-5 lg:flex-col lg:gap-0"
              >
                <span
                  className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-ink-900/8 bg-white text-cobalt-600 shadow-sm"
                  aria-hidden="true"
                >
                  <Icon className="size-[1.15rem]" strokeWidth={1.9} />
                </span>

                <div className="lg:mt-5">
                  <p className="font-display text-[0.6875rem] font-bold tracking-[0.16em] text-cobalt-600 tabular-nums">
                    STEP {index}
                  </p>
                  <h3 className="mt-1.5 font-display text-[1.0625rem] font-bold text-ink-900">
                    {title}
                  </h3>
                  <p className="mt-1.5 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink-500">
                    {description}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
