import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileJson, ShieldCheck } from 'lucide-react';
import VerificationBanner from '../../components/verification/VerificationBanner';
import CertificateDocument from '../../components/certificates/CertificateDocument';
import Disclosure from '../../components/common/Disclosure';
import JsonViewer from '../../components/common/JsonViewer';
import DidInfo from '../../components/common/DidInfo';
import EmptyState from '../../components/common/EmptyState';
import { sharedCertificateApi } from '../../api/sharedCertificateApi';
import { ApiError, errorMessage } from '../../api/apiClient';
import { ORG_NAME } from '../../utils/constants';
import type { Certificate } from '../../types/certificate';
import type { SharedCertificateVerification as SharedResult } from '../../types/sharedCertificate';

type State =
  | { phase: 'loading' }
  | { phase: 'done'; data: SharedResult }
  | { phase: 'notfound' }
  | { phase: 'error'; message: string };

/** Public page for /verify/certificate/:shareToken. Requires no login and sends no JWT. */
export default function SharedCertificateVerification() {
  const { shareToken = '' } = useParams();
  const [state, setState] = useState<State>({ phase: 'loading' });

  const load = useCallback(async () => {
    setState({ phase: 'loading' });
    try {
      setState({ phase: 'done', data: await sharedCertificateApi.verify(shareToken) });
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) setState({ phase: 'notfound' });
      else setState({ phase: 'error', message: errorMessage(e) });
    }
  }, [shareToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const renderBody = () => {
    if (state.phase === 'loading') return <VerificationBanner status="loading" onVerify={() => void load()} />;
    if (state.phase === 'notfound') {
      return <EmptyState title="Certificate not found" description="This link may be incorrect, or the certificate is no longer available." />;
    }
    if (state.phase === 'error') return <VerificationBanner status="error" error={state.message} onVerify={() => void load()} />;

    const { data } = state;
    const vc = data.verifiableCredentials;
    const cert: Certificate = {
      id: data.certificateId ?? '',
      employeeId: '',
      issuedAt: data.issuedAt ?? '',
      verifiableCredentials: vc,
      employee: null,
    };
    return (
      <div className="space-y-5">
        <VerificationBanner status="done" result={{ verified: data.verified, error: data.error }} onVerify={() => void load()} />
        {vc ? (
          <>
            <CertificateDocument cert={cert} vc={vc} />
            <Disclosure title="View Verifiable Credential" icon={<FileJson size={18} />}>
              <JsonViewer value={vc} />
            </Disclosure>
            <DidInfo employeeDid={vc.credentialSubject?.id ?? null} />
          </>
        ) : (
          <div className="card p-5 text-sm text-slate-500">Certificate details were not included in the verification response.</div>
        )}
      </div>
    );
  };

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
        <h1 className="mb-1 text-xl font-semibold">Shared certificate</h1>
        <p className="mb-6 text-sm text-slate-500">Check who issued this certificate, who it is about, and whether it is cryptographically verified.</p>
        {renderBody()}
      </main>
    </div>
  );
}
