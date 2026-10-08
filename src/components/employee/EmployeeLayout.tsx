import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { clearEmployeeSession, isEmployeeAuthenticated } from '../../utils/employeeAuth';
import { ORG_NAME } from '../../utils/constants';

/** Standalone shell for the employee portal (no admin sidebar). */
export default function EmployeeLayout() {
  const navigate = useNavigate();
  useLocation(); // re-render on navigation so the sign-out button reflects session state
  const signedIn = isEmployeeAuthenticated();

  const signOut = () => {
    clearEmployeeSession();
    navigate('/employee/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-indigo-50 via-white to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white"><ShieldCheck size={20} /></div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{ORG_NAME}</div>
              <div className="text-xs text-slate-500">Employee Portal</div>
            </div>
          </div>
          {signedIn && (
            <button className="btn-secondary" onClick={signOut}><LogOut size={16} /> Sign out</button>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">© {new Date().getFullYear()} {ORG_NAME}</footer>
    </div>
  );
}
