import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { easeOutExpo } from '@/animations/motion'

type AnimatedNumberProps = {
  value: number
  className?: string
  duration?: number
  delay?: number
  suffix?: string
  /** Trigger immediately on mount instead of waiting for the viewport. */
  immediate?: boolean
}

/**
 * Counts 0 → value once the element scrolls into view, driven by a MotionValue
 * so the count does not re-render React on every frame. Tabular figures keep
 * the surrounding layout perfectly still while the digits change.
 *
 * The digits are `aria-hidden`; callers are expected to expose the final value
 * through an accessible name on the surrounding element.
 */
export function AnimatedNumber({
  value,
  className,
  duration = 1.5,
  delay = 0,
  suffix = '',
  immediate = false,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const prefersReduced = useReducedMotion()

  const progress = useMotionValue(0)
  const label = useTransform(progress, (latest) => `${Math.round(latest)}${suffix}`)

  const shouldRun = immediate || inView

  useEffect(() => {
    if (!shouldRun) return

    if (prefersReduced) {
      progress.set(value)
      return
    }

    const controls = animate(progress, value, {
      duration,
      delay,
      ease: easeOutExpo,
    })
    return () => controls.stop()
  }, [shouldRun, prefersReduced, value, duration, delay, progress])

  return (
    <motion.span ref={ref} className={`tnum ${className ?? ''}`} aria-hidden="true">
      {label}
    </motion.span>
  )
}
