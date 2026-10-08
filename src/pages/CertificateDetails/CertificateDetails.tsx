import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FileJson, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { PageSkeleton } from '../../components/common/Skeleton';
import Disclosure from '../../components/common/Disclosure';
import JsonViewer from '../../components/common/JsonViewer';
import DidInfo from '../../components/common/DidInfo';
import CertificateDocument from '../../components/certificates/CertificateDocument';
import ProofDetails from '../../components/certificates/ProofDetails';
import CertificateQr from '../../components/certificates/CertificateQr';
import VerificationBanner from '../../components/verification/VerificationBanner';
import { useAsync } from '../../hooks/useAsync';
import { useVerify } from '../../hooks/useVerify';
import { certificateApi } from '../../api/certificateApi';
import { getVC } from '../../utils/certificate';

export default function CertificateDetails() {
  const { id = '' } = useParams();
  const { data: cert, loading, error, reload } = useAsync(() => certificateApi.getById(id), [id]);
  const verify = useVerify();
  const { run } = verify;

  useEffect(() => {
    if (cert) void run(cert.id);
  }, [cert, run]);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!cert) return <EmptyState title="Certificate not found" description="No certificate exists with this ID." action={<Link to="/certificates" className="btn-primary">Back to certificates</Link>} />;

  const vc = getVC(cert);

  return (
    <>
      <PageHeader
        title="Certificate"
        description="Human-readable employment certificate backed by a Verifiable Credential."
        actions={
          <>
            <Link to={`/employees/${cert.employeeId}`} className="btn-secondary">View Employee</Link>
            <Link to={`/verification/${cert.id}`} className="btn-secondary"><ShieldCheck size={16} /> Verification page</Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <VerificationBanner status={verify.status} result={verify.result} error={verify.error} onVerify={() => void run(cert.id)} />
          <CertificateDocument cert={cert} vc={vc} />

          <Disclosure title="View Verifiable Credential" icon={<FileJson size={18} />}>
            {vc ? <JsonViewer value={vc} /> : <p className="text-sm text-slate-500">The stored credential could not be parsed.</p>}
          </Disclosure>
          <Disclosure title="View Proof Details" icon={<ShieldCheck size={18} />}>
            <ProofDetails proof={vc?.proof} />
          </Disclosure>
        </div>

        <div className="space-y-6">
          <DidInfo employeeDid={vc?.credentialSubject?.id ?? null} />
          <CertificateQr certificateId={cert.id} />
        </div>
      </div>
    </>
  );
}
