import { useState, type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { AmbientBackdrop } from '@/components/ui/AmbientBackdrop'
import { Logo } from '@/components/ui/Logo'
import { MobileDrawer, Sidebar } from '@/components/dashboard/Sidebar'
import { NotificationsMenu } from '@/components/dashboard/NotificationsMenu'
import { UserMenu } from '@/components/dashboard/UserMenu'
import { user } from '@/data/dashboard'
import { Link } from '@/lib/router'

const COLLAPSE_KEY = 'resumex:sidebar-collapsed'

function readStoredCollapse() {
  try {
    return window.localStorage.getItem(COLLAPSE_KEY) === 'true'
  } catch {
    return false
  }
}

/**
 * Application frame for signed-in areas: persistent dark rail on desktop,
 * top bar + slide-out drawer on mobile. The quiet ambient variant keeps the
 * ResumeX identity without competing with dense dashboard content.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(readStoredCollapse)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleCollapse = () => {
    setCollapsed((value) => {
      const next = !value
      try {
        window.localStorage.setItem(COLLAPSE_KEY, String(next))
      } catch {
        /* private mode — collapse still works for this session */
      }
      return next
    })
  }

  return (
    <div className="relative isolate flex min-h-dvh bg-canvas">
      <AmbientBackdrop variant="quiet" />

      <a
        href="#dashboard-main"
        className="sr-focusable inline-flex min-h-11 items-center rounded-full bg-cobalt-600 px-4 text-sm font-semibold text-white shadow-lg"
      >
        Skip to dashboard content
      </a>

      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />

      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-ink-900/8 bg-white/85 px-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="grid size-10 place-items-center rounded-xl text-ink-600 transition-colors duration-200 hover:bg-ink-900/5 hover:text-ink-900"
          >
            <Menu className="size-[1.25rem]" aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </button>

          <Link
            href="/dashboard"
            aria-label="ResumeX AI — dashboard home"
            className="-m-1 rounded-xl p-1 transition-opacity duration-200 hover:opacity-80"
          >
            <Logo />
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <NotificationsMenu badgeRingClass="ring-white/85" />
            <UserMenu user={user} variant="avatar" placement="bottom" align="end" />
          </div>
        </header>

        <main id="dashboard-main" className="relative z-10 flex-1">
          {children}
        </main>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
