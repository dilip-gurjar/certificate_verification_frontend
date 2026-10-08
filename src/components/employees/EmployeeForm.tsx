import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { employeeApi } from '../../api/employeeApi';
import { errorMessage } from '../../api/apiClient';
import { toApiDate } from '../../utils/format';
import type { Id } from '../../types/certificate';
import type { EmployeePayload } from '../../types/employee';
import { notifyEmployeesUpdated } from '../../utils/dataEvent';



export interface EmployeeFormValues {
  name: string;
  workEmail: string;
  personalEmail: string;
  joiningDate: string; // YYYY-MM-DD
  leavingDate: string; // YYYY-MM-DD or ''
}

export const emptyEmployeeForm: EmployeeFormValues = { name: '', workEmail: '', personalEmail: '', joiningDate: '', leavingDate: '' };

type Errors = Partial<Record<keyof EmployeeFormValues, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: EmployeeFormValues): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Name is required.';
  if (!v.workEmail.trim()) e.workEmail = 'Work email is required.';
  else if (!EMAIL.test(v.workEmail.trim())) e.workEmail = 'Enter a valid email address.';
  if (v.personalEmail.trim() && !EMAIL.test(v.personalEmail.trim())) e.personalEmail = 'Enter a valid email address.';
  if (!v.joiningDate) e.joiningDate = 'Joining date is required.';
  if (v.leavingDate && v.joiningDate && v.leavingDate < v.joiningDate) e.leavingDate = 'Leaving date cannot be before joining date.';
  return e;
}

export default function EmployeeForm({ employeeId, initial = emptyEmployeeForm }: { employeeId?: Id; initial?: EmployeeFormValues }) {
  const navigate = useNavigate();
  const [values, setValues] = useState<EmployeeFormValues>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const editing = employeeId !== undefined;

  const set = (key: keyof EmployeeFormValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setFormError(null);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload: EmployeePayload = {
      name: values.name.trim(),
      workEmail: values.workEmail.trim(),
      joiningDate: toApiDate(values.joiningDate),
    };
    if (editing) {
      payload.personalEmail = values.personalEmail.trim() || null;
      payload.leavingDate = values.leavingDate ? toApiDate(values.leavingDate) : null;
    } else {
      if (values.personalEmail.trim()) payload.personalEmail = values.personalEmail.trim();
      if (values.leavingDate) payload.leavingDate = toApiDate(values.leavingDate);
    }

    setSaving(true);
    try {
      // const saved = editing ? await employeeApi.update(employeeId, payload) : await employeeApi.create(payload);
      // toast.success(editing ? 'Employee updated successfully' : 'Employee created successfully');
      // navigate(`/employees/${saved?.id ?? employeeId ?? ''}`.replace(/\/$/, ''));

      const saved = editing
  ? await employeeApi.update(employeeId, payload)
  : await employeeApi.create(payload);
  notifyEmployeesUpdated();

toast.success(
  editing
    ? 'Employee updated successfully'
    : 'Employee created successfully'
);

// refreshAppData();

navigate(`/employees/${saved?.id ?? employeeId ?? ''}`.replace(/\/$/, ''));
    } catch (e) {
      setFormError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const fieldError = (k: keyof EmployeeFormValues) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>;

  return (
    <form onSubmit={submit} noValidate className="card max-w-2xl space-y-5 p-5 sm:p-6">
      {formError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</div>}

      <div>
        <label className="label" htmlFor="name">Name *</label>
        <input id="name" className="input" value={values.name} onChange={set('name')} />
        {fieldError('name')}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="workEmail">Work Email *</label>
          <input id="workEmail" type="email" className="input" value={values.workEmail} onChange={set('workEmail')} />
          {fieldError('workEmail')}
        </div>
        <div>
          <label className="label" htmlFor="personalEmail">Personal Email</label>
          <input id="personalEmail" type="email" className="input" value={values.personalEmail} onChange={set('personalEmail')} />
          {fieldError('personalEmail')}
        </div>
        <div>
          <label className="label" htmlFor="joiningDate">Joining Date *</label>
          <input id="joiningDate" type="date" className="input" value={values.joiningDate} onChange={set('joiningDate')} />
          {fieldError('joiningDate')}
        </div>
        <div>
          <label className="label" htmlFor="leavingDate">Leaving Date</label>
          <input id="leavingDate" type="date" className="input" value={values.leavingDate} onChange={set('leavingDate')} />
          {fieldError('leavingDate')}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={() => navigate(-1)} disabled={saving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving && <Loader2 size={16} className="animate-spin" />}
          {editing ? 'Save changes' : 'Create employee'}
        </button>
      </div>
    </form>
  );
}
