/**
 * Admin session storage. Isolated from the employee session: different storage key,
 * and the token is only attached to ADMIN API calls (see api/adminRequestConfig.ts).
 *
 * sessionStorage: the session ends when the tab closes. Swap `storage` for localStorage
 * here if you want admins to stay signed in across browser restarts.
 */
const KEY = 'cft.admin.session';
export const ADMIN_UNAUTHORIZED_EVENT = 'cft:admin-unauthorized';

interface AdminSession {
  accessToken: string;
  type: string;
}

/** Reads the `exp` claim for UX only (not signature verification). */
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

export function saveAdminSession(accessToken: string, type = 'admin'): void {
  try {
    const session: AdminSession = { accessToken, type };
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage unavailable */
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable */
  }
}

export function getAdminToken(): string | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<AdminSession>;
    if (!session.accessToken) return null;
    const exp = jwtExpiryMs(session.accessToken);
    if (exp !== null && exp <= Date.now()) {
      clearAdminSession();
      return null;
    }
    return session.accessToken;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminToken() !== null;
}

/** Ends the admin session only and tells the admin guard to redirect to the login page. */
export function notifyAdminUnauthorized(): void {
  clearAdminSession();
  window.dispatchEvent(new Event(ADMIN_UNAUTHORIZED_EVENT));
}
