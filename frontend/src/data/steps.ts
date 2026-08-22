import {
  FilePenLine,
  ScanSearch,
  SlidersHorizontal,
  Target,
  Send,
  type LucideIcon,
} from 'lucide-react'

export type Step = {
  index: string
  title: string
  description: string
  icon: LucideIcon
}

export const steps: Step[] = [
  {
    index: '01',
    title: 'Build',
    description: 'Create or import your resume.',
    icon: FilePenLine,
  },
  {
    index: '02',
    title: 'Analyze',
    description: 'Let AI review your resume.',
    icon: ScanSearch,
  },
  {
    index: '03',
    title: 'Optimize',
    description: 'Improve keywords, clarity, and impact.',
    icon: SlidersHorizontal,
  },
  {
    index: '04',
    title: 'Match',
    description: 'Compare your resume against the target job.',
    icon: Target,
  },
  {
    index: '05',
    title: 'Apply',
    description: 'Download and start applying.',
    icon: Send,
  },
]
