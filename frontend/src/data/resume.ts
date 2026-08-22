export type ResumeExperience = {
  role: string
  org: string
  period: string
  bullets: string[]
}

export type ResumeProject = {
  name: string
  detail: string
  stack?: string
}

export type ResumeEducation = {
  degree: string
  org: string
  period?: string
  detail?: string
}

export type ResumeContent = {
  name: string
  title: string
  location: string
  email: string
  phone: string
  summary: string
  experience: ResumeExperience[]
  projects: ResumeProject[]
  education: ResumeEducation[]
  skills: string[]
}

/**
 * Demonstration resume shown inside the hero product mockup.
 * All contact details are deliberately fictional.
 */
export const heroResume: ResumeContent = {
  name: 'Aarav Sharma',
  title: 'Full Stack Developer',
  location: 'Mumbai, Maharashtra',
  email: 'aarav.sharma@example.com',
  phone: '+91 98XXX XXXXX',
  summary:
    'Full Stack Developer skilled in React, Node.js and PostgreSQL, focused on building clean and scalable web applications.',
  experience: [
    {
      role: 'Software Development Intern',
      org: 'Tech Mahindra',
      period: 'May 2025 – July 2025',
      bullets: [
        'Built 12 reusable React components adopted across two internal dashboards.',
        'Reduced average API response time by 38% with indexed queries and caching.',
      ],
    },
  ],
  projects: [
    {
      name: 'Smart Resume Analyzer',
      detail:
        'Service that parses resumes and scores them against a job description.',
      stack: 'Python · FastAPI · PostgreSQL',
    },
  ],
  education: [
    {
      degree: 'B.Tech — Computer Engineering',
      org: 'SIES Graduate School of Technology',
      period: '2022 – 2026',
      detail: 'CGPA 8.6 / 10',
    },
  ],
  skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'FastAPI', 'Git'],
}

/** Editor rail sections mirrored by the hero mockup. */
export const editorSections = [
  'Personal Info',
  'Summary',
  'Experience',
  'Projects',
  'Education',
  'Skills',
] as const
