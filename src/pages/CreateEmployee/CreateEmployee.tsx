import PageHeader from '../../components/common/PageHeader';
import EmployeeForm from '../../components/employees/EmployeeForm';

export default function CreateEmployee() {
  return (
    <>
      <PageHeader title="Add Employee" description="Create a new employee record." />
      <EmployeeForm />
    </>
  );
}
