import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { Eyebrow } from './Eyebrow'
import { cx } from '@/lib/cx'

type SectionHeadingProps = {
  eyebrow?: string
  eyebrowIcon?: ReactNode
  title: ReactNode
  description?: ReactNode
  align?: 'center' | 'start'
  tone?: 'light' | 'dark'
  className?: string
  /** Heading level for correct document outline. */
  as?: 'h2' | 'h3'
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = 'center',
  tone = 'light',
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cx(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow icon={eyebrowIcon} tone={tone}>
          {eyebrow}
        </Eyebrow>
      ) : null}

      <Tag
        className={cx(
          'max-w-[22ch] text-[clamp(1.75rem,1.1rem+2.4vw,2.875rem)] leading-[1.08]',
          tone === 'dark' && 'text-white',
        )}
      >
        {title}
      </Tag>

      {description ? (
        <p
          className={cx(
            'max-w-[54ch] text-[1.0625rem] leading-[1.6]',
            tone === 'dark' ? 'text-ink-300' : 'text-ink-500',
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
