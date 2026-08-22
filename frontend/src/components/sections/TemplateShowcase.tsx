import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, LayoutTemplate, Maximize2, X } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MiniResume } from '@/components/resume/MiniResume'
import { Button } from '@/components/ui/Button'
import { inViewOnce, riseIn, stagger } from '@/animations/motion'
import { templates } from '@/data/templates'
import type { Template } from '@/data/templates'

/** Shared frame ratio for every preview so the gallery stays even. */
const PAPER = 'aspect-[1/1.26]'

function AtsSafeChip() {
  return (
    <span className="pointer-events-none absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/90 px-2 py-1 text-[0.625rem] font-bold tracking-[0.06em] text-signal-700 uppercase shadow-xs backdrop-blur-sm">
      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
      ATS Safe
    </span>
  )
}

function TemplateCard({
  template,
  onPreview,
}: {
  template: Template
  onPreview: (template: Template) => void
}) {
  return (
    <motion.li variants={riseIn} className="group">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-xs transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-cobalt-500/22 hover:shadow-lg">
        <div className="relative bg-ink-50/70 p-3 pb-0">
          <AtsSafeChip />
          <div
            className={`@container relative ${PAPER} overflow-hidden rounded-t-lg bg-white ring-1 ring-ink-900/8 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.015]`}
          >
            <MiniResume template={template} />
            {/* Page-edge shading so the thumbnail reads as paper */}
            <span
              className="pointer-events-none absolute inset-0 rounded-t-lg shadow-[inset_0_-24px_28px_-24px_rgb(13_21_38/0.12)]"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h3 className="font-display text-[1.0625rem] font-bold text-ink-900">
              {template.name}
            </h3>
            <p className="mt-1 text-[0.875rem] leading-[1.55] text-ink-500">
              {template.blurb}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPreview(template)}
              className="flex-1"
            >
              <Maximize2 className="size-3.5" aria-hidden="true" />
              Preview
              <span className="sr-only"> the {template.name} template</span>
            </Button>
            <Button href="#pricing" size="sm" className="flex-1">
              Use Template
              <span className="sr-only"> {template.name}</span>
            </Button>
          </div>
        </div>
      </article>
    </motion.li>
  )
}

/**
 * Native `<dialog>` in modal mode — the platform gives us focus containment,
 * Escape-to-close and an inert background for free.
 */
function TemplatePreviewDialog({
  template,
  onClose,
}: {
  template: Template | null
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (template && !dialog.open) dialog.showModal()
    if (!template && dialog.open) dialog.close()
  }, [template])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      aria-labelledby="template-preview-title"
      className="fixed inset-0 z-50 m-auto h-fit max-h-[90dvh] w-[min(94vw,40rem)] overflow-y-auto rounded-2xl border border-ink-900/10 bg-canvas p-0 shadow-xl backdrop:bg-ink-950/55 backdrop:backdrop-blur-sm"
    >
      {template ? (
        <div>
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink-900/8 bg-canvas/90 px-5 py-4 backdrop-blur-md">
            <div>
              <h2
                id="template-preview-title"
                className="font-display text-lg font-bold text-ink-900"
              >
                {template.name} template
              </h2>
              <p className="mt-0.5 text-[0.8125rem] text-ink-500">{template.blurb}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-500 ring-1 ring-ink-900/10 transition-colors duration-200 hover:bg-ink-900/5 hover:text-ink-900"
            >
              <X className="size-4.5" aria-hidden="true" />
              <span className="sr-only">Close preview</span>
            </button>
          </div>

          <div className="p-5">
            <div
              className={`@container ${PAPER} overflow-hidden rounded-lg bg-white ring-1 ring-ink-900/10 shadow-md`}
            >
              <MiniResume template={template} />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.75rem] leading-[1.55] text-ink-500">
                Sample content shown for demonstration. The candidate, employer and
                contact details are fictional.
              </p>
              <Button href="#pricing" size="sm" onClick={onClose}>
                Use this template
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}

export function TemplateShowcase() {
  const [preview, setPreview] = useState<Template | null>(null)

  return (
    <section id="templates" className="relative py-20 lg:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Templates"
          eyebrowIcon={<LayoutTemplate className="size-3.5" />}
          title="Six layouts that stay readable to machines and to people."
          description="Single-column structures, standard section headings and selectable text — no tables, images or skill meters that break resume parsers."
        />

        <motion.ul
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} onPreview={setPreview} />
          ))}
        </motion.ul>

        <p className="mt-8 text-center text-[0.75rem] text-ink-500">
          Every template preview uses fictional demonstration content.
        </p>
      </div>

      <TemplatePreviewDialog template={preview} onClose={() => setPreview(null)} />
    </section>
  )
}
