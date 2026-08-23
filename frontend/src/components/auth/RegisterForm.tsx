import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react'
import { AuthField } from '@/components/auth/AuthField'
import { PasswordField } from '@/components/auth/PasswordField'
import { SocialLogin } from '@/components/auth/SocialLogin'
import { Button } from '@/components/ui/Button'
import { useRouter } from '@/lib/useRouter'
import { signUp } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/validation'
import { easeOutExpo, softSpring } from '@/animations/motion'
import { cx } from '@/lib/cx'

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  agree?: string
}

function validateName(value: string): string | undefined {
  if (value.trim().length < 2) return 'Please enter your full name.'
}

/** 0–4 score: length first, then character variety. */
function passwordScore(value: string): number {
  if (!value) return 0
  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1
  return Math.max(score, 1)
}

const STRENGTH_LEVELS = [
  { label: 'Weak', bar: 'bg-danger-500', text: 'text-danger-700' },
  { label: 'Fair', bar: 'bg-cobalt-400', text: 'text-cobalt-700' },
  { label: 'Good', bar: 'bg-cobalt-500', text: 'text-cobalt-700' },
  { label: 'Strong', bar: 'bg-signal-500', text: 'text-signal-700' },
] as const

/**
 * Account creation for the preview build. Mirrors `LoginForm`: validation on
 * submit first, then blur once a field has been interacted with; failed
 * submits move focus to the first invalid control; failed registrations move
 * focus to the alert.
 */
export function RegisterForm() {
  const { navigate } = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [created, setCreated] = useState(false)
  const [legalHint, setLegalHint] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const agreeRef = useRef<HTMLInputElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!legalHint) return
    const timer = window.setTimeout(() => setLegalHint(false), 4000)
    return () => window.clearTimeout(timer)
  }, [legalHint])

  const clearServerError = () => setServerError(null)

  const patchError = (key: keyof FieldErrors, error?: string) =>
    setErrors((current) => ({ ...current, [key]: error }))

  const handleLegalClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setLegalHint(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setAttempted(true)
    const nextErrors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      agree: agree ? undefined : 'Please accept the Terms of Service to continue.',
    }
    setErrors(nextErrors)

    if (nextErrors.name) return nameRef.current?.focus()
    if (nextErrors.email) return emailRef.current?.focus()
    if (nextErrors.password) return passwordRef.current?.focus()
    if (nextErrors.agree) return agreeRef.current?.focus()

    setSubmitting(true)
    setServerError(null)

    let result
    try {
      result = await signUp(name.trim(), email.trim(), password)
    } catch {
      result = {
        ok: false as const,
        message: 'Something went wrong on our side. Please try again.',
      }
    } finally {
      setSubmitting(false)
    }

    if (!result.ok) {
      setServerError(result.message)
      requestAnimationFrame(() => alertRef.current?.focus())
      return
    }

    setCreated(true)
  }

  const strength = passwordScore(password)
  const level = STRENGTH_LEVELS[strength - 1]

  return (
    <motion.div layout transition={softSpring} className="overflow-hidden" initial={false}>
      <AnimatePresence mode="wait" initial={false}>
        {created ? (
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
              Account created
            </h2>
            <p className="mt-2 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-500">
              This preview runs without a backend, so no real account was
              registered.
            </p>
            <div className="mt-6 flex w-full flex-col items-center gap-2">
              <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
                Go to sign in
              </Button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="-mx-2 mt-1 rounded-lg px-2 py-2 text-sm font-medium text-cobalt-600 transition-colors duration-200 hover:text-cobalt-700"
              >
                Back to homepage
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
          >
            <AuthField
              id="name"
              label="Full name"
              type="text"
              name="name"
              placeholder="e.g. Aarav Sharma"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                clearServerError()
                if (errors.name && !validateName(event.target.value)) {
                  patchError('name', undefined)
                }
              }}
              onBlur={() => {
                if ((name && !attempted) || attempted) patchError('name', validateName(name))
              }}
              error={errors.name}
              inputRef={nameRef}
              disabled={submitting}
            />

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
              onChange={(event) => {
                setEmail(event.target.value)
                clearServerError()
                if (errors.email && !validateEmail(event.target.value)) {
                  patchError('email', undefined)
                }
              }}
              onBlur={() => {
                if ((email && !attempted) || attempted) patchError('email', validateEmail(email))
              }}
              error={errors.email}
              inputRef={emailRef}
              disabled={submitting}
            />

            <div>
              <PasswordField
                value={password}
                autoComplete="new-password"
                onChange={(value) => {
                  setPassword(value)
                  clearServerError()
                  if (errors.password && !validatePassword(value)) {
                    patchError('password', undefined)
                  }
                }}
                onBlur={() => {
                  if ((password && !attempted) || attempted) {
                    patchError('password', validatePassword(password))
                  }
                }}
                error={errors.password}
                disabled={submitting}
                inputRef={passwordRef}
              />

              {/* Live strength readout at a fixed height — the idle state
                  doubles as the length requirement, so nothing shifts when
                  typing starts */}
              <div aria-live="polite" className="mt-2 flex items-center gap-3">
                <div className="flex flex-1 gap-1" aria-hidden="true">
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        level && step <= strength ? level.bar : 'bg-ink-100'
                      }`}
                    />
                  ))}
                </div>
                <span
                  aria-hidden="true"
                  className={cx('text-xs font-semibold', level ? level.text : 'text-ink-400')}
                >
                  {level ? level.label : 'Min. 8 characters'}
                </span>
                <span className="sr-only">
                  {level ? `Password strength: ${level.label}` : 'Minimum 8 characters'}
                </span>
              </div>
            </div>

            <div>
              <label className="group inline-flex cursor-pointer select-none items-start gap-2.5">
                <input
                  ref={agreeRef}
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => {
                    setAgree(event.target.checked)
                    if (errors.agree && event.target.checked) patchError('agree', undefined)
                  }}
                  aria-invalid={errors.agree ? true : undefined}
                  aria-describedby={errors.agree ? 'agree-error' : undefined}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="mt-px grid size-[1.125rem] shrink-0 place-items-center rounded-[0.3125rem] border border-ink-900/25 bg-white shadow-xs transition-[background-color,border-color] duration-200 ease-[var(--ease-out-quint)] group-hover:border-ink-900/40 peer-checked:border-cobalt-600 peer-checked:bg-cobalt-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt-500 [&>svg]:scale-50 [&>svg]:opacity-0 [&>svg]:transition-all [&>svg]:duration-200 peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
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
                <span className="text-sm leading-snug text-ink-600 transition-colors duration-200 group-hover:text-ink-800">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={handleLegalClick}
                    className="rounded font-medium text-cobalt-600 underline-offset-2 transition-colors duration-200 hover:text-cobalt-700 hover:underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={handleLegalClick}
                    className="rounded font-medium text-cobalt-600 underline-offset-2 transition-colors duration-200 hover:text-cobalt-700 hover:underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              {errors.agree ? (
                <p
                  id="agree-error"
                  className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] leading-snug font-medium text-danger-700"
                >
                  <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
                  {errors.agree}
                </p>
              ) : null}
            </div>

            {/* `contents` keeps this wrapper out of the flex layout when empty */}
            <div className="contents" aria-live="polite">
              {legalHint ? (
                <p className="-mt-2 text-center text-[0.8125rem] font-medium text-ink-500">
                  Legal documents are not available in this preview yet.
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
                  <CircleAlert
                    className="mt-px size-[1.05rem] shrink-0 text-danger-600"
                    aria-hidden="true"
                  />
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
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            <SocialLogin disabled={submitting} label="or sign up with" />
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
