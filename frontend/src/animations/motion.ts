import type { Transition, Variants } from 'framer-motion'

/** Shared easing tokens — mirrors the CSS custom properties in index.css. */
export const easeOutQuint: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Used for pointer-driven and press interactions where physics feels right. */
export const softSpring: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
  mass: 0.8,
}

export const tiltSpring: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 18,
  mass: 0.6,
}

/** Section-level entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

/** Elegant grid/list entrance — small lift, tiny scale, no directional flying. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
}

/**
 * Parent that staggers its children. Kept at 60–70ms per item so a six-card
 * grid finishes well inside half a second.
 */
export const stagger = (each = 0.065, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: each, delayChildren },
  },
})

/** Standard viewport trigger — fires once, a quarter of the way in. */
export const inViewOnce = { once: true, amount: 0.25 } as const
