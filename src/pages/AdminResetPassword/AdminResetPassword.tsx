import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AdminAuthLayout from '../../components/admin/AdminAuthLayout';
import PasswordField from '../../components/admin/PasswordField';
import FormAlert from '../../components/admin/FormAlert';
import { adminAuthApi } from '../../api/adminAuthApi';
import { errorMessage } from '../../api/apiClient';
import { confirmPasswordError, emailError, newPasswordError } from '../../utils/validation';

type Field = 'email' | 'code' | 'password' | 'confirm';

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as { email?: string };

  const [email, setEmail] = useState(state.email ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const errs: Partial<Record<Field, string>> = {
      email: emailError(email),
      code: code.trim() ? undefined : 'Reset code is required.',
      password: newPasswordError(password),
      confirm: confirmPasswordError(password, confirm),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    setBusy(true);
    try {
      await adminAuthApi.resetPassword({ code: code.trim(), newPassword: password, email: email.trim() });
      navigate('/admin/login', { replace: true, state: { message: 'Password reset successfully. Please login with your new password.' } });
    } catch (ex) {
      setFormError(errorMessage(ex));
      setBusy(false);
    }
  };

  return (
    <AdminAuthLayout
      title="Reset password"
      subtitle="Enter the code from your email and choose a new password."
      footer={<Link to="/admin/login" className="font-medium text-indigo-600 hover:underline">Back to login</Link>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && <FormAlert kind="error">{formError}</FormAlert>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="code">Reset code</label>
          <input id="code" inputMode="numeric" autoComplete="one-time-code" className="input" value={code} onChange={(e) => setCode(e.target.value)} />
          {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
        </div>
        <PasswordField id="newPassword" label="New password" autoComplete="new-password" value={password} onChange={setPassword} error={errors.password} />
        <PasswordField id="confirmPassword" label="Confirm new password" autoComplete="new-password" value={confirm} onChange={setConfirm} error={errors.confirm} />
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />} Reset Password
        </button>
      </form>
    </AdminAuthLayout>
  );
}
