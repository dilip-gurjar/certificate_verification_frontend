import type { AxiosRequestConfig } from 'axios';
import { getAdminToken } from '../utils/adminAuth';

/**
 * Optional: set VITE_ADMIN_USE_COOKIES=true if your backend authenticates admins ONLY via the
 * HttpOnly cookie. That requires CORS `credentials: true` + an explicit origin on the backend.
 * Default (false) uses the Bearer access token and never sends cookies.
 */
const USE_COOKIES = import.meta.env.VITE_ADMIN_USE_COOKIES === 'true';

/** Config for authenticated ADMIN calls: attaches the admin token only (never the employee token). */
export function adminRequestConfig(): AxiosRequestConfig {
  const token = getAdminToken();
  return { headers: token ? { Authorization: `Bearer ${token}` } : {}, withCredentials: USE_COOKIES };
}


export function adminPublicConfig(): AxiosRequestConfig {
  return { withCredentials: USE_COOKIES };
}
