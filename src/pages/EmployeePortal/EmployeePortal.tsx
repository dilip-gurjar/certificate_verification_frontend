import { useNavigate, useParams } from 'react-router-dom';
import { Award, UserRound } from 'lucide-react';
import ErrorState from '../../components/common/ErrorState';
import { Skeleton } from '../../components/common/Skeleton';
import CopyText from '../../components/common/CopyText';
import Field from '../../components/common/Field';
import { useAsync } from '../../hooks/useAsync';
import { employeePortalApi } from '../../api/employeePortalApi';
import { isEmployeeAuthenticated } from '../../utils/employeeAuth';

/** Landing page opened from the emailed link: /employee/:token */
export default function EmployeePortal() {
  const { token = '' } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useAsync(() => employeePortalApi.getPublicEmployee(token), [token]);

  const viewCertificate = () => {
    if (isEmployeeAuthenticated()) navigate('/employee/certificate');
    else navigate('/employee/login', { state: { from: '/employee/certificate', portalToken: token } });
  };

  if (loading) {
    return (
      <div className="card space-y-4 p-6">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }
  if (error || !data) return <ErrorState message={error ?? 'Employee profile not found or this link is invalid.'} onRetry={reload} />;

  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><UserRound size={24} /></div>
        <div>
          <p className="text-sm text-slate-500">Welcome</p>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{data.name}</h1>
        </div>
      </div>

      <dl className="mt-6 space-y-4">
        <Field label="Your DID"><CopyText value={data.did} truncate={false} /></Field>
      </dl>
      <p className="mt-2 text-sm text-slate-500">This DID identifies you as the subject of your employment credential.</p>

      <button className="btn-primary mt-8 w-full sm:w-auto" onClick={viewCertificate}>
        <Award size={16} /> View Certificate
      </button>
    </div>
  );
}
