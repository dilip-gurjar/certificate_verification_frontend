import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileJson, ShieldCheck } from 'lucide-react';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { PageSkeleton } from '../../components/common/Skeleton';
import Disclosure from '../../components/common/Disclosure';
import JsonViewer from '../../components/common/JsonViewer';
import DidInfo from '../../components/common/DidInfo';
import CertificateActions from '../../components/employee/CertificateActions';
import CertificateDocument from '../../components/certificates/CertificateDocument';
import ProofDetails from '../../components/certificates/ProofDetails';
import { useAsync } from '../../hooks/useAsync';
import { employeePortalApi } from '../../api/employeePortalApi';
import { isEmployeeAuthenticated } from '../../utils/employeeAuth';
import { parseVC } from '../../types/verifiableCredential';
import type { Certificate } from '../../types/certificate';

export default function EmployeeCertificate() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => employeePortalApi.getMyCertificate(), []);

  // The API layer clears the session on a 401; if that happened, send the user back to sign in.
  useEffect(() => {
    if (error && !isEmployeeAuthenticated()) {
      navigate('/employee/login', { replace: true, state: { from: '/employee/certificate', expired: true } });
    }
  }, [error, navigate]);

  if (loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Certificate could not be loaded.'} onRetry={reload} />;

  const record = data.certificate;
  if (!record) {
    return <EmptyState title="No certificate yet" description="A certificate has not been issued for your account yet." action={<Link to="/employee/login" className="btn-secondary">Back</Link>} />;
  }

  const vc = parseVC(record.verifiableCredentials);
  // Adapts the employee response to the shape the shared CertificateDocument expects.
  const cert: Certificate = {
    id: record.id,
    employeeId: '',
    issuedAt: record.issuedAt ?? '',
    verifiableCredentials: record.verifiableCredentials ?? null,
    employee: null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{data.name ? `${data.name}'s certificate` : 'Your certificate'}</h1>
        <p className="mt-1 text-sm text-slate-500">Your employment certificate, backed by a Verifiable Credential.</p>
      </div>

      <CertificateActions shareToken={record.shareToken ?? data.shareToken ?? null} />

      {vc ? (
        <>
          <CertificateDocument cert={cert} vc={vc} />
          <Disclosure title="View VC JSON" icon={<FileJson size={18} />}>
            <JsonViewer value={vc} />
          </Disclosure>
          <Disclosure title="View Proof Details" icon={<ShieldCheck size={18} />}>
            <ProofDetails proof={vc.proof} />
          </Disclosure>
        </>
      ) : (
        <ErrorState message="The credential returned by the server could not be read." />
      )}

      <DidInfo employeeDid={vc?.credentialSubject?.id ?? data.did ?? null} />
    </div>
  );
}
