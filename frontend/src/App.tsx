import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { RouterProvider } from '@/lib/router'
import { useRouter } from '@/lib/useRouter'

/**
 * Routes whose pages are not built yet resolve to a shared stand-in inside
 * the dashboard shell, so sidebar navigation never dead-ends.
 */
const COMING_SOON_ROUTES: Record<string, { title: string; blurb?: string }> = {
  '/builder': {
    title: 'Resume Builder',
    blurb:
      'The guided resume editor arrives here. New drafts and imported resumes will open straight into it.',
  },
  '/resumes': { title: 'My Resumes' },
  '/ats-analyzer': { title: 'ATS Analyzer' },
  '/job-matching': { title: 'Job Matching' },
  '/ai-review': { title: 'AI Resume Review' },
  '/cover-letter': { title: 'Cover Letter Generator' },
  '/import': { title: 'Resume Import' },
  '/version-history': { title: 'Version History' },
  '/settings': { title: 'Settings' },
}

function Routes() {
  const { path, navigate } = useRouter()

  // Unmatched paths resolve to the site root so no route can strand the
  // user on a blank view.
  useEffect(() => {
    const known =
      path === '/' ||
      path === '/login' ||
      path === '/register' ||
      path === '/dashboard' ||
      path in COMING_SOON_ROUTES
    if (!known) {
      navigate('/', { replace: true })
    }
  }, [path, navigate])

  if (path === '/login') return <LoginPage />
  if (path === '/register') return <RegisterPage />
  if (path === '/dashboard') return <DashboardPage />

  const comingSoon = COMING_SOON_ROUTES[path]
  if (comingSoon) {
    return (
      <ComingSoonPage title={comingSoon.title} blurb={comingSoon.blurb} />
    )
  }

  return <LandingPage />
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider>
        <Routes />
      </RouterProvider>
    </MotionConfig>
  )
}
