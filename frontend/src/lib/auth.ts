export type SignInResult = { ok: true } | { ok: false; message: string }

const GENERIC_ERROR =
  'Unable to sign in. Please check your credentials and try again.'

/**
 * Frontend-only stand-in for `POST /api/auth/login`.
 *
 * Demo contract (deliberately deterministic so states can be QA'd):
 * - any email + an 8+ character password  → success
 * - the literal password "wrong"          → generic auth failure
 *
 * When the real backend lands, replace the body with the API call and keep
 * the same `SignInResult` shape so `LoginForm` needs no changes.
 */
export function signIn(email: string, password: string): Promise<SignInResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      void email
      if (password.toLowerCase() === 'wrong') {
        resolve({ ok: false, message: GENERIC_ERROR })
        return
      }
      resolve({ ok: true })
    }, 1200)
  })
}
