export type Testimonial = {
  name: string
  role: string
  quote: string
  /** Initials used for the avatar monogram — no photos. */
  initials: string
}

/**
 * Demonstration testimonials written for this preview build.
 * These are not verified customers and no company logos or usage
 * statistics are implied.
 */
export const testimonials: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Frontend Developer',
    initials: 'PS',
    quote:
      'ResumeX AI helped me identify missing keywords and improve the way I described my projects.',
  },
  {
    name: 'Rohan Mehta',
    role: 'Software Engineer',
    initials: 'RM',
    quote:
      'The ATS analysis made it much easier to understand what I needed to improve in my resume.',
  },
  {
    name: 'Ananya Kulkarni',
    role: 'Computer Science Graduate',
    initials: 'AK',
    quote:
      'I could quickly create a clean resume and customize it for different applications.',
  },
]
