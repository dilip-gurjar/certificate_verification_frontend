import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Award, FilePlus2, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import { PageSkeleton } from '../../components/common/Skeleton';
import Badge from '../../components/common/Badge';
import Field from '../../components/common/Field';
import CopyText from '../../components/common/CopyText';
import DidInfo from '../../components/common/DidInfo';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import GenerateCertificateDialog from '../../components/employees/GenerateCertificateDialog';
import { useAsync } from '../../hooks/useAsync';
import { useVerify } from '../../hooks/useVerify';
import { employeeApi } from '../../api/employeeApi';
import { certificateApi } from '../../api/certificateApi';
import { errorMessage } from '../../api/apiClient';
import { formatDate } from '../../utils/format';
import { certificateTypeLabel, findEmployeeCertificate, getVC, issuerOf } from '../../utils/certificate';

export default function EmployeeDetails() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(async () => {
    const [employee, certificates] = await Promise.all([employeeApi.get(id), certificateApi.list()]);
    return { employee, certificates };
  }, [id]);
  const verify = useVerify();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);

  if (loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Employee not found.'} onRetry={reload} />;

  const { employee, certificates } = data;
  const cert = findEmployeeCertificate(employee, certificates);
  const vc = cert ? getVC(cert) : null;

  const remove = async () => {
    setDeleting(true);
    try {
      await employeeApi.remove(employee.id);
      toast.success('Employee deleted');
      navigate('/employees');
    } catch (e) {
      toast.error(errorMessage(e));
      setDeleting(false);
    }
  };

  const verifyBadge =
    verify.status === 'done' ? (verify.result?.verified ? <Badge variant="success">Verified ✓</Badge> : <Badge variant="error">Verification Failed ✕</Badge>)
    : verify.status === 'error' ? <Badge variant="warning">Could not verify</Badge>
    : verify.status === 'loading' ? <Badge variant="neutral">Verifying…</Badge>
    : <Badge variant="neutral">Not verified yet</Badge>;

  return (
    <>
      <PageHeader
        title={employee.name}
        description="Employee details and certificate information."
        actions={
          <>
            <Link to={`/employees/${employee.id}/edit`} className="btn-secondary"><Pencil size={16} /> Edit Employee</Link>
            {cert ? (
              <>
                <Link to={`/certificates/${cert.id}`} className="btn-secondary"><Award size={16} /> View Certificate</Link>
                <button className="btn-primary" onClick={() => void verify.run(cert.id)} disabled={verify.status === 'loading'}><ShieldCheck size={16} /> Verify Certificate</button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => setGenerating(true)}><FilePlus2 size={16} /> Generate Certificate</button>
            )}
            <button className="btn-secondary text-red-600" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Delete</button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-5">
            <h2 className="mb-4 text-sm font-semibold">Employee information</h2>
            <dl className="grid gap-5 sm:grid-cols-2">
              <Field label="Name">{employee.name}</Field>
              <Field label="ID"><CopyText value={employee.id} truncate={false} /></Field>
              <Field label="Work Email">{employee.workEmail}</Field>
              <Field label="Personal Email">{employee.personalEmail || '—'}</Field>
              <Field label="Joining Date">{formatDate(employee.joiningDate)}</Field>
              <Field label="Leaving Date">{formatDate(employee.leavingDate)}</Field>
              <div className="sm:col-span-2"><Field label="Employee DID"><CopyText value={employee.did} truncate={false} /></Field></div>
              <div className="sm:col-span-2"><Field label="Organization DID"><CopyText value={employee.organizationDid} truncate={false} /></Field></div>
            </dl>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 text-sm font-semibold">Certificate information</h2>
            {cert ? (
              <dl className="grid gap-5 sm:grid-cols-2">
                <Field label="Certificate ID"><CopyText value={cert.id} truncate={false} /></Field>
                <Field label="Issued">{formatDate(vc?.issuanceDate ?? cert.issuedAt)}</Field>
                <Field label="Certificate type">{certificateTypeLabel(vc)}</Field>
                <Field label="Issuer"><CopyText value={issuerOf(vc)} truncate={false} /></Field>
                <Field label="Verification status">{verifyBadge}</Field>
                {verify.status === 'done' && !verify.result?.verified && verify.result?.error && (
                  <div className="sm:col-span-2 rounded bg-red-50 px-3 py-2 font-mono text-xs text-red-800">{verify.result.error}</div>
                )}
                {verify.status === 'error' && <div className="sm:col-span-2 text-sm text-amber-700">{verify.error}</div>}
              </dl>
            ) : (
              <p className="text-sm text-slate-500">No certificate has been generated for this employee yet.</p>
            )}
          </section>
        </div>

        <DidInfo employeeDid={employee.did ?? null} />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        danger
        loading={deleting}
        title="Delete employee"
        confirmLabel="Delete"
        message={<><p>Are you sure you want to delete this employee?</p><p className="mt-2">Associated certificate data may also be affected according to the backend's cascade behavior.</p></>}
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
      <GenerateCertificateDialog employee={generating ? employee : null} onClose={() => setGenerating(false)} />
    </>
  );
}
