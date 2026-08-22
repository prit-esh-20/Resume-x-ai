import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { AtsBreakdown } from '@/components/sections/AtsBreakdown'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { TemplateShowcase } from '@/components/sections/TemplateShowcase'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/sections/Footer'

export function LandingPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-focusable inline-flex min-h-11 items-center rounded-full bg-cobalt-600 px-4 text-sm font-semibold text-white shadow-lg"
      >
        Skip to main content
      </a>

      <span id="top" className="sr-only">
        Top of page
      </span>

      <Navbar />

      <main id="main">
        <Hero />
        <AtsBreakdown />
        <FeatureGrid />
        <HowItWorks />
        <TemplateShowcase />
        <Testimonials />
        <Pricing />
        <FinalCta />
      </main>

      <Footer />
    </>
  )
}
