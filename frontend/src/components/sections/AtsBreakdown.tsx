import { motion, useReducedMotion } from 'framer-motion'
import { Check, Gauge } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { easeOutExpo } from '@/animations/motion'
import { atsFactors, atsScore, atsSignals } from '@/data/atsBreakdown'
import type { AtsFactor } from '@/data/atsBreakdown'

function FactorRow({ factor, index }: { factor: AtsFactor; index: number }) {
  const prefersReduced = useReducedMotion()

  return (
    <li className="py-3.5 first:pt-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-[0.9375rem] font-semibold text-ink-900">
          {factor.label}
        </h3>
        <p className="font-display text-sm font-bold text-ink-700">
          <AnimatedNumber
            value={factor.value}
            suffix="%"
            delay={0.1 + index * 0.08}
            duration={1.3}
          />
          <span className="sr-only">{factor.label}: {factor.value} percent</span>
        </p>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100"
        aria-hidden="true"
      >
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-cobalt-500 to-signal-500"
          initial={{ width: prefersReduced ? `${factor.value}%` : '0%' }}
          whileInView={{ width: `${factor.value}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: prefersReduced ? 0 : 1.3,
            delay: prefersReduced ? 0 : 0.1 + index * 0.08,
            ease: easeOutExpo,
          }}
        />
      </div>

      <p className="mt-2 text-[0.8125rem] leading-[1.55] text-ink-500">{factor.hint}</p>
    </li>
  )
}

export function AtsBreakdown() {
  return (
    <section id="ats-breakdown" className="relative isolate overflow-hidden py-20 lg:py-28">
      <AmbientSeam />

      <div className="shell relative">
        <SectionHeading
          eyebrow="ATS Breakdown"
          eyebrowIcon={<Gauge className="size-3.5" />}
          title="Most resumes are rejected before a person ever opens them."
          description="Applicant tracking systems read structure, headings and keywords — not design. ResumeX AI reports on the same signals, so you know exactly what to fix and why it matters."
        />

        <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-12">
          {/* Score card */}
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col items-center gap-6 rounded-3xl border border-ink-900/8 bg-white p-7 text-center shadow-sm sm:p-9">
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-400 uppercase">
                  Overall ATS Score
                </p>
                <p className="text-[0.8125rem] text-ink-500">
                  Sample analysis of one resume against one role
                </p>
              </div>

              <ScoreRing
                value={atsScore.value}
                max={atsScore.max}
                size={188}
                strokeWidth={12}
                caption={atsScore.verdict}
                label={`Sample overall ATS score: ${atsScore.value} out of ${atsScore.max} — ${atsScore.verdict}`}
              />

              <ul className="mt-auto grid w-full gap-2 text-left">
                {atsSignals.map((signal) => (
                  <li
                    key={signal}
                    className="flex items-center gap-2.5 rounded-xl bg-ink-50 px-3 py-2.5 text-[0.8125rem] font-medium text-ink-700"
                  >
                    <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-signal-100 text-signal-700">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Factor breakdown */}
          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="flex h-full flex-col rounded-3xl border border-ink-900/8 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-ink-900">
                  What the score is made of
                </h3>
                <span className="rounded-full bg-cobalt-50 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-cobalt-700 uppercase">
                  5 signals
                </span>
              </div>

              <ul className="mt-6 divide-y divide-ink-900/7">
                {atsFactors.map((factor, index) => (
                  <FactorRow key={factor.label} factor={factor} index={index} />
                ))}
              </ul>

              <p className="mt-7 border-t border-dashed border-ink-900/10 pt-5 text-[0.75rem] leading-[1.6] text-ink-400">
                Demonstration values shown to illustrate the report layout. They are not
                aggregated results and do not represent any real user.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Very quiet ambient wash so the section separates from the hero above it. */
function AmbientSeam() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-canvas" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(58% 44% at 22% 0%, color-mix(in oklab, var(--color-cobalt-500) 8%, transparent), transparent 72%)',
        }}
      />
    </div>
  )
}
