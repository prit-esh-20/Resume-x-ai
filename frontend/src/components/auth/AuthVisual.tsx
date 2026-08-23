import { motion } from 'framer-motion'
import { MapPin, Sparkles } from 'lucide-react'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { heroResume } from '@/data/resume'
import { cx } from '@/lib/cx'

type AuthVisualProps = {
  className?: string
}

const initials = heroResume.name
  .split(' ')
  .map((part) => part[0])
  .join('')

/**
 * Quiet product proof for the desktop auth layout: a miniature of the resume
 * a signed-in user would keep working on, plus the ATS metrics that define
 * the product. Deliberately smaller than the form column and hidden below
 * `lg` — authentication stays the primary purpose of the page.
 *
 * Exposed to assistive tech as one described image; everything inside is
 * presentational.
 */
export function AuthVisual({ className }: AuthVisualProps) {
  return (
    <motion.figure
      className={cx('relative mx-auto w-full max-w-[21rem]', className)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      role="img"
      aria-label={`Preview of an AI-optimized resume for ${heroResume.name}, ${heroResume.title} from ${heroResume.location} — ATS score 92 out of 100, keyword match 94 percent.`}
    >
      {/* AI Optimized — floating badge */}
      <div className="absolute -top-4 -left-3 z-10 sm:-left-5">
        <Eyebrow icon={<Sparkles className="size-3.5" />}>AI Optimized</Eyebrow>
      </div>

      {/* Miniature resume card */}
      <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-900/8">
        <header className="flex items-center gap-3.5">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-[0.75rem] bg-linear-to-br from-cobalt-500 to-cobalt-700 font-display text-sm font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_2px_6px_-1px_var(--color-cobalt-700)]"
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[0.9375rem] font-bold tracking-[-0.02em] text-ink-900">
              {heroResume.name}
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-cobalt-700">
              {heroResume.title}
            </p>
          </div>
        </header>

        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-ink-500">
          <MapPin className="size-3.5 text-ink-400" aria-hidden="true" />
          {heroResume.location}
        </p>

        {/* Document body — abstracted lines, no readable filler text */}
        <div className="mt-4 space-y-4 border-t border-ink-900/8 pt-4" aria-hidden="true">
          <div className="space-y-2">
            <span className="block h-1.5 w-14 rounded-full bg-ink-200" />
            <span className="block h-2 w-full rounded-full bg-ink-100" />
            <span className="block h-2 w-[82%] rounded-full bg-ink-100" />
          </div>
          <div className="space-y-2">
            <span className="block h-1.5 w-20 rounded-full bg-ink-200" />
            <span className="block h-2 w-full rounded-full bg-ink-100" />
            <span className="block h-2 w-[64%] rounded-full bg-ink-100" />
          </div>
          <div className="flex gap-2 pt-0.5">
            <span className="h-5 w-14 rounded-md bg-cobalt-50 ring-1 ring-cobalt-100" />
            <span className="h-5 w-16 rounded-md bg-cobalt-50 ring-1 ring-cobalt-100" />
            <span className="h-5 w-12 rounded-md bg-cobalt-50 ring-1 ring-cobalt-100" />
          </div>
        </div>
      </div>

      {/* Score card — overlaps the resume card's lower edge */}
      <motion.div
        className="absolute -bottom-10 -right-3 z-10 flex items-center gap-4 rounded-2xl bg-white/95 p-4 pr-5 shadow-lg ring-1 ring-ink-900/8 backdrop-blur-sm sm:-right-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <ScoreRing
          value={92}
          size={84}
          strokeWidth={8}
          numberClassName="text-xl"
          caption="ATS"
          label="ATS score 92 out of 100"
          immediate
        />

        <div className="w-px self-stretch bg-ink-900/8" aria-hidden="true" />

        <div className="min-w-[6.5rem]">
          <p className="text-[0.6875rem] font-semibold tracking-[0.08em] text-ink-500 uppercase">
            Keyword match
          </p>
          <p className="mt-1 flex items-baseline gap-0.5">
            <AnimatedNumber value={94} immediate className="font-display text-xl font-bold tracking-[-0.02em] text-ink-900" />
            <span className="text-sm font-bold text-signal-600" aria-hidden="true">
              %
            </span>
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
            <motion.div
              className="h-full w-full origin-left rounded-full bg-signal-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 0.94 }}
              transition={{ duration: 1.2, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </motion.div>
    </motion.figure>
  )
}
