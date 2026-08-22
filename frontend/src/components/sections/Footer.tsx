import { ArrowUp } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Templates', href: '#templates' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'ATS Breakdown', href: '#ats-breakdown' },
      { label: 'Feedback', href: '#testimonials' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-900/8 bg-canvas">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))] lg:gap-12">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-[36ch] text-[0.9375rem] leading-[1.6] text-ink-500">
              Resume intelligence for people applying to real roles — ATS scoring, keyword
              matching and AI review on one document.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-display text-[0.6875rem] font-bold tracking-[0.16em] text-ink-400 uppercase">
                {column.title}
              </h2>
              {/* Rows stay compact for mice and grow to a 44px target on touch */}
              <ul className="mt-4 flex flex-col gap-3 pointer-coarse:mt-2 pointer-coarse:gap-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center text-[0.9375rem] text-ink-600 transition-colors duration-200 hover:text-ink-900 pointer-coarse:min-h-11"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-900/8 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-ink-400">
            © {year} ResumeX AI. Preview build — sample scores, resumes and testimonials
            are illustrative.
          </p>

          <a
            href="#top"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-ink-600 ring-1 ring-ink-900/10 transition-colors duration-200 hover:bg-ink-50 hover:text-ink-900 pointer-coarse:min-h-11 pointer-coarse:px-4"
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
