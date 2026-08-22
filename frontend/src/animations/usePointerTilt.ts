import { useCallback, useEffect, useState } from 'react'
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { tiltSpring } from './motion'

type TiltOptions = {
  /** Maximum rotation in degrees on either axis. Keep this small — 2–4°. */
  max?: number
  /** Media query gating the effect. Defaults to precise pointers on laptops+. */
  query?: string
}

/**
 * Extremely restrained pointer-follow tilt for the hero product mockup.
 *
 * Gated behind a fine pointer and a ≥1024px viewport so touch devices never
 * pay for it, and disabled outright under `prefers-reduced-motion`. Returns
 * the normalised pointer position too, so sibling layers can parallax by
 * a few pixels against the same input.
 */
export function usePointerTilt({
  max = 3,
  query = '(pointer: fine) and (min-width: 1024px)',
}: TiltOptions = {}) {
  const prefersReduced = useReducedMotion()
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const sync = () => setSupported(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [query])

  const active = supported && !prefersReduced

  // Normalised pointer offset from the element centre, -0.5 … 0.5
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)

  const rotateX = useSpring(useTransform(offsetY, [-0.5, 0.5], [max, -max]), tiltSpring)
  const rotateY = useSpring(useTransform(offsetX, [-0.5, 0.5], [-max, max]), tiltSpring)

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!active) return
      const bounds = event.currentTarget.getBoundingClientRect()
      offsetX.set((event.clientX - bounds.left) / bounds.width - 0.5)
      offsetY.set((event.clientY - bounds.top) / bounds.height - 0.5)
    },
    [active, offsetX, offsetY],
  )

  const handlePointerLeave = useCallback(() => {
    offsetX.set(0)
    offsetY.set(0)
  }, [offsetX, offsetY])

  return {
    active,
    offsetX,
    offsetY,
    rotateX,
    rotateY,
    handlePointerMove,
    handlePointerLeave,
  }
}
