import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { easeOutExpo } from '@/animations/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Seconds of delay before the reveal starts. */
  delay?: number
  /** Travel distance in px. Kept small so nothing "flies" in. */
  y?: number
  duration?: number
  /** Fraction of the element that must be visible to trigger. */
  amount?: number
}

/**
 * Viewport-triggered entrance for a whole block. Under
 * `prefers-reduced-motion` the children render in their final state with no
 * animation at all.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  duration = 0.7,
  amount = 0.2,
}: RevealProps) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  )
}
