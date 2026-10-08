import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Award, FilePlus2, Loader2, Plus, ShieldCheck, Users, BadgeCheck } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import CopyText from '../../components/common/CopyText';
import { useAsync } from '../../hooks/useAsync';
import { employeeApi } from '../../api/employeeApi';
import { certificateApi } from '../../api/certificateApi';
import { byDateDesc, formatDate } from '../../utils/format';
import { certificateEmployeeName, getVC } from '../../utils/certificate';
// import { DATA_EVENTS } from '../../utils/dataEvent';

export default function Dashboard() {

  
  // const { data, loading, error, reload } = useAsync(async () => {
  //   const [employees, certificates] = await Promise.all([employeeApi.list(), certificateApi.list()]);
  //   return { employees, certificates };
  // }, []);

  const { data, loading, error, reload } = useAsync(async () => {
    console.log('DASHBOARD FETCHING DATA');
    const [employees, certificates] = await Promise.all([
      employeeApi.list(),
      certificateApi.list(),
    ]);


    console.log('EMPLOYEES FROM API:', employees);
    console.log('CERTIFICATES FROM API:', certificates);

  
    return { employees, certificates };
  }, []);

  

  const [counts, setCounts] = useState<{ ok: number; failed: number; unavailable: number } | null>(null);
  const [verifying, setVerifying] = useState(false);

  const verifyAll = async () => {
    if (!data) return;
    setVerifying(true);
    const results = await Promise.allSettled(data.certificates.map((c) => certificateApi.verify(c.id)));
    let ok = 0, failed = 0, unavailable = 0;
    results.forEach((r) => {
      if (r.status === 'rejected') unavailable++;
      else if (r.value.verified) ok++;
      else failed++;
    });
    setCounts({ ok, failed, unavailable });
    setVerifying(false);
    toast.success('Verification run complete');
  };

  const actions = (
    <>
      <Link to="/employees/new" className="btn-primary"><Plus size={16} /> Add Employee</Link>
      <Link to="/certificates/generate" className="btn-secondary"><FilePlus2 size={16} /> Generate Certificate</Link>
      <Link to="/certificates" className="btn-secondary"><Award size={16} /> View Certificates</Link>
      <Link to="/verification" className="btn-secondary"><ShieldCheck size={16} /> Verify Certificate</Link>
    </>
  );

  if (error) return <><PageHeader title="Dashboard" actions={actions} /><ErrorState message={error} onRetry={reload} /></>;

  const employees = data?.employees ?? [];
  const certificates = data?.certificates ?? [];
  const recentEmployees = [...employees].sort((a, b) => byDateDesc(a.createdAt ?? a.joiningDate, b.createdAt ?? b.joiningDate)).slice(0, 5);
  const recentCerts = [...certificates].sort((a, b) => byDateDesc(a.issuedAt, b.issuedAt)).slice(0, 5);

  const stat = (label: string, value: string | number, icon: JSX.Element, hint?: string) => (
    <div className="card p-5">
      <div className="flex items-center justify-between text-slate-500"><span className="text-sm font-medium">{label}</span>{icon}</div>
      <div className="mt-2 text-3xl font-semibold">{loading ? <Skeleton className="h-8 w-16" /> : value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of employees and issued employment certificates." actions={actions} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stat('Total Employees', employees.length, <Users size={18} />)}
        {stat('Total Certificates', certificates.length, <Award size={18} />)}
        <div className="card p-5">
          <div className="flex items-center justify-between text-slate-500"><span className="text-sm font-medium">Verified Certificates</span><BadgeCheck size={18} /></div>
          <div className="mt-2 text-3xl font-semibold">{counts ? counts.ok : '—'}</div>
          <div className="mt-1 text-xs text-slate-500">
            {counts
              ? `${counts.failed} failed${counts.unavailable ? `, ${counts.unavailable} could not be checked` : ''}`
              : 'Not verified yet'}
          </div>
          <button className="btn-secondary mt-3" onClick={verifyAll} disabled={verifying || loading || certificates.length === 0}>
            {verifying && <Loader2 size={16} className="animate-spin" />} Verify all
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-sm font-semibold">Recent Employees</h2>
          {loading ? <div className="card space-y-3 p-4"><Skeleton className="h-6" /><Skeleton className="h-6" /><Skeleton className="h-6" /></div>
            : recentEmployees.length === 0 ? <EmptyState title="No employees yet" action={<Link to="/employees/new" className="btn-primary">Add Employee</Link>} />
            : (
              <ul className="card divide-y divide-slate-100">
                {recentEmployees.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <Link to={`/employees/${e.id}`} className="block truncate text-sm font-medium hover:text-indigo-600">{e.name}</Link>
                      <div className="truncate text-xs text-slate-500">{e.workEmail}</div>
                    </div>
                    <div className="shrink-0 text-xs text-slate-500">Joined {formatDate(e.joiningDate)}</div>
                  </li>
                ))}
              </ul>
            )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold">Recent Certificates</h2>
          {loading ? <div className="card space-y-3 p-4"><Skeleton className="h-6" /><Skeleton className="h-6" /><Skeleton className="h-6" /></div>
            : recentCerts.length === 0 ? <EmptyState title="No certificates yet" action={<Link to="/certificates/generate" className="btn-primary">Generate Certificate</Link>} />
            : (
              <ul className="card divide-y divide-slate-100">
                {recentCerts.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <Link to={`/certificates/${c.id}`} className="block truncate text-sm font-medium hover:text-indigo-600">{certificateEmployeeName(c, getVC(c))}</Link>
                      <CopyText value={c.id} />
                    </div>
                    <div className="shrink-0 text-xs text-slate-500">Issued {formatDate(c.issuedAt)}</div>
                  </li>
                ))}
              </ul>
            )}
        </section>
      </div>
    </>
  );
}
