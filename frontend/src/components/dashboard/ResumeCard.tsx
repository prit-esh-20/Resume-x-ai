import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, Eye, MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { MiniResume } from '@/components/resume/MiniResume'
import type { DashboardResume } from '@/data/dashboard'
import { usePointerTilt } from '@/animations/usePointerTilt'
import { riseIn } from '@/animations/motion'
import { Link } from '@/lib/router'
import { cx } from '@/lib/cx'

/*
 * Secondary card actions defer to the future My Resumes workspace until their
 * own flows exist; Edit points at the upcoming builder route.
 */
const CARD_ACTIONS = [
  { key: 'edit', label: 'Edit', icon: Pencil, href: '/builder' },
  { key: 'preview', label: 'Preview', icon: Eye, href: '/resumes' },
  { key: 'duplicate', label: 'Duplicate', icon: Copy, href: '/resumes' },
  { key: 'download', label: 'Download', icon: Download, href: '/resumes' },
] as const

function ActionTooltip({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'pointer-events-none absolute top-full left-1/2 z-20 mt-1.5 -translate-x-1/2',
        'rounded-md bg-ink-800 px-2 py-1 text-[0.6875rem] font-medium whitespace-nowrap text-white',
        'opacity-0 shadow-md ring-1 ring-white/10 transition-opacity duration-150',
        'group-hover/tip:opacity-100 group-focus-within/tip:opacity-100',
      )}
    >
      {label}
    </span>
  )
}

function IconAction({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <span className="group/tip relative">
      <Link
        href={href}
        aria-label={label}
        className={cx(
          'grid size-8 place-items-center rounded-lg text-ink-400',
          'transition-[background-color,color,box-shadow] duration-200',
          'hover:bg-ink-900/5 hover:text-ink-800 focus-visible:bg-ink-900/5',
        )}
      >
        {children}
      </Link>
      <ActionTooltip label={label} />
    </span>
  )
}

/** Score chips carry the number itself — colour never works alone here. */
function AtsChip({ score }: { score: number }) {
  const strong = score >= 85
  return (
    <span
      className={cx(
        'pointer-events-none absolute top-[1.15rem] right-[1.15rem] z-10 inline-flex items-center gap-1',
        'rounded-full border px-2 py-0.5 text-[0.6875rem] font-bold tracking-[0.04em] tnum backdrop-blur-sm',
        strong
          ? 'border-signal-200 bg-signal-50/90 text-signal-700'
          : 'border-ink-900/10 bg-white/90 text-ink-600',
      )}
    >
      ATS {score}
    </span>
  )
}

export function ResumeCard({ resume }: { resume: DashboardResume }) {
  // Barely-there pointer tilt, fine pointers ≥1024px only.
  const tilt = usePointerTilt({ max: 2 })

  return (
    <motion.li variants={riseIn} className="group">
      <article
        className={cx(
          'flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-xs',
          'transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)]',
          'hover:-translate-y-1 hover:border-cobalt-500/25 hover:shadow-lg',
        )}
      >
        <div className="relative bg-ink-50/70 p-3 pb-0">
          <AtsChip score={resume.atsScore} />

          <motion.div
            onPointerMove={tilt.handlePointerMove}
            onPointerLeave={tilt.handlePointerLeave}
            style={{
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              transformPerspective: 1200,
            }}
            className="@container relative aspect-[1/1.26] overflow-hidden rounded-t-lg bg-white ring-1 ring-ink-900/8 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.01]"
          >
            <MiniResume
              template={resume.template}
              label={`Resume preview — ${resume.title}, ${resume.role}. ATS score ${resume.atsScore} out of 100.`}
            />
            {/* Page-edge shading so the thumbnail reads as paper */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-t-lg shadow-[inset_0_-24px_28px_-24px_rgb(13_21_38/0.12)]"
            />
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[0.9375rem] font-bold text-ink-900">
              {resume.title}
            </h3>
            <p className="mt-0.5 truncate text-[0.8125rem] text-ink-500">{resume.role}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <p className="shrink-0 text-[0.75rem] font-medium text-ink-400">
              {resume.updatedLabel}
            </p>

            <div className="flex items-center gap-0.5">
              {CARD_ACTIONS.map((action) => (
                <IconAction key={action.key} href={action.href} label={action.label}>
                  <action.icon className="size-4" aria-hidden="true" />
                </IconAction>
              ))}
              <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-ink-900/10" />
              <IconAction href="/resumes" label="More options">
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </IconAction>
            </div>
          </div>
        </div>
      </article>
    </motion.li>
  )
}

export function CreateResumeCard() {
  return (
    <motion.li variants={riseIn}>
      <Link
        href="/builder"
        className={cx(
          'group flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center',
          'border-ink-900/12 bg-white/50 transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[var(--ease-out-quint)]',
          'hover:-translate-y-1 hover:border-cobalt-400/80 hover:bg-white hover:shadow-lg',
        )}
      >
        <span
          className={cx(
            'grid size-12 place-items-center rounded-xl bg-cobalt-50 text-cobalt-600 ring-1 ring-cobalt-200',
            'transition-[background-color,color,box-shadow] duration-300',
            'group-hover:bg-linear-to-b group-hover:from-cobalt-500 group-hover:to-cobalt-600 group-hover:text-white group-hover:ring-cobalt-500',
            'group-hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_20px_-6px_var(--color-cobalt-600)]',
          )}
          aria-hidden="true"
        >
          <Plus className="size-5" strokeWidth={2.25} />
        </span>
        <span className="font-display text-[0.9375rem] font-bold text-ink-800">
          Create New Resume
        </span>
        <span className="max-w-[26ch] text-[0.8125rem] leading-relaxed text-ink-500">
          Start from scratch, pick a template, or import an existing file.
        </span>
      </Link>
    </motion.li>
  )
}
