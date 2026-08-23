import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ShaderField, type ShaderFieldUniforms } from '@/components/ui/ShaderField'
import { cx } from '@/lib/cx'

/**
 * AuroraField — ResumeX AI's tuning of the shader field.
 *
 * The ramp is the design system, not the shader recipe's defaults: it runs from
 * `--color-canvas` through `--color-cobalt-100` and a 20%-over-white wash of
 * `--color-aurora`, so the whole field lives inside a 0.86–1.0 luminance band.
 * That is deliberate — the darkest stop still holds ~13:1 against ink-900 body
 * text, which makes readability structural rather than something to tune for.
 *
 * The canvas is opaque (the recipe writes alpha 1.0). Rather than add blending
 * and inherit premultiply artefacts, stop 0 *is* the page canvas colour and the
 * layer is faded with a mask — so the aurora concentrates in the upper hero and
 * is gone well before the product mockup and the next section.
 */

/** sRGB 0..1, straight off the tokens in `index.css`. */
const RAMP = {
  /** `--color-canvas` #fbfcfe — makes the opaque canvas read as the page. */
  canvas: [0.98431, 0.98824, 0.99608],
  /** Midway canvas → `--color-cobalt-50`: the "clean paper" majority. */
  paper: [0.95686, 0.96863, 1.0],
  /** `--color-cobalt-100` #dee6ff — the brand hue, at its lightest step. */
  cobalt: [0.87059, 0.90196, 1.0],
  /** `--color-aurora` #6d5bf0 at 20% over white — the lavender turn. */
  aurora: [0.88627, 0.87059, 0.98824],
} satisfies Record<string, [number, number, number]>

const COLORS: [number, number, number][] = [
  RAMP.canvas,
  RAMP.paper,
  RAMP.cobalt,
  RAMP.aurora,
  // Padding: the shader declares vec3[8]; only `colorCount` stops are read.
  RAMP.aurora,
  RAMP.aurora,
  RAMP.aurora,
  RAMP.aurora,
]

const BASE: ShaderFieldUniforms = {
  colors: COLORS,
  colorCount: 4,
  // Broad, few bands. Higher scale would read as stripes rather than weather.
  scale: 1.5,
  intensity: 0.42,
  paramA: 0.5,
  warp: 0.1,
  detail: 1.6,
  // Under 1 flattens the ramp further — ambient light, not a gradient poster.
  contrast: 0.86,
  brightness: 0.02,
  saturation: 0.88,
  // The recipe's defaults for these four all fight a near-white page: a hue
  // shift leaves the brand palette, and vignette/grain read as dirt and noise.
  hue: 0,
  vignette: 0,
  // The 5-tap blur costs 5x the fragment work and measured a 3/255 maximum
  // channel delta against this ramp — the field is already soft enough that it
  // buys nothing. Softness comes from `warp` and low `contrast` instead.
  blur: 0,
  grain: 0,
  seed: 1187,
  // A few degrees off-axis, so the bands don't line up with the layout grid.
  rotate: 0.22,
  offsetX: -0.1,
  // `shade()` fades the glow by `1 - abs(p.y) * 0.7` around the field's own
  // centre line, so this offset is what positions the bright band. Negative
  // lifts it to roughly 12% down the hero — above the headline, so the shader's
  // falloff and the mask below both fade in the same direction. Measured mean
  // luminance runs 229 at the top to 239 at the bottom of the canvas.
  offsetY: -0.57,
  drift: 0.03,
  cursorEnabled: true,
  // Push, not the recipe's ripple: ripple oscillates at 5 rad/s under the
  // pointer, which reads as shimmer. Push translates the whole field in
  // pre-scale screen space — parallax that responds without chasing.
  cursorEffect: 0,
  cursorStrength: 0.075,
  cursorRadius: 0.7,
  // sRGB mixing is fine across a ramp this tight, and skips ~7 pow() per pixel.
  oklab: 0,
  // ~8x slower than the recipe: movement you notice only if you look for it.
  timeScale: 0.13,
  // A soft gradient is resolution-insensitive; 0.55 MP is indistinguishable
  // from the recipe's 2 MP here and costs a quarter of the fragment work.
  pixelBudget: 560_000,
}

const FULL: ShaderFieldUniforms = BASE

/** Coarse pointer / small viewport: lower intensity, no pointer work, fewer pixels. */
const LITE: ShaderFieldUniforms = {
  ...BASE,
  // Broader bands read better across a narrow viewport.
  scale: 1.25,
  warp: 0.13,
  // Flattens the ramp further, so the field is fainter where text occupies
  // proportionally more of the screen.
  contrast: 0.8,
  cursorEnabled: false,
  timeScale: 0.1,
  pixelBudget: 300_000,
}

/** `prefers-reduced-motion`: frozen time and no pointer, so exactly one frame
 * is drawn and the render loop self-terminates. A static gradient, no listeners. */
const STATIC: ShaderFieldUniforms = {
  ...BASE,
  drift: 0,
  cursorEnabled: false,
  timeScale: 0,
}

const LITE_QUERY = '(pointer: coarse), (width < 48rem)'

function useMatchMedia(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/**
 * Concentrates the field above the headline and clears it before the product
 * mockup, so the aurora is strongest in empty space and reads as a gradient
 * across the copy rather than a flat wash behind it.
 *
 * Measured against the 1440px hero: ~1.0 through the navbar band, ~0.79 at the
 * top of the h1 easing to ~0.49 at its baseline, ~0.21 behind the CTAs, and 0
 * by 54% — just above where the mockup starts.
 */
const MASK =
  'radial-gradient(120% 92% at 50% -10%, black 0%, black 16%, transparent 70%)'

export function AuroraField({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion()
  const lite = useMatchMedia(LITE_QUERY)
  const uniforms = prefersReduced ? STATIC : lite ? LITE : FULL

  return (
    <div
      className={cx('absolute inset-0 opacity-80 md:opacity-100', className)}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <ShaderField uniforms={uniforms} />
    </div>
  )
}
