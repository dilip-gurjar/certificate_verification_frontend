import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Disclosure({ title, icon, children, defaultOpen = false }: { title: string; icon?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between gap-2 px-5 py-3 text-left text-sm font-semibold">
        <span className="inline-flex items-center gap-2">{icon}{title}</span>
        <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t border-slate-200 p-5">{children}</div>}
    </div>
  );
}
