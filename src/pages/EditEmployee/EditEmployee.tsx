import { useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import { PageSkeleton } from '../../components/common/Skeleton';
import EmployeeForm from '../../components/employees/EmployeeForm';
import { useAsync } from '../../hooks/useAsync';
import { employeeApi } from '../../api/employeeApi';
import { toInputDate } from '../../utils/format';

export default function EditEmployee() {
  const { id = '' } = useParams();
  const { data, loading, error, reload } = useAsync(() => employeeApi.get(id), [id]);

  return (
    <>
      <PageHeader title="Edit Employee" description="Update employee details." />
      {loading ? <PageSkeleton /> : error || !data ? <ErrorState message={error ?? 'Employee not found.'} onRetry={reload} /> : (
        <EmployeeForm
          employeeId={data.id}
          initial={{
            name: data.name ?? '',
            workEmail: data.workEmail ?? '',
            personalEmail: data.personalEmail ?? '',
            joiningDate: toInputDate(data.joiningDate),
            leavingDate: toInputDate(data.leavingDate),
          }}
        />
      )}
    </>
  );
}
