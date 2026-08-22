import { motion, useReducedMotion } from 'framer-motion'
import type { ResumeContent } from '@/data/resume'
import { cx } from '@/lib/cx'

type ResumeDocumentProps = {
  content: ResumeContent
  className?: string
  /**
   * Renders an AI-suggested rewrite marker over one experience bullet, the way
   * the editor would while a suggestion is pending.
   */
  showSuggestion?: boolean
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-[0.7em] flex items-center gap-[0.7em]">
      <h4 className="font-sans text-[0.86em] leading-none font-bold tracking-[0.15em] text-ink-800 uppercase">
        {children}
      </h4>
      <span className="h-px flex-1 bg-ink-200" />
    </div>
  )
}

/**
 * A realistic, fully populated resume page. Every size inside is expressed in
 * `em` off a `cqw`-based root, so the whole document rescales with the width of
 * its container query root and keeps identical proportions at every breakpoint.
 */
export function ResumeDocument({
  content,
  className,
  showSuggestion = false,
}: ResumeDocumentProps) {
  const prefersReduced = useReducedMotion()
  const experience = content.experience[0]

  return (
    <article
      className={cx(
        'flex h-full flex-col overflow-hidden rounded-[3px] bg-white text-[clamp(6.8px,2.62cqw,10px)] leading-normal',
        'px-[2.5em] py-[2.3em] text-ink-600',
        className,
      )}
    >
      {/* Header */}
      <header className="shrink-0">
        <h3 className="font-display text-[2.15em] leading-[1.05] font-bold tracking-[-0.025em] text-ink-900">
          {content.name}
        </h3>
        <p className="mt-[0.35em] text-[1.08em] font-semibold tracking-[0.01em] text-cobalt-700">
          {content.title}
        </p>
        <p className="mt-[0.55em] flex flex-wrap items-center gap-x-[0.6em] gap-y-[0.2em] text-[0.92em] text-ink-500">
          <span>{content.location}</span>
          <span className="text-ink-300">·</span>
          <span>{content.email}</span>
          <span className="text-ink-300">·</span>
          <span>{content.phone}</span>
        </p>
      </header>

      <div className="my-[1.5em] h-px shrink-0 bg-ink-200" />

      <div className="flex min-h-0 flex-1 flex-col gap-[1.45em]">
        {/* Summary */}
        <section>
          <SectionLabel>Professional Summary</SectionLabel>
          <p className="text-[0.98em] leading-[1.5]">{content.summary}</p>
        </section>

        {/* Experience */}
        {experience ? (
          <section>
            <SectionLabel>Experience</SectionLabel>
            <div className="flex items-baseline justify-between gap-[1em]">
              <p className="text-[1.02em] font-semibold text-ink-900">
                {experience.role}
                <span className="font-normal text-ink-400"> — </span>
                <span className="font-medium text-cobalt-700">{experience.org}</span>
              </p>
              <p className="shrink-0 text-[0.86em] tracking-[0.01em] text-ink-400 tabular-nums">
                {experience.period}
              </p>
            </div>
            <ul className="mt-[0.5em] space-y-[0.32em]">
              {experience.bullets.map((bullet, index) => {
                const marked = showSuggestion && index === 1
                return (
                  <li
                    key={bullet}
                    className="relative flex gap-[0.6em] text-[0.95em] leading-[1.45]"
                  >
                    <span className="mt-[0.55em] size-[0.28em] shrink-0 rounded-full bg-ink-300" />
                    {marked ? (
                      <motion.span
                        className="rounded-[2px] bg-cobalt-100 px-[0.3em] ring-1 ring-cobalt-300/70"
                        initial={prefersReduced ? undefined : { opacity: 0.35 }}
                        animate={prefersReduced ? undefined : { opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                      >
                        {bullet}
                      </motion.span>
                    ) : (
                      <span>{bullet}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        {/* Projects */}
        <section>
          <SectionLabel>Projects</SectionLabel>
          {content.projects.map((project) => (
            <div key={project.name}>
              <p className="text-[1.02em] font-semibold text-ink-900">{project.name}</p>
              <p className="mt-[0.15em] text-[0.95em] leading-[1.45]">{project.detail}</p>
              {project.stack ? (
                <p className="mt-[0.18em] text-[0.88em] font-medium text-ink-400">
                  {project.stack}
                </p>
              ) : null}
            </div>
          ))}
        </section>

        {/* Education */}
        <section>
          <SectionLabel>Education</SectionLabel>
          {content.education.map((entry) => (
            <div
              key={entry.degree}
              className="flex items-baseline justify-between gap-[1em]"
            >
              <p className="text-[0.98em]">
                <span className="font-semibold text-ink-900">{entry.degree}</span>
                <br />
                <span>{entry.org}</span>
                {entry.detail ? (
                  <span className="text-ink-400"> · {entry.detail}</span>
                ) : null}
              </p>
              {entry.period ? (
                <p className="shrink-0 text-[0.86em] text-ink-400 tabular-nums">
                  {entry.period}
                </p>
              ) : null}
            </div>
          ))}
        </section>

        {/* Skills — plain delimited text keeps the export parseable */}
        <section>
          <SectionLabel>Skills</SectionLabel>
          <p className="text-[0.96em] leading-[1.6] text-ink-700">
            {content.skills.map((skill, index) => (
              <span key={skill}>
                {index > 0 ? <span className="text-ink-300">{'  ·  '}</span> : null}
                {skill}
              </span>
            ))}
          </p>
        </section>
      </div>
    </article>
  )
}
