import { Compass, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

type ComingSoonPageProps = {
  title: string
  blurb?: string
}

/**
 * Shared stand-in for routes whose pages are not built yet. Renders inside
 * the dashboard shell so the sidebar stays live and the active item still
 * highlights — no dead ends anywhere in the app.
 */
export function ComingSoonPage({ title, blurb }: ComingSoonPageProps) {
  return (
    <DashboardShell>
      <div className="flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="w-full max-w-md rounded-2xl border border-ink-900/8 bg-white p-8 text-center shadow-md">
          <span
            aria-hidden="true"
            className="mx-auto grid size-12 place-items-center rounded-xl bg-cobalt-50 text-cobalt-600 ring-1 ring-cobalt-100"
          >
            <Compass className="size-6" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold tracking-[-0.02em] text-ink-900">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            {blurb ??
              'This area of ResumeX AI is still being built. Navigation is already wired for it.'}
          </p>
          <Button href="/dashboard" variant="secondary" className="mt-6">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardShell>
  )
}
