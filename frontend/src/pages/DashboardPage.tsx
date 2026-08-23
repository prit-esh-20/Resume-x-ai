import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  FileUp,
  Plus,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { Reveal } from '@/components/ui/Reveal'
import { NotificationsMenu } from '@/components/dashboard/NotificationsMenu'
import { ResumeCard, CreateResumeCard } from '@/components/dashboard/ResumeCard'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import {
  activity,
  activityIcons,
  aiInsight,
  averageAts,
  greetingFor,
  quickActions,
  recommendations,
  resumes,
  SHOW_EMPTY_STATE,
  stats,
  user,
} from '@/data/dashboard'
import { inViewOnce, riseIn, stagger } from '@/animations/motion'
import { Link } from '@/lib/router'

/* ------------------------------------------------------------- primitives */

function SectionHeader({
  id,
  title,
  action,
}: {
  id: string
  title: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2
        id={id}
        className="font-display text-lg font-bold tracking-[-0.01em] text-ink-900 sm:text-xl"
      >
        {title}
      </h2>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
        >
          {action.label}
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  )
}

/** Smaller heading tier for right-rail sections — deliberate hierarchy. */
function RailHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="text-[0.75rem] font-bold tracking-[0.14em] text-ink-400 uppercase"
    >
      {children}
    </h2>
  )
}

/* ------------------------------------------------------------ stats band */

function AtsOverviewCard() {
  return (
    <motion.article
      variants={riseIn}
      className="flex h-full flex-col items-start gap-4 rounded-2xl border border-ink-900/8 bg-white p-5 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-cobalt-500/25 hover:shadow-md sm:flex-row sm:items-center sm:gap-5"
    >
      <ScoreRing
        value={averageAts.score}
        max={averageAts.max}
        size={116}
        strokeWidth={9}
        label={`Average ATS score ${averageAts.score} out of ${averageAts.max}`}
        numberClassName="text-[1.625rem]"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-500">Average ATS Score</p>

        {/* Verdict carries text + colour — never colour alone */}
        <p className="mt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-signal-50 px-2.5 py-1 ring-1 ring-signal-200">
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-signal-500"
            />
            <span className="text-xs font-semibold text-signal-700">
              {averageAts.verdict}
            </span>
          </span>
        </p>

        <p className="mt-2.5 text-xs leading-relaxed text-ink-400">
          {averageAts.note}
        </p>

        <Link
          href="/ats-analyzer"
          className="group mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
        >
          View analysis
          <ArrowRight
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  )
}

function StatTile({ stat }: { stat: (typeof stats)[number] }) {
  const Icon = stat.icon

  return (
    <motion.article
      variants={riseIn}
      aria-label={`${stat.value} ${stat.label.toLowerCase()}`}
      className="group flex items-center gap-4 rounded-2xl border border-ink-900/8 bg-white p-4 shadow-xs transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-cobalt-500/20 hover:shadow-md"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-cobalt-50 text-cobalt-600 ring-1 ring-cobalt-100"
      >
        <Icon className="size-[1.15rem]" />
      </span>
      <div className="min-w-0">
        <p className="font-display text-[1.625rem] leading-none font-bold tracking-[-0.02em] text-ink-900">
          <AnimatedNumber value={stat.value} duration={1.2} />
        </p>
        <p className="mt-1.5 truncate text-[0.8125rem] font-medium text-ink-500">
          {stat.label}
        </p>
        <p className="mt-0.5 hidden truncate text-xs text-ink-400 sm:block">
          {stat.hint}
        </p>
      </div>
    </motion.article>
  )
}

function StatsBand() {
  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="sr-only">
        Profile overview
      </h2>
      <motion.div
        className="grid gap-4 md:grid-cols-3 xl:grid-cols-5"
        variants={stagger(0.07)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex md:col-span-3 xl:col-span-2">
          <AtsOverviewCard />
        </div>
        {stats.map((stat) => (
          <StatTile key={stat.id} stat={stat} />
        ))}
      </motion.div>
    </section>
  )
}

/* --------------------------------------------------------------- resumes */

function PaperStackIllustration() {
  return (
    <div className="relative w-24" aria-hidden="true">
      <div className="relative aspect-[1/1.26]">
        <span className="absolute inset-0 -rotate-6 rounded-lg bg-white shadow-xs ring-1 ring-ink-900/10" />
        <span className="absolute inset-0 translate-x-1.5 rotate-[5deg] rounded-lg bg-white shadow-xs ring-1 ring-ink-900/10" />
        <span className="absolute inset-0 flex flex-col gap-1.5 rounded-lg bg-white p-3 shadow-md ring-1 ring-ink-900/10">
          <span className="h-1.5 w-2/3 rounded-full bg-ink-200" />
          <span className="h-1 w-1/2 rounded-full bg-ink-100" />
          <span className="mt-2 h-1 w-full rounded-full bg-ink-100" />
          <span className="h-1 w-5/6 rounded-full bg-ink-100" />
          <span className="h-1 w-2/3 rounded-full bg-ink-100" />
          <span className="mt-2 h-1 w-full rounded-full bg-ink-100" />
          <span className="h-1 w-3/4 rounded-full bg-ink-100" />
        </span>
      </div>
      <span className="absolute -right-2 -bottom-2 grid size-7 place-items-center rounded-full bg-linear-to-b from-cobalt-500 to-cobalt-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_4px_10px_-2px_var(--color-cobalt-700)] ring-2 ring-canvas">
        <Plus className="size-3.5" strokeWidth={2.5} />
      </span>
    </div>
  )
}

function EmptyResumesState() {
  return (
    <div className="mt-5 flex flex-col items-center rounded-2xl border-2 border-dashed border-ink-900/12 bg-white/60 px-6 py-12 text-center sm:py-14">
      <PaperStackIllustration />
      <h3 className="mt-7 font-display text-lg font-bold text-ink-900 sm:text-xl">
        Your career workspace starts here.
      </h3>
      <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-ink-500">
        Create your first ATS-friendly resume and let ResumeX AI help you
        optimize it.
      </p>
      <div className="mt-7 flex w-full flex-col justify-center gap-2.5 sm:w-auto sm:flex-row">
        <Button href="/builder">
          <Plus className="size-4" aria-hidden="true" />
          Create Your First Resume
        </Button>
        <Button variant="secondary" href="/import">
          <FileUp className="size-4" aria-hidden="true" />
          Import Existing Resume
        </Button>
      </div>
    </div>
  )
}

function ResumesSection() {
  return (
    <Reveal>
      <section aria-labelledby="resumes-heading">
        <SectionHeader
          id="resumes-heading"
          title="Your Resumes"
          action={{ label: 'View all', href: '/resumes' }}
        />

        {SHOW_EMPTY_STATE ? (
          <EmptyResumesState />
        ) : (
          <motion.ul
            className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            variants={stagger()}
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
          >
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
            <CreateResumeCard />
          </motion.ul>
        )}
      </section>
    </Reveal>
  )
}

/* ---------------------------------------------------------- recommendations */

function RecommendedSection() {
  return (
    <Reveal>
      <section aria-labelledby="recommended-heading">
        <SectionHeader id="recommended-heading" title="Recommended for you" />

        <motion.ul
          className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
        >
          {recommendations.map((rec) => {
            const Icon = rec.icon
            return (
              <motion.li key={rec.id} variants={riseIn}>
                <article className="group flex h-full flex-col rounded-2xl border border-ink-900/8 bg-white p-4 shadow-xs transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-cobalt-500/20 hover:shadow-md">
                  <span
                    aria-hidden="true"
                    className="grid size-9 place-items-center rounded-lg bg-cobalt-50 text-cobalt-600 ring-1 ring-cobalt-100"
                  >
                    <Icon className="size-[1.05rem]" />
                  </span>
                  <h3 className="mt-3 font-display text-[0.9375rem] font-bold text-ink-900">
                    {rec.title}
                  </h3>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-500">
                    {rec.description}
                  </p>
                  <Link
                    href={rec.href}
                    className="group/link mt-auto inline-flex items-center gap-1 pt-3 text-[0.8125rem] font-semibold text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
                  >
                    {rec.actionLabel}
                    <ArrowRight
                      className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </motion.li>
            )
          })}
        </motion.ul>
      </section>
    </Reveal>
  )
}

/* -------------------------------------------------------------- right rail */

function AiInsightCard() {
  return (
    <Reveal y={14}>
      <section aria-labelledby="insight-heading">
        <article className="relative overflow-hidden rounded-2xl bg-linear-to-b from-ink-800 to-ink-950 p-5 shadow-lg rim-light">
          {/* Single soft accent pool — no decorative clutter */}
          <span
            aria-hidden="true"
            className="absolute -top-20 -right-16 size-48 rounded-full bg-cobalt-500/25 blur-3xl"
          />

          <div className="relative flex items-center gap-2">
            <Sparkles className="size-4 shrink-0 text-cobalt-300" aria-hidden="true" />
            <p
              id="insight-heading"
              className="text-[0.6875rem] font-bold tracking-[0.14em] text-cobalt-200 uppercase"
            >
              {aiInsight.eyebrow}
            </p>
          </div>

          <blockquote className="relative mt-3 text-[0.9375rem] leading-relaxed text-ink-100">
            &ldquo;{aiInsight.message}&rdquo;
          </blockquote>

          <div className="relative mt-4">
            <Button href={aiInsight.ctaHref} size="sm">
              {aiInsight.ctaLabel}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Button>
          </div>

          <p className="relative mt-3 text-[0.6875rem] text-ink-400">
            {aiInsight.footnote}
          </p>
        </article>
      </section>
    </Reveal>
  )
}

function QuickActionsSection() {
  return (
    <Reveal y={14}>
      <section aria-labelledby="quick-actions-heading">
        <RailHeading id="quick-actions-heading">Quick actions</RailHeading>
        <ul className="mt-3 grid gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <li key={action.label}>
                <Link
                  href={action.href}
                  className="group -mx-1 flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-[0.875rem] font-medium text-ink-600 transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-ink-900/8 hover:bg-white hover:text-ink-900 hover:shadow-sm focus-visible:bg-white focus-visible:text-ink-900"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink-50 text-ink-500 ring-1 ring-ink-900/5 transition-[background-color,color] duration-200 group-hover:bg-cobalt-50 group-hover:text-cobalt-600"
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="truncate">{action.label}</span>
                  <ChevronRight
                    className="ml-auto size-4 shrink-0 text-ink-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cobalt-500"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </Reveal>
  )
}

function RecentActivitySection() {
  return (
    <Reveal y={14}>
      <section aria-labelledby="activity-heading">
        <RailHeading id="activity-heading">Recent activity</RailHeading>

        <ol className="relative mt-4 space-y-5">
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[14px] w-px bg-ink-900/8"
          />
          {activity.map((item) => {
            const Icon = activityIcons[item.kind]
            return (
              <li key={item.id} className="relative flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="z-10 grid size-7 shrink-0 place-items-center rounded-full bg-white text-ink-500 shadow-xs ring-1 ring-ink-900/10"
                >
                  <Icon className="size-[0.9rem]" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[0.8438rem] leading-snug font-semibold text-ink-800">
                    {item.title}
                  </p>
                  <p className="mt-0.5 truncate text-[0.8125rem] text-ink-500">
                    {item.context}
                  </p>
                  <p className="mt-1 text-[0.6875rem] font-medium text-ink-400">
                    {item.timeLabel}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </Reveal>
  )
}

/* ------------------------------------------------------------------- page */

export function DashboardPage() {
  const greeting = greetingFor(new Date().getHours())

  return (
    <DashboardShell>
      <div className="mx-auto w-full max-w-[88rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        {/* Greeting + primary actions */}
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-[1.65rem] leading-tight font-bold tracking-[-0.02em] text-ink-900 sm:text-[1.95rem]">
              {greeting}, {user.firstName}
            </h1>
            <p className="mt-1.5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-ink-500">
              Here&rsquo;s a snapshot of your professional profile and resume
              performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button href="/builder">
              <Plus className="size-4" aria-hidden="true" />
              Create New Resume
            </Button>
            <Button variant="secondary" href="/import">
              <FileUp className="size-4" aria-hidden="true" />
              Import Resume
            </Button>
            <div className="ml-1 hidden lg:block">
              <NotificationsMenu badgeRingClass="ring-canvas" align="end" />
            </div>
          </div>
        </header>

        <div className="mt-7 space-y-9">
          <StatsBand />

          <div className="grid gap-9 xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-8">
            <div className="min-w-0 space-y-9">
              <ResumesSection />
              <RecommendedSection />
            </div>

            <aside aria-label="Assistant and activity" className="min-w-0 space-y-8">
              <AiInsightCard />
              <QuickActionsSection />
              <RecentActivitySection />
            </aside>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-ink-400">
          Demo workspace — all people, companies, scores and activity shown are
          sample data.
        </p>
      </div>
    </DashboardShell>
  )
}
