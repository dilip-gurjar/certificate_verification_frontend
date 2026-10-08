import { useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import VerificationPanel from '../../components/verification/VerificationPanel';
import { ORG_NAME } from '../../utils/constants';

/** Standalone public page (no admin navigation) reached from the QR code. */
export default function PublicVerification() {
  const { certificateId = '' } = useParams();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white"><ShieldCheck size={18} /></div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">{ORG_NAME}</div>
            <div className="text-xs text-slate-500">Employment certificate verification</div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-xl font-semibold">Certificate verification</h1>
        <p className="mb-6 text-sm text-slate-500">Who issued this certificate, who it is about, when it was issued, and whether it is cryptographically verified.</p>
        <VerificationPanel certificateId={certificateId} />
      </main>
    </div>
  );
}
