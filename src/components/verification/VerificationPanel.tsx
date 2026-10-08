import { useEffect } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { useVerify } from '../../hooks/useVerify';
import { certificateApi } from '../../api/certificateApi';
import { getVC } from '../../utils/certificate';
import VerificationBanner from './VerificationBanner';
import CertificateSummary from './CertificateSummary';
import DidInfo from '../common/DidInfo';
import { Skeleton } from '../common/Skeleton';

/**
 * Runs GET /certificate/{id}/verify for the given ID and shows the outcome.
 * Verification does not depend on the certificate lookup succeeding.
 */
export default function VerificationPanel({ certificateId, showDidInfo = true }: { certificateId: string; showDidInfo?: boolean }) {
  const { data: cert, loading, error } = useAsync(() => certificateApi.getById(certificateId), [certificateId]);
  const verify = useVerify();
  const { run } = verify;

  useEffect(() => {
    void run(certificateId);
  }, [certificateId, run]);

  const vc = cert ? getVC(cert) : null;

  return (
    <div className="space-y-5">
      <VerificationBanner status={verify.status} result={verify.result} error={verify.error} onVerify={() => void run(certificateId)} />

      {loading ? (
        <div className="card space-y-3 p-5"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/3" /></div>
      ) : cert ? (
        <CertificateSummary cert={cert} vc={vc} />
      ) : (
        <div className="card p-5 text-sm text-slate-500">
          {error ?? 'Certificate details could not be found for this ID.'}
        </div>
      )}

      {showDidInfo && <DidInfo employeeDid={vc?.credentialSubject?.id ?? undefined} />}
    </div>
  );
}
