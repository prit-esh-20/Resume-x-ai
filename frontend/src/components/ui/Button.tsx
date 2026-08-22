import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'

type Variant = 'primary' | 'secondary' | 'invert' | 'outlineInvert' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'whitespace-nowrap select-none transition-[transform,box-shadow,background-color,border-color,color] ' +
  'duration-200 ease-[var(--ease-out-quint)] active:translate-y-0 active:scale-[0.985] ' +
  'disabled:pointer-events-none disabled:opacity-45'

const variants: Record<Variant, string> = {
  primary:
    'text-white bg-linear-to-b from-cobalt-500 to-cobalt-600 shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(13_21_38/0.16),0_10px_24px_-8px_var(--color-cobalt-600)] ' +
    'hover:-translate-y-px hover:from-cobalt-400 hover:to-cobalt-500 ' +
    'hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.24),0_2px_4px_rgb(13_21_38/0.14),0_16px_34px_-10px_var(--color-cobalt-500)]',
  secondary:
    'text-ink-800 bg-white ring-1 ring-ink-900/10 shadow-xs ' +
    'hover:-translate-y-px hover:bg-ink-50 hover:ring-ink-900/16 hover:shadow-sm',
  invert:
    'text-ink-900 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2),0_12px_28px_-10px_rgb(0_0_0/0.5)] ' +
    'hover:-translate-y-px hover:bg-ink-50 hover:shadow-[0_2px_4px_rgb(0_0_0/0.24),0_18px_38px_-12px_rgb(0_0_0/0.6)]',
  outlineInvert:
    'text-white/90 bg-white/5 ring-1 ring-white/16 backdrop-blur-sm ' +
    'hover:-translate-y-px hover:text-white hover:bg-white/10 hover:ring-white/28',
  quiet:
    'text-ink-600 hover:text-ink-900 hover:bg-ink-900/5',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-[3.25rem] px-7 text-base',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  fullWidth?: boolean
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: never
  }

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    href: string
  }

export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    fullWidth,
    ...rest
  } = props

  const classes = cx(
    base,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  )

  if ('href' in rest && typeof rest.href === 'string') {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
