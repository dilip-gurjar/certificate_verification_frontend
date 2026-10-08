import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ORG_NAME } from '../../utils/constants';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export default function AdminAuthLayout({ title, subtitle, children, footer, wide }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-white px-4 py-10">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white"><ShieldCheck size={22} /></div>
        <div className="leading-tight">
          <div className="text-base font-semibold">{ORG_NAME}</div>
          <div className="text-xs text-slate-500">Admin Console</div>
        </div>
      </div>
      <div className={`card w-full p-6 sm:p-8 ${wide ? 'max-w-xl' : 'max-w-md'}`}>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-4 text-center text-sm text-slate-600">{footer}</div>}
    </div>
  );
}
