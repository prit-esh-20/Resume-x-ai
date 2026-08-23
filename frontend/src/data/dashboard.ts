import {
  Briefcase,
  CircleUserRound,
  Download,
  FilePlus2,
  FileText,
  FileUp,
  Gauge,
  History,
  LayoutDashboard,
  MailPlus,
  PencilLine,
  ScanSearch,
  Settings,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { heroResume } from '@/data/resume'
import { templates, type Template } from '@/data/templates'

/* ==========================================================================
   Dashboard mock data — the single swap-in point for the future backend.
   Every string the dashboard renders comes from here; components stay dumb.
   All candidates, companies and metrics are fictional demo data.
   ========================================================================== */

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type NavSection = {
  id: 'workspace' | 'tools' | 'account'
  label: string
  items: NavItem[]
}

/** Sidebar navigation. Routes resolve once their pages are built. */
export const navSections: NavSection[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Resumes', href: '/resumes', icon: FileText },
      { label: 'ATS Analyzer', href: '/ats-analyzer', icon: ScanSearch },
      { label: 'Job Matching', href: '/job-matching', icon: Briefcase },
    ],
  },
  {
    id: 'tools',
    label: 'AI Tools',
    items: [
      { label: 'AI Resume Review', href: '/ai-review', icon: Sparkles },
      { label: 'Cover Letter Generator', href: '/cover-letter', icon: MailPlus },
      { label: 'Resume Import', href: '/import', icon: FileUp },
      { label: 'Version History', href: '/version-history', icon: History },
    ],
  },
]

export const settingsNavItem: NavItem = {
  label: 'Settings',
  href: '/settings',
  icon: Settings,
}

/* ------------------------------------------------------------------- user */

export type DashboardUser = {
  name: string
  firstName: string
  role: string
  email: string
  initials: string
}

export const user: DashboardUser = {
  name: 'Aarav Sharma',
  firstName: 'Aarav',
  role: 'Full Stack Developer',
  email: 'aarav.sharma@example.com',
  initials: 'AS',
}

/** Deterministic time-of-day greeting — no locale surprises in QA. */
export function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ------------------------------------------------------------------ stats */

export type Stat = {
  id: 'resumes' | 'jobMatches' | 'downloads'
  label: string
  value: number
  hint: string
  icon: LucideIcon
}

export const stats: Stat[] = [
  { id: 'resumes', label: 'Total Resumes', value: 3, hint: '1 updated this week', icon: FileText },
  { id: 'jobMatches', label: 'Job Matches', value: 12, hint: '3 new since Monday', icon: Target },
  { id: 'downloads', label: 'Downloads', value: 28, hint: 'PDF exports', icon: Download },
]

export const averageAts = {
  score: 84,
  max: 100,
  verdict: 'Good — room for improvement',
  note: 'Demo score across your analysed resumes.',
}

/* ---------------------------------------------------------------- resumes */

export type DashboardResume = {
  id: string
  title: string
  role: string
  atsScore: number
  updatedLabel: string
  template: Template
}

const ananyaTemplate = templates.find((t) => t.id === 'modern') as Template

/**
 * Miniature documents rendered by `<MiniResume>`. The Aarav entry reuses the
 * exact hero resume content so the product stays consistent page to page;
 * the other two carry fresh fictional content.
 */
export const resumes: DashboardResume[] = [
  {
    id: 'resume-aarav-fullstack',
    title: heroResume.name,
    role: heroResume.title,
    atsScore: 92,
    updatedLabel: 'Updated 2 hours ago',
    template: {
      id: 'minimal',
      name: 'Full Stack Developer Resume',
      blurb: 'Your primary resume.',
      content: heroResume,
    },
  },
  {
    id: 'resume-ananya-frontend',
    title: ananyaTemplate.content.name,
    role: ananyaTemplate.content.title,
    atsScore: 86,
    updatedLabel: 'Updated yesterday',
    template: ananyaTemplate,
  },
  {
    id: 'resume-rohan-swe',
    title: 'Rohan Mehta',
    role: 'Software Engineer',
    atsScore: 78,
    updatedLabel: 'Updated 3 days ago',
    template: {
      id: 'classic',
      name: 'Software Engineer Resume',
      blurb: 'Tailored for backend roles.',
      content: {
        name: 'Rohan Mehta',
        title: 'Software Engineer',
        location: 'Bengaluru, Karnataka',
        email: 'rohan.mehta@example.com',
        phone: '+91 97XXX XXXXX',
        summary:
          'Engineer with four years of experience across Java microservices and cloud infrastructure at product and services firms.',
        experience: [
          {
            role: 'Software Engineer',
            org: 'Infosys',
            period: '2023 – Present',
            bullets: [
              'Owns billing services handling 1.2M events per day on Kubernetes.',
              'Cut p95 checkout latency by 31% through query and cache tuning.',
            ],
          },
          {
            role: 'Systems Engineer',
            org: 'Tata Consultancy Services',
            period: '2021 – 2023',
            bullets: ['Modernised a legacy J2EE claims module to Spring Boot.'],
          },
        ],
        projects: [
          {
            name: 'Service Mesh Rollout',
            detail: 'Led Istio adoption across nine teams with zero-downtime cutovers.',
          },
          {
            name: 'Incident Runbook Suite',
            detail: 'Standardised on-call playbooks adopted org-wide.',
          },
        ],
        education: [
          {
            degree: 'B.E. — Computer Science',
            org: 'RV College of Engineering',
            period: '2017 – 2021',
          },
        ],
        skills: ['Java', 'Spring Boot', 'Kubernetes', 'AWS', 'PostgreSQL', 'Kafka'],
      },
    },
  },
]

/**
 * Flip to `true` to QA the zero-resume state — the dashboard then hides all
 * fake documents until real data exists.
 */
export const SHOW_EMPTY_STATE = false

/* --------------------------------------------------------- recommendations */

export type Recommendation = {
  id: string
  icon: LucideIcon
  title: string
  description: string
  actionLabel: string
  href: string
}

export const recommendations: Recommendation[] = [
  {
    id: 'improve-ats',
    icon: Gauge,
    title: 'Improve your ATS score',
    description:
      'Your latest resume scored 84. Review missing keywords against your target roles.',
    actionLabel: 'Review keywords',
    href: '/ats-analyzer',
  },
  {
    id: 'match-job',
    icon: Target,
    title: 'Match your resume to a job',
    description: 'Paste a job description and see your compatibility instantly.',
    actionLabel: 'Match now',
    href: '/job-matching',
  },
  {
    id: 'complete-profile',
    icon: CircleUserRound,
    title: 'Complete your profile',
    description: 'Add projects and certifications to strengthen every application.',
    actionLabel: 'Add details',
    href: '/settings',
  },
]

/* ------------------------------------------------------------- ai insight */

export const aiInsight = {
  eyebrow: 'AI Career Insight',
  message:
    'Your resume performs well on technical skills, but adding measurable project outcomes could improve your ATS compatibility.',
  ctaLabel: 'Improve with AI',
  ctaHref: '/ai-review',
  footnote: 'Preview insight based on sample data.',
}

/* ---------------------------------------------------------- quick actions */

export type QuickAction = {
  label: string
  href: string
  icon: LucideIcon
}

export const quickActions: QuickAction[] = [
  { label: 'Create Resume', href: '/builder', icon: FilePlus2 },
  { label: 'Analyze Resume', href: '/ats-analyzer', icon: ScanSearch },
  { label: 'Match Job', href: '/job-matching', icon: Target },
  { label: 'Review Resume', href: '/ai-review', icon: Sparkles },
  { label: 'Generate Cover Letter', href: '/cover-letter', icon: MailPlus },
]

/* --------------------------------------------------------------- activity */

export type ActivityItem = {
  id: string
  kind: 'edit' | 'analysis' | 'match' | 'download'
  title: string
  context: string
  timeLabel: string
}

export const activity: ActivityItem[] = [
  {
    id: 'act-1',
    kind: 'edit',
    title: 'Resume updated',
    context: 'Full Stack Developer Resume',
    timeLabel: '2 hours ago',
  },
  {
    id: 'act-2',
    kind: 'analysis',
    title: 'ATS analysis completed',
    context: 'Full Stack Developer Resume · 84/100',
    timeLabel: 'Yesterday',
  },
  {
    id: 'act-3',
    kind: 'match',
    title: 'Job description analyzed',
    context: 'Frontend Developer — Bengaluru',
    timeLabel: '2 days ago',
  },
  {
    id: 'act-4',
    kind: 'download',
    title: 'Resume downloaded',
    context: 'Full Stack Developer Resume · PDF',
    timeLabel: '3 days ago',
  },
]

export const activityIcons: Record<ActivityItem['kind'], LucideIcon> = {
  edit: PencilLine,
  analysis: Gauge,
  match: Target,
  download: Download,
}

/* ---------------------------------------------------------- notifications */

export type Notification = {
  id: string
  title: string
  detail: string
  timeLabel: string
  unread: boolean
}

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Your ATS analysis is ready.',
    detail: 'Full Stack Developer Resume scored 84/100.',
    timeLabel: '2h ago',
    unread: true,
  },
  {
    id: 'notif-2',
    title: '3 new jobs match your profile.',
    detail: 'Frontend Developer · Bengaluru and nearby.',
    timeLabel: 'Yesterday',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Weekly career digest available.',
    detail: 'See how your resume performed this week.',
    timeLabel: '4d ago',
    unread: false,
  },
]
