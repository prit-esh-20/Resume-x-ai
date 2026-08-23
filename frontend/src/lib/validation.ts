export function validateEmail(value: string): string | undefined {
  const email = value.trim()
  if (!email) return 'Please enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.'
  }
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Please enter your password.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
}
