import { motion } from 'framer-motion'
import { MessageSquareQuote, Quote } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { inViewOnce, riseIn, stagger } from '@/animations/motion'
import { testimonials } from '@/data/testimonials'

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-ink-50/60"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-ink-900/7" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink-900/7" />
      </div>

      <div className="shell">
        <SectionHeading
          eyebrow="Feedback"
          eyebrowIcon={<MessageSquareQuote className="size-3.5" />}
          title="What people say they get out of it."
          description="Illustrative feedback written for this preview build. These are not verified customer reviews, and no company logos or usage statistics are implied."
        />

        <motion.ul
          className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-16 lg:gap-5"
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {testimonials.map((testimonial) => (
            <motion.li key={testimonial.name} variants={riseIn}>
              <figure className="flex h-full flex-col gap-5 rounded-2xl border border-ink-900/8 bg-white p-6 shadow-xs sm:p-7">
                <Quote
                  className="size-6 shrink-0 text-cobalt-500/45"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <blockquote className="flex-1 text-[0.9375rem] leading-[1.65] text-ink-700">
                  {testimonial.quote}
                </blockquote>

                <figcaption className="flex items-center gap-3 border-t border-ink-900/7 pt-5">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-cobalt-100 to-cobalt-50 font-display text-[0.8125rem] font-bold text-cobalt-700 ring-1 ring-cobalt-500/16"
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[0.9375rem] font-bold text-ink-900">
                      {testimonial.name}
                    </span>
                    <span className="block truncate text-[0.8125rem] text-ink-500">
                      {testimonial.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
