export type NavLink = {
  label: string
  href: string
}

/**
 * Navigation order is intentional and must stay:
 * Features → Templates → ATS Breakdown → Pricing
 */
export const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Templates', href: '#templates' },
  { label: 'ATS Breakdown', href: '#ats-breakdown' },
  { label: 'Pricing', href: '#pricing' },
]
