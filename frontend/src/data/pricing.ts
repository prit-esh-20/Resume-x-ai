export type Plan = {
  id: 'free' | 'pro'
  name: string
  price: string
  cadence?: string
  tagline: string
  badge?: string
  featured: boolean
  cta: string
  /** First entry may be an "Everything in …" roll-up line. */
  includes: string[]
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    tagline: 'Everything you need to write and export a solid first resume.',
    featured: false,
    cta: 'Get Started Free',
    includes: [
      'Resume Builder',
      'Basic ATS Analysis',
      'ATS-friendly templates',
      'PDF Export',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    cadence: '/month',
    tagline: 'Full AI review, job matching and version history for active job hunts.',
    badge: 'Most Popular',
    featured: true,
    cta: 'Start Pro',
    includes: [
      'Everything in Free',
      'AI Resume Reviewer',
      'Advanced ATS Analysis',
      'Job Description Matching',
      'AI Cover Letter',
      'Resume Version History',
      'Unlimited Resumes',
    ],
  },
]
