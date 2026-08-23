import { motion } from 'framer-motion'
import { CheckCircle2, FileDown, ShieldCheck, Star } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import { cx } from '@/lib/cx'

const assurances = [
  {
    icon: CheckCircle2,
    title: 'Free to start',
    detail: 'No credit card required to build your first resume.',
  },
  {
    icon: ShieldCheck,
    title: 'ATS-safe by default',
    detail: 'Single-column templates that parse cleanly.',
  },
  {
    icon: FileDown,
    title: 'Export anywhere',
    detail: 'Download as PDF or DOCX in one click.',
  },
]

const quote = testimonials[0]

type SignupAsideProps = {
  className?: string
}

/**
 * Motivation column for sign-up: what you get plus one voice of social
 * proof. Real readable content (unlike the login page's decorative mockup),
 * so it stays in the accessibility tree.
 */
export function SignupAside({ className }: SignupAsideProps) {
  return (
    <motion.aside
      className={cx('mx-auto w-full max-w-[21rem]', className)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <ul className="space-y-5">
        {assurances.map(({ icon: Icon, title, detail }, index) => (
          <motion.li
            key={title}
            className="flex items-start gap-3.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-signal-50 ring-1 ring-signal-200"
              aria-hidden="true"
            >
              <Icon className="size-[1.05rem] text-signal-600" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink-900">{title}</span>
              <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-500">
                {detail}
              </span>
            </span>
          </motion.li>
        ))}
      </ul>

      <motion.figure
        className="mt-8 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-ink-900/8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex gap-1" aria-hidden="true">
          {[...Array(5)].map((_, star) => (
            <Star key={star} className="size-4 fill-current text-signal-500" />
          ))}
        </div>
        <blockquote className="mt-3 text-sm leading-relaxed text-ink-700">
          &ldquo;{quote.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-2.5 border-t border-ink-900/8 pt-3.5">
          <span
            className="grid size-8 shrink-0 place-items-center rounded-full bg-cobalt-50 font-display text-[0.6875rem] font-bold text-cobalt-700 ring-1 ring-cobalt-100"
            aria-hidden="true"
          >
            {quote.initials}
          </span>
          <span className="text-xs leading-snug">
            <span className="block font-semibold text-ink-900">{quote.name}</span>
            <span className="block text-ink-500">{quote.role}</span>
          </span>
        </figcaption>
      </motion.figure>
    </motion.aside>
  )
}
