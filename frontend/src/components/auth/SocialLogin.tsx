import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

/** Official four-color Google "G" mark, inline so it inherits no network cost. */
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true" fill="none">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

const NOTICE = 'Google sign-in is not connected in this preview yet.'

/**
 * Secondary auth path. OAuth has no backend to talk to yet, so the button
 * reports that honestly instead of pretending a sign-in happened.
 */
export function SocialLogin({ disabled }: { disabled?: boolean }) {
  const [notice, setNotice] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const handleClick = () => {
    setNotice(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setNotice(false), 4000)
  }

  return (
    <div>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-ink-900/10" />
        <span className="text-xs font-medium tracking-[0.08em] text-ink-500">
          or continue with
        </span>
        <span className="h-px flex-1 bg-ink-900/10" />
      </div>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={handleClick}
        disabled={disabled}
        className="mt-4"
      >
        <GoogleMark />
        Continue with Google
      </Button>

      <p aria-live="polite" className="mt-2 min-h-5 text-center text-[0.8125rem] font-medium text-ink-500">
        {notice ? NOTICE : ''}
      </p>
    </div>
  )
}
