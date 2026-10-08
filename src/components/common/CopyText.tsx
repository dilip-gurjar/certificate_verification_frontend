import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyText({ value, truncate = true }: { value?: string | number | null; truncate?: boolean }) {
  const [copied, setCopied] = useState(false);
  if (value === undefined || value === null || value === '') return <span className="text-slate-400">—</span>;
  const text = String(value);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs">
      <span className={truncate ? 'inline-block max-w-[9rem] truncate align-middle' : 'break-all'} title={text}>{text}</span>
      <button type="button" onClick={copy} className="shrink-0 text-slate-400 hover:text-slate-700" aria-label="Copy">
        {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
      </button>
    </span>
  );
}
