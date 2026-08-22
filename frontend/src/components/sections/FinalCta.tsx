import { ArrowRight, Sparkles } from 'lucide-react'
import { AmbientBackdrop } from '@/components/ui/AmbientBackdrop'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden py-24 lg:py-32">
      <AmbientBackdrop variant="deep" />

      <div className="shell relative">
        <Reveal className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
          <Eyebrow tone="dark" icon={<Sparkles className="size-3.5" />}>
            Ready when you are
          </Eyebrow>

          <h2 className="mt-6 text-[clamp(2rem,1.2rem+3.2vw,3.25rem)] leading-[1.06] text-white">
            Your next application deserves a resume that clears the filter.
          </h2>

          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.65] text-ink-300">
            Build it, score it, and fix what the analyzer flags — then export and apply.
            Free to start, no card required.
          </p>

          <div className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button href="#top" variant="invert" size="lg" className="w-full sm:w-auto">
              Build My Resume Free
              <ArrowRight
                className="size-[1.15rem] transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
            <Button
              href="#templates"
              variant="outlineInvert"
              size="lg"
              className="w-full sm:w-auto"
            >
              Browse templates
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
