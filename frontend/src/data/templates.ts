import type { ResumeContent } from './resume'

export type TemplateLayout =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'corporate'
  | 'executive'
  | 'student'

export type Template = {
  id: TemplateLayout
  name: string
  blurb: string
  content: ResumeContent
}

/**
 * Six demonstration templates. Every preview renders real, compact resume
 * content — no photos, charts, skill meters or decorative graphics, so each
 * layout stays parseable by applicant tracking systems.
 *
 * Each entry carries two roles and two projects so the miniature fills a
 * page-shaped frame instead of leaving a large blank area at the bottom.
 * All candidates, employers and contact details are fictional.
 */
export const templates: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    blurb: 'Centered serif header with ruled sections. Reads well in print.',
    content: {
      name: 'Rahul Patil',
      title: 'Software Engineer',
      location: 'Pune, Maharashtra',
      email: 'rahul.patil@example.com',
      phone: '+91 97XXX XXXXX',
      summary:
        'Backend-leaning engineer with three years building Java and Spring Boot services for payments platforms.',
      experience: [
        {
          role: 'Software Engineer',
          org: 'Persistent Systems',
          period: '2023 – Present',
          bullets: [
            'Owned four Spring Boot microservices handling 40k daily transactions.',
            'Introduced contract tests, cutting release regressions by half.',
          ],
        },
        {
          role: 'Associate Engineer',
          org: 'Persistent Systems',
          period: '2022 – 2023',
          bullets: ['Migrated a legacy batch job to a scheduled Kafka consumer.'],
        },
      ],
      projects: [
        {
          name: 'Ledger Reconciliation Engine',
          detail: 'Nightly job that reconciles settlement files across three banks.',
        },
        {
          name: 'Rate Limiter Library',
          detail: 'Token-bucket limiter published as an internal Java package.',
        },
      ],
      education: [
        {
          degree: 'B.E. — Information Technology',
          org: 'Pune Institute of Computer Technology',
          period: '2019 – 2023',
        },
      ],
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Docker', 'AWS'],
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    blurb: 'Left-aligned name with a cobalt rule and compact section labels.',
    content: {
      name: 'Ananya Kulkarni',
      title: 'Frontend Developer',
      location: 'Mumbai, Maharashtra',
      email: 'ananya.kulkarni@example.com',
      phone: '+91 98XXX XXXXX',
      summary:
        'Frontend developer focused on design systems, accessibility and measurable performance work.',
      experience: [
        {
          role: 'Frontend Developer',
          org: 'Zeta',
          period: '2024 – Present',
          bullets: [
            'Shipped a component library now used by six product squads.',
            'Improved Lighthouse performance from 62 to 94 on the onboarding flow.',
          ],
        },
        {
          role: 'Frontend Intern',
          org: 'Zeta',
          period: '2023 – 2024',
          bullets: ['Rebuilt the settings area against the new design tokens.'],
        },
      ],
      projects: [
        {
          name: 'Design Token Pipeline',
          detail: 'Syncs Figma variables to typed CSS custom properties.',
        },
        {
          name: 'Accessibility Audit Kit',
          detail: 'Playwright checks that fail a build on contrast regressions.',
        },
      ],
      education: [
        {
          degree: 'B.Tech — Computer Engineering',
          org: 'VJTI Mumbai',
          period: '2020 – 2024',
        },
      ],
      skills: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Testing Library', 'Figma'],
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    blurb: 'Generous whitespace, hairline dividers, no colour at all.',
    content: {
      name: 'Aditya Deshmukh',
      title: 'Data Analyst',
      location: 'Navi Mumbai, Maharashtra',
      email: 'aditya.deshmukh@example.com',
      phone: '+91 96XXX XXXXX',
      summary:
        'Analyst turning operations data into weekly decisions for supply and pricing teams.',
      experience: [
        {
          role: 'Data Analyst',
          org: 'Swiggy',
          period: '2023 – Present',
          bullets: [
            'Automated a weekly cohort report, saving roughly 10 analyst hours.',
            'Modelled delivery-time variance across 14 city clusters.',
          ],
        },
        {
          role: 'Analytics Associate',
          org: 'Tata 1mg',
          period: '2022 – 2023',
          bullets: ['Maintained the pricing dashboard used by three category teams.'],
        },
      ],
      projects: [
        {
          name: 'Churn Signal Dashboard',
          detail: 'Tracks early churn indicators for subscription customers.',
        },
        {
          name: 'Demand Forecast Notebook',
          detail: 'Weekly SKU-level forecast with a documented error baseline.',
        },
      ],
      education: [
        {
          degree: 'B.Sc. — Statistics',
          org: 'University of Mumbai',
          period: '2019 – 2022',
        },
      ],
      skills: ['SQL', 'Python', 'pandas', 'dbt', 'Power BI', 'Excel'],
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    blurb: 'Structured header band with a two-line contact row.',
    content: {
      name: 'Priya Mehta',
      title: 'Business Analyst',
      location: 'Bengaluru, Karnataka',
      email: 'priya.mehta@example.com',
      phone: '+91 99XXX XXXXX',
      summary:
        'Business analyst bridging product and operations across banking and insurance programmes.',
      experience: [
        {
          role: 'Business Analyst',
          org: 'Infosys',
          period: '2022 – Present',
          bullets: [
            'Ran discovery for a claims workflow used by 900 branch staff.',
            'Authored 40+ user stories with acceptance criteria and test cases.',
          ],
        },
        {
          role: 'Process Associate',
          org: 'Infosys BPM',
          period: '2021 – 2022',
          bullets: ['Documented 12 reconciliation processes ahead of an audit.'],
        },
      ],
      projects: [
        {
          name: 'Claims Intake Redesign',
          detail: 'Mapped the current state and cut intake steps from 11 to 6.',
        },
        {
          name: 'Vendor Scorecard',
          detail: 'Quarterly supplier review model adopted by two business units.',
        },
      ],
      education: [
        {
          degree: 'MBA — Operations',
          org: 'Symbiosis Institute of Business Management',
          period: '2020 – 2022',
        },
      ],
      skills: ['Requirements', 'BPMN', 'SQL', 'Jira', 'Confluence', 'Tableau'],
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    blurb: 'Letter-spaced serif headings for senior, outcome-led profiles.',
    content: {
      name: 'Vikram Shah',
      title: 'Senior Product Manager',
      location: 'Hyderabad, Telangana',
      email: 'vikram.shah@example.com',
      phone: '+91 90XXX XXXXX',
      summary:
        'Product leader with nine years across B2B SaaS, currently owning a platform line with four squads.',
      experience: [
        {
          role: 'Senior Product Manager',
          org: 'Freshworks',
          period: '2021 – Present',
          bullets: [
            'Grew platform adoption from 18% to 47% of the enterprise base.',
            'Led pricing repackaging across three product lines.',
          ],
        },
        {
          role: 'Product Manager',
          org: 'Zoho',
          period: '2017 – 2021',
          bullets: ['Took two reporting modules from discovery to general availability.'],
        },
      ],
      projects: [
        {
          name: 'Partner API Programme',
          detail: 'Launched a public API with 30 integration partners in year one.',
        },
        {
          name: 'Enterprise Onboarding Rework',
          detail: 'Reduced median time-to-first-value from 21 days to 9.',
        },
      ],
      education: [
        {
          degree: 'MBA — Strategy',
          org: 'Indian School of Business',
          period: '2014 – 2016',
        },
      ],
      skills: ['Roadmapping', 'Pricing', 'Discovery', 'SQL', 'Amplitude', 'GTM'],
    },
  },
  {
    id: 'student',
    name: 'Student',
    blurb: 'Education-first order, built for freshers and internship applications.',
    content: {
      name: 'Neha Joshi',
      title: 'Computer Engineering Student',
      location: 'Thane, Maharashtra',
      email: 'neha.joshi@example.com',
      phone: '+91 95XXX XXXXX',
      summary:
        'Final-year computer engineering student looking for a software development internship.',
      experience: [
        {
          role: 'Web Development Intern',
          org: 'Quest Global',
          period: 'Jun 2025 – Aug 2025',
          bullets: [
            'Built an internal leave-tracking tool used by 60 employees.',
            'Wrote the REST layer and its integration tests in Node.js.',
          ],
        },
        {
          role: 'Technical Secretary',
          org: 'Computer Society, KJSIT',
          period: '2024 – 2025',
          bullets: ['Organised a 24-hour hackathon with 180 participants.'],
        },
      ],
      projects: [
        {
          name: 'Campus Placement Portal',
          detail: 'MERN application managing drives, applications and results.',
        },
        {
          name: 'Attendance Vision',
          detail: 'OpenCV attendance prototype built for a semester project.',
        },
      ],
      education: [
        {
          degree: 'B.Tech — Computer Engineering',
          org: 'K. J. Somaiya Institute of Technology',
          period: '2022 – 2026',
          detail: 'CGPA 8.9 / 10',
        },
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'C++'],
    },
  },
]
