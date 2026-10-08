import { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileJson, Loader2, ShieldCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import Badge from '../../components/common/Badge';
import CopyText from '../../components/common/CopyText';
import Modal from '../../components/common/Modal';
import JsonViewer from '../../components/common/JsonViewer';
import { useAsync } from '../../hooks/useAsync';
import { certificateApi } from '../../api/certificateApi';
import { errorMessage } from '../../api/apiClient';
import { formatDate } from '../../utils/format';
import { certificateEmployeeName, getVC, issuerOf } from '../../utils/certificate';
import type { Certificate, Id } from '../../types/certificate';
// import { DATA_EVENTS } from '../../utils/dataEvent';

type RowStatus = 'loading' | 'verified' | 'failed' | 'error';

export default function Certificates() {
  const { data, loading, error, reload } = useAsync(() => certificateApi.list(), []);


  useEffect(() => {
    const handleUpdate = () => {
      console.log('🔥 CERTIFICATES PAGE UPDATE RECEIVED');
      reload();
    };
  
    window.addEventListener(
      'certificates-updated',
      handleUpdate,
    );
  
    return () => {
      window.removeEventListener(
        'certificates-updated',
        handleUpdate,
      );
    };
  }, [reload]);


  const [statuses, setStatuses] = useState<Record<string, RowStatus>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [viewing, setViewing] = useState<Certificate | null>(null);

  const verify = async (id: Id) => {
    const key = String(id);
    setStatuses((s) => ({ ...s, [key]: 'loading' }));
    try {
      const r = await certificateApi.verify(id);
      setStatuses((s) => ({ ...s, [key]: r.verified ? 'verified' : 'failed' }));
      if (r.error) setMessages((m) => ({ ...m, [key]: r.error as string }));
    } catch (e) {
      setStatuses((s) => ({ ...s, [key]: 'error' }));
      setMessages((m) => ({ ...m, [key]: errorMessage(e) }));
    }
  };

  const badge = (id: Id) => {
    const key = String(id);
    const st = statuses[key];
    const title = messages[key];
    if (st === 'loading') return <Badge variant="neutral"><Loader2 size={12} className="animate-spin" /> Verifying</Badge>;
    if (st === 'verified') return <Badge variant="success">Verified ✓</Badge>;
    if (st === 'failed') return <span title={title}><Badge variant="error">Failed ✕</Badge></span>;
    if (st === 'error') return <span title={title}><Badge variant="warning">Could not verify</Badge></span>;
    return <Badge variant="neutral">Not verified yet</Badge>;
  };

  return (
    <>
      <PageHeader
        title="Certificates"
        description="Issued employment certificates. Verification runs on demand."
        actions={<Link to="/certificates/generate" className="btn-primary">Generate Certificate</Link>}
      />

      {error ? <ErrorState message={error} onRetry={reload} />
        : loading ? <TableSkeleton />
        : (data?.length ?? 0) === 0 ? <EmptyState title="No certificates yet" description="Generate a certificate from an employee record." action={<Link to="/certificates/generate" className="btn-primary">Generate Certificate</Link>} />
        : (
          <div className="card overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>{['Certificate ID', 'Employee', 'Employee ID', 'Issuer', 'Issued At', 'Verification', 'Actions'].map((h) => <th key={h} className="th">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data!.map((c) => {
                  const vc = getVC(c);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="td"><CopyText value={c.id} /></td>
                      <td className="td font-medium">{certificateEmployeeName(c, vc)}</td>
                      <td className="td"><Link to={`/employees/${c.employeeId}`} className="font-mono text-xs hover:text-indigo-600">{String(c.employeeId)}</Link></td>
                      <td className="td"><CopyText value={issuerOf(vc)} /></td>
                      <td className="td whitespace-nowrap">{formatDate(c.issuedAt)}</td>
                      <td className="td">{badge(c.id)}</td>
                      <td className="td">
                        <div className="flex items-center gap-0.5">
                          <Link className="icon-btn" to={`/certificates/${c.id}`} title="View" aria-label="View"><Eye size={16} /></Link>
                          <button className="icon-btn" onClick={() => void verify(c.id)} title="Verify" aria-label="Verify"><ShieldCheck size={16} /></button>
                          <button className="icon-btn" onClick={() => setViewing(c)} title="View credential" aria-label="View credential"><FileJson size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Verifiable Credential" wide>
        {viewing && <JsonViewer value={getVC(viewing) ?? viewing.verifiableCredentials} />}
      </Modal>
    </>
  );
}
