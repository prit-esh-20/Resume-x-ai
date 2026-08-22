import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { easeOutExpo } from '@/animations/motion'
import { navLinks } from '@/data/nav'
import { cx } from '@/lib/cx'

const SECTION_IDS = navLinks.map((link) => link.href.slice(1))

/** Tracks which section is crossing the middle of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return active
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 12)
  })

  // Escape closes the drawer; body scroll stays locked while it is open.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const previousOverflow = document.body.style.overflow

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300',
        scrolled
          ? 'border-b border-ink-900/8 bg-canvas/80 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_8px_24px_-16px_rgb(13_21_38/0.28)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className={cx(
          'shell flex items-center justify-between transition-[height] duration-300',
          scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-[4.5rem]',
        )}
      >
        <a
          href="#top"
          className="-m-2 rounded-xl p-2 transition-opacity duration-200 hover:opacity-80"
        >
          <Logo />
          <span className="sr-only">ResumeX AI — back to top</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cx(
                    'relative block rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-200',
                    isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900',
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-ink-900/6"
                      transition={{ duration: 0.4, ease: easeOutExpo }}
                    />
                  ) : null}
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden lg:block">
          <Button href="#pricing" size="sm">
            Get Started Free
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid size-11 place-items-center rounded-xl bg-white text-ink-700 ring-1 ring-ink-900/10 shadow-xs transition-colors duration-200 hover:bg-ink-50 lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              tabIndex={-1}
            >
              <span className="sr-only">Close menu</span>
            </button>

            <motion.div
              id="mobile-menu"
              className="absolute inset-x-3 top-3 overflow-hidden rounded-2xl border border-ink-900/8 bg-canvas shadow-xl"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: easeOutExpo }}
            >
              <div className="flex items-center justify-between border-b border-ink-900/8 px-4 py-3.5">
                <Logo />
                <button
                  type="button"
                  autoFocus
                  onClick={() => setOpen(false)}
                  className="grid size-11 place-items-center rounded-xl text-ink-600 ring-1 ring-ink-900/10 transition-colors duration-200 hover:bg-ink-900/5"
                >
                  <X className="size-5" aria-hidden="true" />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>

              <ul className="flex flex-col p-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium text-ink-800 transition-colors duration-200 hover:bg-ink-900/5"
                    >
                      {link.label}
                      <ArrowRight className="size-4 text-ink-300" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="border-t border-ink-900/8 p-4">
                <Button href="#pricing" size="md" fullWidth onClick={() => setOpen(false)}>
                  Get Started Free
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
