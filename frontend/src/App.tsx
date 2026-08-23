import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RouterProvider } from '@/lib/router'
import { useRouter } from '@/lib/useRouter'

function Routes() {
  const { path, navigate } = useRouter()

  // Unmatched paths — including /register, which arrives with the next page —
  // resolve to the site root so no route can strand the user on a blank view.
  useEffect(() => {
    if (path !== '/' && path !== '/login') {
      navigate('/', { replace: true })
    }
  }, [path, navigate])

  if (path === '/login') return <LoginPage />
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
