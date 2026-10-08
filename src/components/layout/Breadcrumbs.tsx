import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const labels: Record<string, string> = {
  employees: 'Employees',
  new: 'New',
  edit: 'Edit',
  certificates: 'Certificates',
  generate: 'Generate',
  verification: 'Verification',
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return <span className="text-sm font-medium">Dashboard</span>;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-500">
      <Link to="/" className="hover:text-slate-900">Dashboard</Link>
      {segments.map((seg, i) => {
        const to = '/' + segments.slice(0, i + 1).join('/');
        const label = labels[seg] ?? 'Details';
        const last = i === segments.length - 1;
        return (
          <span key={to} className="flex items-center gap-1">
            <ChevronRight size={14} />
            {last ? <span className="font-medium text-slate-900">{label}</span> : <Link to={to} className="hover:text-slate-900">{label}</Link>}
          </span>
        );
      })}
    </nav>
  );
}
