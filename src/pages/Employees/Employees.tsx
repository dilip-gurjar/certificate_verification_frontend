import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/Skeleton';
import Badge from '../../components/common/Badge';
import CopyText from '../../components/common/CopyText';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmployeeActions from '../../components/employees/EmployeeActions';
import GenerateCertificateDialog from '../../components/employees/GenerateCertificateDialog';
import { useAsync } from '../../hooks/useAsync';
import { employeeApi } from '../../api/employeeApi';
import { certificateApi } from '../../api/certificateApi';
import { errorMessage } from '../../api/apiClient';
import { formatDate } from '../../utils/format';
import { findEmployeeCertificate } from '../../utils/certificate';
import type { Employee } from '../../types/employee';
import { DATA_EVENTS } from '../../utils/dataEvent';

export default function Employees() {
  const { data, loading, error, reload } = useAsync(async () => {
    const [employees, certificates] = await Promise.all([employeeApi.list(), certificateApi.list()]);
    return { employees, certificates };
  }, []);


 
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toGenerate, setToGenerate] = useState<Employee | null>(null);

  const certs = data?.certificates ?? [];
  const q = query.trim().toLowerCase();
  const rows = (data?.employees ?? []).filter((e) => !q || [e.name, e.workEmail, e.personalEmail ?? ''].some((s) => s.toLowerCase().includes(q)));

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await employeeApi.remove(toDelete.id);
      toast.success('Employee deleted');
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (has: boolean) => (has ? <Badge variant="info">Certificate issued</Badge> : <Badge variant="neutral">No certificate</Badge>);

  return (
    <>
      <PageHeader
        title="Employees"
        description="Manage employees and their employment certificates."
        actions={<Link to="/employees/new" className="btn-primary"><Plus size={16} /> Add Employee</Link>}
      />

      {error ? <ErrorState message={error} onRetry={reload} />
        : loading ? <TableSkeleton />
        : (data?.employees.length ?? 0) === 0 ? <EmptyState title="No employees yet" description="Add your first employee to get started." action={<Link to="/employees/new" className="btn-primary">Add Employee</Link>} />
        : (
          <>
            <div className="relative mb-4 max-w-sm">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-9" placeholder="Search by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            {rows.length === 0 ? <EmptyState title="No matching employees" description="Try a different search term." /> : (
              <>
                {/* Desktop / tablet table */}
                <div className="card hidden overflow-x-auto md:block">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {['ID', 'Name', 'Work Email', 'Personal Email', 'Joining', 'Leaving', 'DID', 'Organization DID', 'Certificate', 'Actions'].map((h) => <th key={h} className="th">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map((e) => {
                        const cert = findEmployeeCertificate(e, certs);
                        return (
                          <tr key={e.id} className="hover:bg-slate-50">
                            <td className="td"><CopyText value={e.id} /></td>
                            <td className="td font-medium"><Link to={`/employees/${e.id}`} className="hover:text-indigo-600">{e.name}</Link></td>
                            <td className="td">{e.workEmail}</td>
                            <td className="td">{e.personalEmail || '—'}</td>
                            <td className="td whitespace-nowrap">{formatDate(e.joiningDate)}</td>
                            <td className="td whitespace-nowrap">{formatDate(e.leavingDate)}</td>
                            <td className="td"><CopyText value={e.did} /></td>
                            <td className="td"><CopyText value={e.organizationDid} /></td>
                            <td className="td">{statusBadge(!!cert)}</td>
                            <td className="td"><EmployeeActions employee={e} cert={cert} onDelete={setToDelete} onGenerate={setToGenerate} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <ul className="space-y-3 md:hidden">
                  {rows.map((e) => {
                    const cert = findEmployeeCertificate(e, certs);
                    return (
                      <li key={e.id} className="card space-y-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link to={`/employees/${e.id}`} className="block truncate font-medium">{e.name}</Link>
                            <div className="truncate text-sm text-slate-500">{e.workEmail}</div>
                          </div>
                          {statusBadge(!!cert)}
                        </div>
                        <div className="text-xs text-slate-500">Joined {formatDate(e.joiningDate)} · Left {formatDate(e.leavingDate)}</div>
                        <div className="text-xs text-slate-500">DID: <CopyText value={e.did} /></div>
                        <EmployeeActions employee={e} cert={cert} onDelete={setToDelete} onGenerate={setToGenerate} />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </>
        )}

      <ConfirmDialog
        open={!!toDelete}
        danger
        loading={deleting}
        title="Delete employee"
        confirmLabel="Delete"
        message={<><p>Are you sure you want to delete this employee?</p><p className="mt-2"><strong>{toDelete?.name}</strong> will be removed. Associated certificate data may also be affected according to the backend's cascade behavior.</p></>}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
      <GenerateCertificateDialog employee={toGenerate} onClose={() => setToGenerate(null)} />
    </>
  );
}
