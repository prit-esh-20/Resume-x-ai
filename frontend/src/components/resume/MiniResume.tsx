import type { ReactNode } from 'react'
import type { Template, TemplateLayout } from '@/data/templates'
import { cx } from '@/lib/cx'

type MiniResumeProps = {
  template: Template
  className?: string
}

type SectionKey = 'summary' | 'experience' | 'projects' | 'education' | 'skills'

type LayoutSpec = {
  paper: string
  header: (t: Template) => ReactNode
  label: (text: string) => ReactNode
  order: SectionKey[]
}

const LABELS: Record<SectionKey, string> = {
  summary: 'Summary',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  skills: 'Skills',
}

/* ---------------------------------------------------------------- helpers */

function ContactLine({ template, className }: { template: Template; className?: string }) {
  const { location, email, phone } = template.content
  return (
    <p className={cx('flex flex-wrap gap-x-[0.5em] text-[0.92em] text-ink-500', className)}>
      <span>{location}</span>
      <span className="text-ink-300">·</span>
      <span>{email}</span>
      <span className="text-ink-300">·</span>
      <span>{phone}</span>
    </p>
  )
}

function RuledLabel({ text, serif }: { text: string; serif?: boolean }) {
  return (
    <div className="mb-[0.45em]">
      <p
        className={cx(
          'text-[0.95em] leading-none font-bold tracking-[0.14em] text-ink-800 uppercase',
          serif && 'font-serif',
        )}
      >
        {text}
      </p>
      <span className="mt-[0.3em] block h-px w-full bg-ink-200" />
    </div>
  )
}

/* ---------------------------------------------------------- layout specs */

const LAYOUTS: Record<TemplateLayout, LayoutSpec> = {
  classic: {
    paper: 'font-serif',
    order: ['summary', 'experience', 'projects', 'education', 'skills'],
    header: (t) => (
      <header className="border-b border-ink-300 pb-[0.85em] text-center">
        <p className="font-serif text-[2.5em] leading-[1.05] font-semibold tracking-[-0.01em] text-ink-900">
          {t.content.name}
        </p>
        <p className="mt-[0.15em] text-[1.15em] font-medium tracking-[0.06em] text-ink-700 uppercase">
          {t.content.title}
        </p>
        <ContactLine template={t} className="mt-[0.4em] justify-center" />
      </header>
    ),
    label: (text) => <RuledLabel text={text} serif />,
  },

  modern: {
    paper: 'font-sans',
    order: ['summary', 'experience', 'projects', 'education', 'skills'],
    header: (t) => (
      <header className="flex gap-[0.9em]">
        <span className="mt-[0.25em] w-[0.3em] shrink-0 self-stretch rounded-full bg-cobalt-500" />
        <div>
          <p className="font-display text-[2.35em] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink-900">
            {t.content.name}
          </p>
          <p className="mt-[0.1em] text-[1.2em] font-semibold text-cobalt-700">
            {t.content.title}
          </p>
          <ContactLine template={t} className="mt-[0.4em]" />
        </div>
      </header>
    ),
    label: (text) => (
      <div className="mb-[0.45em] flex items-center gap-[0.5em]">
        <span className="size-[0.4em] rounded-[1px] bg-cobalt-500" />
        <p className="text-[0.92em] leading-none font-bold tracking-[0.16em] text-ink-800 uppercase">
          {text}
        </p>
      </div>
    ),
  },

  minimal: {
    paper: 'font-sans',
    order: ['summary', 'experience', 'projects', 'education', 'skills'],
    header: (t) => (
      <header>
        <p className="font-display text-[2.3em] leading-[1.05] font-medium tracking-[-0.02em] text-ink-900">
          {t.content.name}
        </p>
        <p className="mt-[0.2em] text-[1.12em] font-normal tracking-[0.02em] text-ink-500">
          {t.content.title}
        </p>
        <ContactLine template={t} className="mt-[0.45em]" />
      </header>
    ),
    label: (text) => (
      <p className="mb-[0.4em] text-[0.88em] leading-none font-semibold tracking-[0.22em] text-ink-400 uppercase">
        {text}
      </p>
    ),
  },

  corporate: {
    paper: 'font-sans',
    order: ['summary', 'experience', 'projects', 'education', 'skills'],
    header: (t) => (
      <header className="-mx-[2.2em] -mt-[2em] mb-[0.4em] border-b border-ink-200 bg-ink-50 px-[2.2em] pt-[2em] pb-[1em]">
        <p className="font-display text-[2.3em] leading-[1.05] font-bold tracking-[-0.025em] text-ink-900">
          {t.content.name}
        </p>
        <p className="mt-[0.1em] text-[1.15em] font-semibold tracking-[0.04em] text-ink-700 uppercase">
          {t.content.title}
        </p>
        <div className="mt-[0.45em] space-y-[0.1em] text-[0.92em] text-ink-500">
          <p>{t.content.location}</p>
          <p>
            {t.content.email} <span className="text-ink-300">·</span> {t.content.phone}
          </p>
        </div>
      </header>
    ),
    label: (text) => (
      <div className="mb-[0.45em]">
        <p className="text-[0.92em] leading-none font-bold tracking-[0.14em] text-ink-800 uppercase">
          {text}
        </p>
        <span className="mt-[0.3em] block h-[0.16em] w-[2.6em] bg-ink-800" />
      </div>
    ),
  },

  executive: {
    paper: 'font-serif',
    order: ['summary', 'experience', 'projects', 'education', 'skills'],
    header: (t) => (
      <header className="pb-[0.8em]">
        <p className="font-serif text-[2.6em] leading-[1.02] font-semibold tracking-[0.02em] text-ink-900">
          {t.content.name}
        </p>
        <p className="mt-[0.2em] text-[1.05em] font-medium tracking-[0.2em] text-ink-600 uppercase">
          {t.content.title}
        </p>
        <div className="mt-[0.7em] space-y-[0.14em]">
          <span className="block h-px w-full bg-ink-800" />
          <span className="block h-px w-full bg-ink-300" />
        </div>
        <ContactLine template={t} className="mt-[0.55em]" />
      </header>
    ),
    label: (text) => (
      <p className="mb-[0.45em] font-serif text-[0.98em] leading-none font-semibold tracking-[0.24em] text-ink-800 uppercase">
        {text}
      </p>
    ),
  },

  student: {
    paper: 'font-sans',
    // Education leads for freshers and internship applicants.
    order: ['summary', 'education', 'projects', 'experience', 'skills'],
    header: (t) => (
      <header className="border-b-[0.16em] border-cobalt-500 pb-[0.7em]">
        <p className="font-display text-[2.3em] leading-[1.05] font-bold tracking-[-0.025em] text-ink-900">
          {t.content.name}
        </p>
        <p className="mt-[0.12em] text-[1.12em] font-semibold text-ink-700">
          {t.content.title}
        </p>
        <ContactLine template={t} className="mt-[0.4em]" />
      </header>
    ),
    label: (text) => (
      <p className="mb-[0.4em] text-[0.9em] leading-none font-bold tracking-[0.16em] text-cobalt-700 uppercase">
        {text}
      </p>
    ),
  },
}

/* ------------------------------------------------------------- component */

/**
 * Compact miniature of a real resume, used for the template gallery.
 *
 * The base font-size is expressed in `cqw`, so the whole document scales with
 * the width of its container query root — the thumbnail stays correctly
 * proportioned from a 3-up desktop grid down to a full-width phone card.
 *
 * Presented to assistive tech as a single image with a descriptive name, since
 * navigating a document thumbnail line by line has no value.
 */
export function MiniResume({ template, className }: MiniResumeProps) {
  const layout = LAYOUTS[template.id]
  const { content } = template
  const education = content.education[0]

  const sections: Record<SectionKey, ReactNode> = {
    summary: <p className="text-[1em] leading-[1.5] text-ink-600">{content.summary}</p>,

    experience: content.experience.length ? (
      <div className="space-y-[0.6em]">
        {content.experience.map((entry) => (
          <div key={`${entry.role}-${entry.period}`}>
            <div className="flex items-baseline justify-between gap-[0.8em]">
              <p className="text-[1.05em] font-semibold text-ink-900">{entry.role}</p>
              <p className="shrink-0 text-[0.88em] text-ink-400 tabular-nums">
                {entry.period}
              </p>
            </div>
            <p className="text-[0.98em] font-medium text-ink-500">{entry.org}</p>
            <ul className="mt-[0.25em] space-y-[0.18em]">
              {entry.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-[0.45em] text-[0.96em] leading-[1.45]">
                  <span className="mt-[0.55em] size-[0.26em] shrink-0 rounded-full bg-ink-300" />
                  <span className="text-ink-600">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ) : null,

    projects: content.projects.length ? (
      <div className="space-y-[0.45em]">
        {content.projects.map((project) => (
          <div key={project.name}>
            <p className="text-[1.05em] font-semibold text-ink-900">{project.name}</p>
            <p className="text-[0.96em] leading-[1.45] text-ink-600">{project.detail}</p>
          </div>
        ))}
      </div>
    ) : null,

    education: education ? (
      <div>
        <div className="flex items-baseline justify-between gap-[0.8em]">
          <p className="text-[1.05em] font-semibold text-ink-900">{education.degree}</p>
          {education.period ? (
            <p className="shrink-0 text-[0.88em] text-ink-400 tabular-nums">
              {education.period}
            </p>
          ) : null}
        </div>
        <p className="text-[0.96em] text-ink-600">
          {education.org}
          {education.detail ? (
            <span className="text-ink-400"> · {education.detail}</span>
          ) : null}
        </p>
      </div>
    ) : null,

    skills: (
      <p className="text-[0.98em] leading-[1.55] text-ink-700">
        {content.skills.map((skill, index) => (
          <span key={skill}>
            {index > 0 ? <span className="text-ink-300">{'  ·  '}</span> : null}
            {skill}
          </span>
        ))}
      </p>
    ),
  }

  return (
    <div
      className={cx(
        'flex h-full flex-col overflow-hidden bg-white px-[2.2em] py-[2em] text-[2.32cqw] text-ink-600',
        layout.paper,
        className,
      )}
      role="img"
      aria-label={`${template.name} template preview — resume for ${content.name}, ${content.title}, ${content.location}.`}
    >
      {layout.header(template)}

      <div className="mt-[1em] flex min-h-0 flex-1 flex-col gap-[0.9em]">
        {layout.order.map((key) =>
          sections[key] ? (
            <section key={key}>
              {layout.label(LABELS[key])}
              {sections[key]}
            </section>
          ) : null,
        )}
      </div>
    </div>
  )
}
