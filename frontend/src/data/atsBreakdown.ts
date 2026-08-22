/** Demonstration values only — these do not represent real user results. */
export const atsScore = {
  value: 92,
  max: 100,
  verdict: 'Excellent Match',
}

export type AtsFactor = {
  label: string
  value: number
  hint: string
}

export const atsFactors: AtsFactor[] = [
  {
    label: 'Formatting',
    value: 96,
    hint: 'Single-column, parseable structure with standard section headings.',
  },
  {
    label: 'Keywords',
    value: 91,
    hint: 'Role-relevant terminology matched against the target job description.',
  },
  {
    label: 'Skills',
    value: 94,
    hint: 'Technical and tooling coverage measured against the role.',
  },
  {
    label: 'Experience',
    value: 88,
    hint: 'Impact statements checked for action verbs and measurable outcomes.',
  },
  {
    label: 'Projects',
    value: 90,
    hint: 'Scope, stack and outcome described in recruiter-readable language.',
  },
]

/** Signals surfaced next to the score to explain what the analyzer checks. */
export const atsSignals: string[] = [
  'Parseable single-column layout',
  'Standard section headings',
  'No tables, text boxes or images',
  'Embedded, selectable text',
]
