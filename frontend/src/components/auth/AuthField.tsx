import type { InputHTMLAttributes, ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { cx } from '@/lib/cx'

type AuthFieldProps = {
  id: string
  label: string
  /** Rendered inside the right edge of the input (e.g. password toggle). */
  trailing?: ReactNode
  /** Shown under the input; also wired to it via aria-describedby. */
  error?: string
  inputRef?: React.Ref<HTMLInputElement>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>

const inputClasses = cx(
  'h-12 w-full rounded-lg border bg-white px-3.5 text-[0.9375rem] text-ink-900',
  'caret-cobalt-600 outline-none placeholder:text-ink-500',
  'transition-[border-color,box-shadow] duration-200 ease-[var(--ease-out-quint)]',
  'border-ink-900/15 hover:border-ink-900/25',
  'focus:border-cobalt-500 focus:ring-4 focus:ring-cobalt-500/15',
)

const errorInputClasses =
  'border-danger-600 hover:border-danger-600 focus:border-danger-600 focus:ring-danger-500/15'

/**
 * Labelled text input used across auth forms. Errors render directly below
 * the field and are announced with it (`aria-describedby` + `aria-invalid`),
 * so screen readers read message and input as one unit.
 */
export function AuthField({
  id,
  label,
  trailing,
  error,
  inputRef,
  ...input
}: AuthFieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-800">
        {label}
      </label>

      <div className="relative">
        <input
          {...input}
          id={id}
          ref={inputRef}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cx(inputClasses, error && errorInputClasses, trailing ? 'pr-12' : undefined)}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
            {trailing}
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          id={errorId}
          className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] leading-snug font-medium text-danger-700"
        >
          <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
