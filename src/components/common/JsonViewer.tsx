import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function JsonViewer({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(value, null, 2);

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
    <div className="relative">
      <button type="button" onClick={copy} className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-slate-700 px-2 py-1 text-xs text-slate-100 hover:bg-slate-600">
        {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="max-h-[28rem] overflow-auto rounded-lg bg-slate-900 p-4 pt-9 text-xs leading-relaxed text-slate-100">{text}</pre>
    </div>
  );
}
