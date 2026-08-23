import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { AuthField } from '@/components/auth/AuthField'

type PasswordFieldProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  autoComplete?: string
  inputRef?: React.Ref<HTMLInputElement>
  disabled?: boolean
}

/**
 * Password input with an accessible show/hide control. The icon crossfades
 * in place (no layout shift) and the toggle exposes both a dynamic label and
 * `aria-pressed` so assistive tech can read the current state.
 */
export function PasswordField({
  value,
  onChange,
  onBlur,
  error,
  hint,
  autoComplete = 'current-password',
  inputRef,
  disabled,
}: PasswordFieldProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)

  return (
    <AuthField
      id={id}
      label="Password"
      type={visible ? 'text' : 'password'}
      name="password"
      placeholder="Enter your password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      error={error}
      hint={hint}
      autoComplete={autoComplete}
      spellCheck={false}
      autoCapitalize="none"
      inputRef={inputRef}
      disabled={disabled}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="grid size-9 place-items-center rounded-full text-ink-400 transition-[background-color,color] duration-200 hover:bg-ink-900/6 hover:text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt-500"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={visible ? 'eye-off' : 'eye'}
              className="grid place-items-center"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              {visible ? (
                <EyeOff className="size-[1.05rem]" aria-hidden="true" />
              ) : (
                <Eye className="size-[1.05rem]" aria-hidden="true" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      }
    />
  )
}
