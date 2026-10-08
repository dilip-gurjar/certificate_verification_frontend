import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Award, FilePlus2, LayoutDashboard, LogOut, Menu, ShieldCheck, Users, X, type LucideIcon } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { CFT_DID, ORG_NAME } from '../../utils/constants';
import { adminAuthApi } from '../../api/adminAuthApi';

const nav: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/certificates', label: 'Certificates', icon: Award, end: true },
  { to: '/certificates/generate', label: 'Generate Certificate', icon: FilePlus2 },
  { to: '/verification', label: 'Verify Certificate', icon: ShieldCheck },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const signOut = async () => {
    setSigningOut(true);
    await adminAuthApi.logout();
    navigate('/admin/login', { replace: true });
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center gap-2 px-5 text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600"><ShieldCheck size={18} /></div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">{ORG_NAME}</div>
          <div className="text-xs text-slate-400">Employment credentials</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60 hover:text-white'}`
            }
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
        <div className="mb-1 uppercase tracking-wide">Issuer DID</div>
        <div className="break-all font-mono text-slate-400">{CFT_DID}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64">
            {sidebar}
            <button className="absolute right-2 top-4 text-slate-300" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
        <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        <Breadcrumbs />
        <button className="btn-secondary ml-auto" onClick={() => void signOut()} disabled={signingOut} aria-label="Sign out">
          <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
        </button>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
