/**
 * Employee session storage. Deliberately separate from anything admin-related:
 * its own storage key, and the token is only attached by employeePortalApi
 * (never by the shared axios instance), so admin requests can never carry it.
 *
 * sessionStorage is used so the JWT disappears when the tab is closed.
 */
const KEY = 'cft.employee.session';

interface EmployeeSession {
  accessToken: string;
  type: 'employee';
}

/** Reads the `exp` claim for UX only (this is not signature verification). */
function jwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const exp = (JSON.parse(json) as { exp?: unknown }).exp;
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export function saveEmployeeSession(accessToken: string): void {
  try {
    const session: EmployeeSession = { accessToken, type: 'employee' };
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }
}

export function clearEmployeeSession(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

export function getEmployeeToken(): string | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<EmployeeSession>;
    if (session.type !== 'employee' || !session.accessToken) return null;
    const exp = jwtExpiryMs(session.accessToken);
    if (exp !== null && exp <= Date.now()) {
      clearEmployeeSession();
      return null;
    }
    return session.accessToken;
  } catch {
    return null;
  }
}

export function isEmployeeAuthenticated(): boolean {
  return getEmployeeToken() !== null;
}
