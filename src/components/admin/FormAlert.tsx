import type { ReactNode } from 'react';

export default function FormAlert({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  const styles = kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}
