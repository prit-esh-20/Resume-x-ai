import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { Plus, ShieldCheck, Sparkles, TrendingUp, Wand2 } from 'lucide-react'
import { ResumeDocument } from '@/components/resume/ResumeDocument'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Logo } from '@/components/ui/Logo'
import { usePointerTilt } from '@/animations/usePointerTilt'
import { easeOutExpo } from '@/animations/motion'
import { editorSections, heroResume } from '@/data/resume'
import { atsScore } from '@/data/atsBreakdown'
import { cx } from '@/lib/cx'

const KEYWORD_MATCH = 94
const ROLE = heroResume.experience[0]

/** Walks the editor selection forward a couple of steps on load, then rests. */
function useSettlingSelection(steps: number, dwell = 1100) {
  const prefersReduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReduced) return
    const timers = Array.from({ length: steps }, (_, step) =>
      window.setTimeout(() => setIndex(step + 1), 900 + dwell * step),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [prefersReduced, steps, dwell])

  return prefersReduced ? steps : index
}

/* ------------------------------------------------------------------ chrome */

function WindowChrome() {
  return (
    <div className="flex items-center gap-3 border-b border-ink-900/7 bg-linear-to-b from-white to-ink-50/70 px-3.5 py-2.5">
      <Logo markOnly className="[&>span]:size-5 [&_svg]:size-3.5" />

      <span className="h-4 w-px bg-ink-900/8" />

      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-[0.6875rem] font-medium text-ink-600">
          Aarav_Sharma_Resume
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-signal-50 px-1.5 py-0.5 text-[0.5625rem] font-semibold tracking-[0.06em] text-signal-700 uppercase ring-1 ring-signal-600/15">
          <span className="size-1 rounded-full bg-signal-500" />
          Saved
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-[0.625rem] font-medium text-ink-400 tabular-nums sm:inline">
          100%
        </span>
        <span className="rounded-full bg-linear-to-b from-cobalt-500 to-cobalt-600 px-2.5 py-1 text-[0.625rem] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
          Export PDF
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- editor pane */

function Field({
  label,
  value,
  className,
  caret,
}: {
  label: string
  value: string
  className?: string
  caret?: boolean
}) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <p className="text-[0.5625rem] font-semibold tracking-[0.1em] text-ink-400 uppercase">
        {label}
      </p>
      <div
        className={cx(
          'flex min-w-0 items-center rounded-md border bg-white px-2 py-1.5 text-[0.6875rem] text-ink-800',
          caret ? 'border-cobalt-500/45 ring-2 ring-cobalt-500/12' : 'border-ink-900/10',
        )}
      >
        <span className="truncate">{value}</span>
        {caret ? (
          <motion.span
            className="ml-px inline-block h-[0.85em] w-px shrink-0 bg-cobalt-600"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        ) : null}
      </div>
    </div>
  )
}

function EditorPane({ className }: { className?: string }) {
  const active = useSettlingSelection(2)
  const activeIndex = Math.min(active, editorSections.length - 1)

  return (
    <div className={cx('gap-3 border-r border-ink-900/7 py-3 pr-3', className)}>
      {/* Section list */}
      <div className="flex w-[7.5rem] shrink-0 flex-col gap-2">
        <p className="px-2 text-[0.5625rem] font-bold tracking-[0.16em] text-ink-400 uppercase">
          Sections
        </p>

        <ul className="flex flex-col gap-0.5">
          {editorSections.map((section, index) => {
            const isActive = index === activeIndex
            return (
              <li key={section}>
                <div
                  className={cx(
                    'relative flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.6875rem] transition-colors duration-300',
                    isActive
                      ? 'bg-cobalt-50 font-semibold text-cobalt-800'
                      : 'font-medium text-ink-500',
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="hero-rail-marker"
                      className="absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-full bg-cobalt-500"
                      transition={{ duration: 0.35, ease: easeOutExpo }}
                    />
                  ) : null}
                  <span
                    className={cx(
                      'size-1.5 shrink-0 rounded-full transition-colors duration-300',
                      isActive ? 'bg-cobalt-500' : 'bg-ink-200',
                    )}
                  />
                  <span className="truncate">{section}</span>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-auto flex items-center gap-1.5 rounded-md border border-dashed border-ink-900/10 px-2 py-1.5 text-[0.625rem] font-medium text-ink-400">
          <Plus className="size-3" strokeWidth={2.2} />
          Add section
        </div>
      </div>

      {/* Active section form */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 border-l border-ink-900/7 pl-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-[0.75rem] font-bold text-ink-900">
            {editorSections[activeIndex]}
          </p>
          <span className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-ink-500 tabular-nums">
            1 of 1
          </span>
        </div>

        <Field label="Role" value={ROLE.role} />
        <Field label="Company" value={ROLE.org} />

        <div className="grid grid-cols-2 gap-2">
          <Field label="From" value="May 2025" />
          <Field label="To" value="July 2025" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1">
          <p className="text-[0.5625rem] font-semibold tracking-[0.1em] text-ink-400 uppercase">
            Highlights
          </p>
          <div className="flex flex-1 flex-col gap-1.5 rounded-md border border-cobalt-500/45 bg-white p-2 ring-2 ring-cobalt-500/12">
            <p className="text-[0.6875rem] leading-[1.45] text-ink-700">
              {ROLE.bullets[0]}
            </p>
            <p className="text-[0.6875rem] leading-[1.45] text-ink-700">
              <span className="rounded-[2px] bg-cobalt-100 px-0.5 ring-1 ring-cobalt-300/70">
                {ROLE.bullets[1]}
              </span>
              <motion.span
                className="ml-px inline-block h-[0.85em] w-px align-middle bg-cobalt-600"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
              />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start rounded-full bg-cobalt-600 px-2.5 py-1 text-[0.625rem] font-semibold text-white">
          <Wand2 className="size-3" strokeWidth={2.2} />
          Improve with AI
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- right rail */

function InsightsRail({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion()

  return (
    <div className={cx('gap-2.5 py-3 pl-3 sm:border-l sm:border-ink-900/7', className)}>
      <p className="hidden items-center gap-1.5 text-[0.5625rem] font-bold tracking-[0.16em] text-ink-400 uppercase sm:flex">
        <Sparkles className="size-3 text-cobalt-500" strokeWidth={2.2} />
        AI Insights
      </p>

      {/* ATS score */}
      <motion.div
        className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-ink-900/7 bg-white px-3 py-2.5 shadow-xs sm:flex-none"
        initial={prefersReduced ? undefined : { opacity: 0, y: 10 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85, ease: easeOutExpo }}
        style={{ transform: 'translateZ(26px)' }}
      >
        <p className="text-[0.5625rem] font-bold tracking-[0.12em] text-ink-400 uppercase">
          ATS Score
        </p>
        <ScoreRing
          value={atsScore.value}
          size={86}
          strokeWidth={7}
          immediate
          label={`Demonstration ATS score: ${atsScore.value} out of ${atsScore.max}`}
          numberClassName="text-[1.375rem]"
        />
        <p className="text-[0.625rem] font-semibold text-signal-700">Excellent</p>
      </motion.div>

      {/* Keyword match */}
      <motion.div
        className="flex flex-1 flex-col justify-center gap-1.5 rounded-lg border border-ink-900/7 bg-white px-3 py-2.5 shadow-xs sm:flex-none"
        initial={prefersReduced ? undefined : { opacity: 0, y: 10 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: easeOutExpo }}
        style={{ transform: 'translateZ(26px)' }}
      >
        <p className="text-[0.5625rem] font-bold tracking-[0.12em] text-ink-400 uppercase">
          Keyword Match
        </p>
        <p className="font-display text-lg leading-none font-bold text-ink-900">
          <AnimatedNumber value={KEYWORD_MATCH} suffix="%" immediate duration={1.6} />
        </p>
        <div className="h-1 overflow-hidden rounded-full bg-ink-100">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-cobalt-500 to-signal-500"
            initial={{ width: prefersReduced ? `${KEYWORD_MATCH}%` : '0%' }}
            animate={{ width: `${KEYWORD_MATCH}%` }}
            transition={{
              duration: prefersReduced ? 0 : 1.6,
              delay: prefersReduced ? 0 : 1.05,
              ease: easeOutExpo,
            }}
          />
        </div>
        <p className="flex items-center gap-1 text-[0.5625rem] font-medium text-signal-700">
          <TrendingUp className="size-2.5" strokeWidth={2.4} />
          +6 vs. last version
        </p>
      </motion.div>

      {/* AI suggestion — the "live" moment of the mockup */}
      <motion.div
        className="hidden flex-col gap-1 rounded-lg border border-cobalt-500/18 bg-cobalt-50/70 px-3 py-2.5 sm:flex"
        initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.45, ease: easeOutExpo }}
        style={{ transform: 'translateZ(26px)' }}
      >
        <p className="flex items-center gap-1.5 text-[0.5625rem] font-bold tracking-[0.12em] text-cobalt-700 uppercase">
          <Sparkles className="size-2.5" strokeWidth={2.4} />
          Suggestion
        </p>
        <p className="text-[0.6875rem] leading-[1.45] text-ink-700">
          Quantify the second highlight — name the metric you improved.
        </p>
        <div className="mt-0.5 flex gap-1.5">
          <span className="rounded-full bg-cobalt-600 px-2 py-0.5 text-[0.5625rem] font-semibold text-white">
            Apply
          </span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[0.5625rem] font-semibold text-ink-500 ring-1 ring-ink-900/8">
            Dismiss
          </span>
        </div>
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------- floaters */

function FloatingChip({
  className,
  children,
  delay,
  depth,
}: {
  className?: string
  children: React.ReactNode
  delay: number
  depth: number
}) {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      className={cx(
        'absolute z-20 hidden items-center gap-1.5 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-[0.6875rem] font-semibold text-ink-700 shadow-lg backdrop-blur-md md:flex',
        className,
      )}
      initial={prefersReduced ? undefined : { opacity: 0, y: 12, scale: 0.94 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: easeOutExpo }}
      style={{ transform: `translateZ(${depth}px)` }}
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------- component */

export function HeroProductMockup({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion()
  const { rotateX, rotateY, offsetX, offsetY, handlePointerMove, handlePointerLeave } =
    usePointerTilt({ max: 3 })

  // Chips drift a few pixels against the tilt for a parallax read.
  const chipX = useTransform(offsetX, [-0.5, 0.5], [10, -10])
  const chipY = useTransform(offsetY, [-0.5, 0.5], [8, -8])

  return (
    <div
      className={cx('scene relative', className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      role="img"
      aria-label="Preview of the ResumeX AI editor: an editable Experience form on the left, a live resume preview for a demonstration candidate in the centre, and an AI insights panel showing a demonstration ATS score of 92 out of 100 and a 94 percent keyword match."
    >
      {/* Soft contact shadow grounding the slab */}
      <div
        className="absolute inset-x-8 bottom-0 h-16 rounded-[50%] bg-ink-900/12 blur-2xl"
        aria-hidden="true"
      />

      <motion.div
        className="relative [transform-style:preserve-3d]"
        initial={prefersReduced ? undefined : { opacity: 0, y: 28, scale: 0.965 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.32, ease: easeOutExpo }}
      >
        {/* Idle float, independent of the pointer tilt */}
        <motion.div
          className="[transform-style:preserve-3d]"
          animate={prefersReduced ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="relative rounded-2xl border border-ink-900/8 bg-white/80 shadow-float backdrop-blur-xl [transform-style:preserve-3d]"
            style={{ rotateX, rotateY }}
          >
            <div className="overflow-hidden rounded-2xl [transform-style:preserve-3d]">
              <WindowChrome />

              <div className="grid grid-cols-1 items-stretch bg-ink-50/40 px-3 sm:grid-cols-[minmax(0,1fr)_11rem] lg:grid-cols-[minmax(0,1fr)_24rem_11.5rem]">
                <EditorPane className="hidden lg:flex" />

                {/* Resume paper — portrait page, lifted forward in the 3D scene */}
                <div className="flex justify-center px-0 py-3 sm:px-3">
                  <div
                    className="@container aspect-[1/1.294] w-full max-w-[22.5rem] overflow-hidden rounded-[4px] ring-1 ring-ink-900/8 shadow-lg"
                    style={{ transform: 'translateZ(18px)' }}
                  >
                    <ResumeDocument content={heroResume} showSuggestion />
                  </div>
                </div>

                <InsightsRail className="flex flex-row gap-2 sm:flex-col sm:gap-2.5" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Two floating signals — deliberately only two */}
        <motion.div style={prefersReduced ? undefined : { x: chipX, y: chipY }}>
          <FloatingChip className="-top-4 -left-5 lg:-left-9" delay={1.15} depth={58}>
            <ShieldCheck className="size-3.5 text-signal-600" strokeWidth={2.3} />
            ATS-ready format
          </FloatingChip>

          <FloatingChip className="-right-4 bottom-14 lg:-right-8" delay={1.35} depth={64}>
            <span className="grid size-4 place-items-center rounded-full bg-signal-100 text-signal-700">
              <TrendingUp className="size-2.5" strokeWidth={2.6} />
            </span>
            6 keywords added
          </FloatingChip>
        </motion.div>
      </motion.div>
    </div>
  )
}
