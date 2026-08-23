import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react'
import { AuthField } from '@/components/auth/AuthField'
import { PasswordField } from '@/components/auth/PasswordField'
import { SocialLogin } from '@/components/auth/SocialLogin'
import { Button } from '@/components/ui/Button'
import { useRouter } from '@/lib/useRouter'
import { signIn } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/validation'
import { easeOutExpo, softSpring } from '@/animations/motion'

const REMEMBER_KEY = 'resumex:remembered-email'

type FieldErrors = { email?: string; password?: string }

function readRememberedEmail() {
  try {
    return window.localStorage.getItem(REMEMBER_KEY) ?? ''
  } catch {
    return ''
  }
}

/**
 * Email + password sign-in for the preview build.
 *
 * Validation runs on submit first, then on blur once a field has been
 * interacted with — nothing is flagged before the user has had a chance to
 * type. A failed submit moves focus to the first invalid field; a failed
 * sign-in moves focus to the alert so the message is announced reliably.
 */
export function LoginForm() {
  const { navigate } = useRouter()
  const [email, setEmail] = useState(readRememberedEmail)
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => readRememberedEmail() !== '')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [signedIn, setSignedIn] = useState(false)
  const [forgotHint, setForgotHint] = useState(false)

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!forgotHint) return
    const timer = window.setTimeout(() => setForgotHint(false), 4000)
    return () => window.clearTimeout(timer)
  }, [forgotHint])

  const clearServerError = () => setServerError(null)

  const handleEmailChange = (value: string) => {
    setEmail(value)
    clearServerError()
    if (errors.email && !validateEmail(value)) {
      setErrors((current) => ({ ...current, email: undefined }))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    clearServerError()
    if (errors.password && !validatePassword(value)) {
      setErrors((current) => ({ ...current, password: undefined }))
    }
  }

  const handleEmailBlur = () => {
    // Pre-submit, only judge a field the user actually filled in — tabbing
    // through untouched fields must not trigger errors.
    if ((email && !attempted) || attempted) {
      setErrors((current) => ({ ...current, email: validateEmail(email) }))
    }
  }

  const handlePasswordBlur = () => {
    if ((password && !attempted) || attempted) {
      setErrors((current) => ({ ...current, password: validatePassword(password) }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setAttempted(true)
    const nextErrors: FieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    }
    setErrors(nextErrors)

    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }

    setSubmitting(true)
    setServerError(null)

    let result
    try {
      result = await signIn(email.trim(), password)
    } catch {
      result = {
        ok: false as const,
        message: 'Something went wrong on our side. Please try again.',
      }
    } finally {
      setSubmitting(false)
    }

    if (result.ok) {
      try {
        if (remember) window.localStorage.setItem(REMEMBER_KEY, email.trim())
        else window.localStorage.removeItem(REMEMBER_KEY)
      } catch {
        /* storage unavailable (private mode) — sign-in itself still stands */
      }
      setSignedIn(true)
      return
    }

    setServerError(result.message)
    requestAnimationFrame(() => alertRef.current?.focus())
  }

  const resetToForm = () => {
    setSignedIn(false)
    setPassword('')
    setAttempted(false)
    setErrors({})
  }

  return (
    <motion.div
      layout
      transition={softSpring}
      className="overflow-hidden"
      initial={false}
    >
      <AnimatePresence mode="wait" initial={false}>
        {signedIn ? (
          <motion.div
            key="success"
            className="flex flex-col items-center px-1 py-6 text-center sm:py-8"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            <span
              className="grid size-14 place-items-center rounded-full bg-signal-50 ring-1 ring-signal-200"
              aria-hidden="true"
            >
              <CheckCircle2 className="size-7 text-signal-600" />
            </span>
            <h2 className="mt-4 text-xl font-bold tracking-[-0.02em] text-ink-900">
              You&rsquo;re signed in
            </h2>
            <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-500">
              This preview runs without a backend, so no real account was
              authenticated.
            </p>
            <div className="mt-6 flex w-full flex-col items-center gap-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => navigate('/')}
              >
                Back to ResumeX AI
              </Button>
              <button
                type="button"
                onClick={resetToForm}
                className="-mx-2 mt-1 rounded-lg px-2 py-2 text-sm font-medium text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
              >
                Use a different account
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            <AuthField
              id="email"
              label="Email address"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              onBlur={handleEmailBlur}
              error={errors.email}
              inputRef={emailRef}
              disabled={submitting}
            />

            <PasswordField
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              error={errors.password}
              disabled={submitting}
              inputRef={passwordRef}
            />

            <div className="-my-1.5 flex items-center justify-between gap-3 py-1">
              <label className="group inline-flex cursor-pointer select-none items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="grid size-[1.125rem] place-items-center rounded-[0.3125rem] border border-ink-900/25 bg-white shadow-xs transition-[background-color,border-color] duration-200 ease-[var(--ease-out-quint)] group-hover:border-ink-900/40 peer-checked:border-cobalt-600 peer-checked:bg-cobalt-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt-500 [&>svg]:scale-50 [&>svg]:opacity-0 [&>svg]:transition-all [&>svg]:duration-200 peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
                >
                  <svg viewBox="0 0 12 12" className="size-3" fill="none">
                    <path
                      d="M2.5 6.4 4.8 8.7 9.5 3.6"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink-600 transition-colors duration-200 group-hover:text-ink-800">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => setForgotHint(true)}
                className="-mx-1 rounded-lg px-1 py-1.5 text-sm font-medium text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
              >
                Forgot password?
              </button>
            </div>

            {/* `contents` keeps these wrappers out of the flex layout when
                empty, so reserved message slots never add phantom gaps */}
            <div className="contents" aria-live="polite">
              {forgotHint ? (
                <p className="-mt-2 text-center text-[0.8125rem] font-medium text-ink-500">
                  Password recovery is not available in this preview yet.
                </p>
              ) : null}
            </div>

            <div className="contents" aria-live="polite">
              {serverError ? (
                <div
                  ref={alertRef}
                  tabIndex={-1}
                  role="alert"
                  className="-mt-1.5 flex items-start gap-2.5 rounded-lg bg-danger-50 p-3 ring-1 ring-danger-200 outline-none"
                >
                  <CircleAlert className="mt-px size-[1.05rem] shrink-0 text-danger-600" aria-hidden="true" />
                  <p className="text-[0.8125rem] leading-snug font-medium text-danger-700">
                    {serverError}
                  </p>
                </div>
              ) : null}
            </div>

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? (
                <>
                  <LoaderCircle className="size-[1.05rem] animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <SocialLogin disabled={submitting} />
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
