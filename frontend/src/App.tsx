import { MotionConfig } from 'framer-motion'
import { LandingPage } from '@/pages/LandingPage'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LandingPage />
    </MotionConfig>
  )
}
