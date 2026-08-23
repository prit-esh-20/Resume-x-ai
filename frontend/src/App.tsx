import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { RouterProvider } from '@/lib/router'
import { useRouter } from '@/lib/useRouter'

function Routes() {
  const { path, navigate } = useRouter()

  // Unmatched paths resolve to the site root so no route can strand the
  // user on a blank view.
  useEffect(() => {
    if (path !== '/' && path !== '/login' && path !== '/register') {
      navigate('/', { replace: true })
    }
  }, [path, navigate])

  if (path === '/login') return <LoginPage />
  if (path === '/register') return <RegisterPage />
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
