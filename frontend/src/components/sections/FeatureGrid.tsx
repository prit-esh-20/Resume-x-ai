import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { inViewOnce, riseIn, stagger } from '@/animations/motion'
import { features } from '@/data/features'
import type { Feature } from '@/data/features'

function FeatureCard({ feature }: { feature: Feature }) {
  const { icon: Icon, title, description, meta } = feature

  return (
    <motion.li variants={riseIn} className="group relative">
      <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-ink-900/8 bg-white p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] group-hover:-translate-y-1 group-hover:border-cobalt-500/22 group-hover:shadow-md sm:p-7">
        {/* Very soft top-corner light that only shows on hover */}
        <span
          className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-cobalt-500/8 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-b from-cobalt-50 to-white text-cobalt-600 ring-1 ring-cobalt-500/16 transition-colors duration-300 group-hover:from-cobalt-100 group-hover:text-cobalt-700"
            aria-hidden="true"
          >
            <Icon className="size-5" strokeWidth={1.9} />
          </span>
          <span className="rounded-full bg-ink-50 px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.04em] text-ink-500 ring-1 ring-ink-900/6">
            {meta}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-display text-[1.0625rem] font-bold text-ink-900">{title}</h3>
          <p className="text-[0.9375rem] leading-[1.6] text-ink-500">{description}</p>
        </div>
      </div>
    </motion.li>
  )
}

export function FeatureGrid() {
  return (
    <section id="features" className="relative py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Features"
          eyebrowIcon={<LayoutGrid className="size-3.5" />}
          title="Everything you need between a blank page and a submitted application."
          description="Six focused tools that work on the same resume, so every improvement carries through to the version you actually send."
        />

        <motion.ul
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
