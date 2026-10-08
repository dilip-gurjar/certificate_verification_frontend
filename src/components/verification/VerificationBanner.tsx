import { CheckCircle2, Loader2, ShieldQuestion, XCircle, AlertTriangle } from 'lucide-react';
import type { VerifyState } from '../../hooks/useVerify';

interface Props extends VerifyState {
  onVerify: () => void;
}

export default function VerificationBanner({ status, result, error, onVerify }: Props) {
  if (status === 'loading') {
    return (
      <div className="card flex items-center gap-3 p-5 text-slate-600">
        <Loader2 className="animate-spin" size={22} />
        <span className="text-sm font-medium">Verifying certificate…</span>
      </div>
    );
  }

  if (status === 'done' && result?.verified) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={28} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-emerald-900">✓ Certificate Verified</h2>
            <p className="mt-1 text-sm text-emerald-800">The certificate was successfully verified using the issuer's cryptographic proof.</p>
          </div>
          <button className="btn-secondary hidden sm:inline-flex" onClick={onVerify}>Verify again</button>
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 shrink-0 text-red-600" size={28} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-red-900">✕ Certificate Verification Failed</h2>
            <p className="mt-1 text-sm text-red-800">Cryptographic verification failed.</p>
            {result?.error && <p className="mt-2 break-words rounded bg-red-100 px-3 py-2 font-mono text-xs text-red-900">{result.error}</p>}
          </div>
          <button className="btn-secondary hidden sm:inline-flex" onClick={onVerify}>Verify again</button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={28} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-amber-900">Verification could not be completed</h2>
            <p className="mt-1 text-sm text-amber-800">{error}</p>
          </div>
          <button className="btn-secondary" onClick={onVerify}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card flex items-center gap-3 p-5">
      <ShieldQuestion className="shrink-0 text-slate-400" size={28} />
      <div className="flex-1">
        <h2 className="text-base font-semibold">Not verified yet</h2>
        <p className="text-sm text-slate-500">Run verification to check the certificate's cryptographic proof.</p>
      </div>
      <button className="btn-primary" onClick={onVerify}>Verify</button>
    </div>
  );
}
