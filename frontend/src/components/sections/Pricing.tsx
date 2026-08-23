import { motion } from 'framer-motion'
import { Check, Sparkles, Tag } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { inViewOnce, riseIn, stagger } from '@/animations/motion'
import { plans } from '@/data/pricing'
import type { Plan } from '@/data/pricing'
import { cx } from '@/lib/cx'

function PlanCard({ plan }: { plan: Plan }) {
  const { featured } = plan

  return (
    <motion.li variants={riseIn} className="relative">
      {/* Slow conic sweep on the featured plan only — one accent, very low contrast */}
      {featured ? (
        <span
          className="absolute -inset-px rounded-[1.05rem] bg-[conic-gradient(from_var(--angle),transparent_0%,var(--color-cobalt-400)_12%,transparent_28%,transparent_100%)] opacity-45 motion-safe:animate-border-spin"
          aria-hidden="true"
        />
      ) : null}

      <article
        className={cx(
          'relative flex h-full flex-col gap-6 rounded-2xl p-7 sm:p-8',
          featured
            ? 'border border-cobalt-500/25 bg-white shadow-lg'
            : 'border border-ink-900/8 bg-white/70 shadow-xs',
        )}
      >
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-ink-900">{plan.name}</h3>
            {plan.badge ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-cobalt-600 px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.1em] text-white uppercase">
                <Sparkles className="size-3" strokeWidth={2.4} aria-hidden="true" />
                {plan.badge}
              </span>
            ) : null}
          </div>

          <p className="flex items-baseline gap-1">
            <span className="font-display text-[2.75rem] leading-none font-bold tracking-[-0.03em] text-ink-900 tabular-nums">
              {plan.price}
            </span>
            {plan.cadence ? (
              <span className="text-[0.9375rem] font-medium text-ink-500">
                {plan.cadence}
              </span>
            ) : null}
          </p>

          <p className="text-[0.9375rem] leading-[1.6] text-ink-500">{plan.tagline}</p>
        </header>

        <hr className="border-ink-900/8" />

        <ul className="flex flex-col gap-3">
          {plan.includes.map((item, index) => (
            <li key={item} className="flex items-start gap-2.5">
              <span
                className={cx(
                  'mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full',
                  featured
                    ? 'bg-signal-100 text-signal-700'
                    : 'bg-ink-100 text-ink-500',
                )}
                aria-hidden="true"
              >
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span
                className={cx(
                  'text-[0.9375rem] leading-[1.5]',
                  index === 0 && plan.includes[0].startsWith('Everything in')
                    ? 'font-semibold text-ink-800'
                    : 'text-ink-700',
                )}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2">
          <Button
            href="/login"
            variant={featured ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
          >
            {plan.cta}
          </Button>
        </div>
      </article>
    </motion.li>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Pricing"
          eyebrowIcon={<Tag className="size-3.5" />}
          title="Start free. Upgrade when you are actively applying."
          description="Build and export a complete resume at no cost. Pro adds the AI review, job matching and version history you want during a live job hunt."
        />

        <motion.ul
          className="mx-auto mt-14 grid max-w-4xl gap-5 lg:mt-16 md:grid-cols-2"
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </motion.ul>

        <p className="mx-auto mt-8 max-w-xl text-center text-[0.75rem] leading-[1.6] text-ink-500">
          Prices are shown for demonstration in this preview build. Billing is not
          available yet.
        </p>
      </div>
    </section>
  )
}
