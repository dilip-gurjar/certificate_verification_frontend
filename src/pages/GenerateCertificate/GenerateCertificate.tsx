import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { PageSkeleton } from '../../components/common/Skeleton';
import { useAsync } from '../../hooks/useAsync';
import { employeeApi } from '../../api/employeeApi';
import { certificateApi } from '../../api/certificateApi';
import { errorMessage } from '../../api/apiClient';
import { findEmployeeCertificate } from '../../utils/certificate';
import { notifyCertificatesUpdated } from '../../utils/dataEvent';

export default function GenerateCertificate() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(params.get('employeeId') ?? '');
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useAsync(async () => {
    const [employees, certificates] = await Promise.all([employeeApi.list(), certificateApi.list()]);
    return employees.filter((e) => !findEmployeeCertificate(e, certificates));
  }, []);

  const generate = async () => {
    if (!selected) return;
  
    setBusy(true);
  
    try {
      const cert = await certificateApi.generate(selected);
      
// console.log('CERTIFICATE GENERATED:', cert)
//       notifyCertificatesUpdated()
//       console.log('CERTIFICATE EVENT DISPATCHED');
//       toast.success('Certificate generated successfully');
  
      // refreshAppData();
  
      navigate(
        cert?.id !== undefined
          ? `/certificates/${cert.id}`
          : '/certificates',
      );
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  // const generate = async () => {
  //   if (!selected) return;
  
  //   setBusy(true);
  
  //   try {
  //     const cert = await certificateApi.generate(selected);
  
  //     toast.success('Certificate generated successfully');
  
  //     reload();
  
  //     navigate(
  //       cert?.id !== undefined
  //         ? `/certificates/${cert.id}`
  //         : '/certificates',
  //     );
  //   } catch (e) {
  //     toast.error(errorMessage(e));
  //   } finally {
  //     setBusy(false);
  //   }
  // };

  // const generate = async () => {
  //   if (!selected) return;
  //   setBusy(true);
  //   try {
  //     const cert = await certificateApi.generate(selected);
  //     toast.success('Certificate generated successfully');
  //     navigate(cert?.id !== undefined ? `/certificates/${cert.id}` : '/certificates');
  //   } catch (e) {
  //     toast.error(errorMessage(e));
  //     setBusy(false);
  //   }
  // };

  return (
    <>
      <PageHeader title="Generate Certificate" description="The backend creates and signs the Verifiable Credential; nothing is signed in the browser." />
      {loading ? <PageSkeleton />
        : error ? <ErrorState message={error} onRetry={reload} />
        : (data?.length ?? 0) === 0 ? <EmptyState title="No employees without a certificate" description="Every employee already has a certificate, or no employees exist yet." action={<Link to="/employees/new" className="btn-primary">Add Employee</Link>} />
        : (
          <div className="card max-w-xl space-y-4 p-5">
            <div>
              <label className="label" htmlFor="employee">Employee</label>
              <select id="employee" className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Select an employee…</option>
                {data!.map((e) => <option key={e.id} value={String(e.id)}>{e.name} — {e.workEmail}</option>)}
              </select>
            </div>
            <div className="flex justify-end">
              <button className="btn-primary" disabled={!selected || busy} onClick={generate}>
                {busy && <Loader2 size={16} className="animate-spin" />} Generate Certificate
              </button>
            </div>
          </div>
        )}
    </>
  );
}
