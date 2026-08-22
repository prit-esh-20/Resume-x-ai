/** Tiny class-name joiner — falsy entries are dropped. */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
