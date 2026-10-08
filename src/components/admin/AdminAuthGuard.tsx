import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_UNAUTHORIZED_EVENT, isAdminAuthenticated } from '../../utils/adminAuth';

/** Protects admin routes using the ADMIN session only (never the employee session). */
export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.pathname + location.search;

  // A 401 on any admin API call clears the admin session and fires this event.
  useEffect(() => {
    const onUnauthorized = () => navigate('/admin/login', { replace: true, state: { from, expired: true } });
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, onUnauthorized);
  }, [navigate, from]);

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from }} />;
  }
  return <>{children}</>;
}
