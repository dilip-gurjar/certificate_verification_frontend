import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isEmployeeAuthenticated } from '../../utils/employeeAuth';

/** Protects employee-only pages using the employee session (never admin state). */
export default function EmployeeAuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!isEmployeeAuthenticated()) {
    return <Navigate to="/employee/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
