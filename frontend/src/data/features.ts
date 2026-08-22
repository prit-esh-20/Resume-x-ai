import {
  FilePenLine,
  Gauge,
  Target,
  Sparkles,
  FileUp,
  MailPlus,
  type LucideIcon,
} from 'lucide-react'

export type Feature = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  /** Short label rendered inside the card's corner meta slot. */
  meta: string
}

export const features: Feature[] = [
  {
    id: 'builder',
    title: 'AI Resume Builder',
    description:
      'Build your resume with a live, editable preview and professional formatting.',
    icon: FilePenLine,
    meta: 'Live preview',
  },
  {
    id: 'ats-analyzer',
    title: 'ATS Analyzer',
    description:
      'Understand how your resume performs against applicant tracking systems.',
    icon: Gauge,
    meta: 'Score + fixes',
  },
  {
    id: 'job-matcher',
    title: 'Job Matcher',
    description:
      'Compare your resume against a specific job description and identify missing keywords.',
    icon: Target,
    meta: 'Keyword gaps',
  },
  {
    id: 'reviewer',
    title: 'AI Resume Reviewer',
    description:
      'Get intelligent feedback on clarity, impact, phrasing, and recruiter readability.',
    icon: Sparkles,
    meta: 'Line-by-line',
  },
  {
    id: 'import',
    title: 'Resume Import',
    description: 'Turn an existing PDF or DOCX resume into an editable resume.',
    icon: FileUp,
    meta: 'PDF · DOCX',
  },
  {
    id: 'cover-letter',
    title: 'AI Cover Letter',
    description:
      'Generate a personalized cover letter based on your resume and target job.',
    icon: MailPlus,
    meta: 'Role-aware',
  },
]
