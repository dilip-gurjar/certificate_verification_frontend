import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AdminAuthLayout from '../../components/admin/AdminAuthLayout';
import PasswordField from '../../components/admin/PasswordField';
import FormAlert from '../../components/admin/FormAlert';
import { adminAuthApi } from '../../api/adminAuthApi';
import { errorMessage } from '../../api/apiClient';
import { isAdminAuthenticated } from '../../utils/adminAuth';
import { emailError } from '../../utils/validation';

interface LocationState {
  from?: string;
  message?: string;
  expired?: boolean;
}

/** Only accept in-app paths, and never bounce back to an auth page. */
function safeTarget(from?: string): string {
  return from && from.startsWith('/') && !from.startsWith('//') && !from.startsWith('/admin/') ? from : '/';
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as LocationState;
  const target = safeTarget(state.from);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(state.expired ? 'Your session has expired. Please sign in again.' : null);
  const [busy, setBusy] = useState(false);

  if (isAdminAuthenticated() && !busy) return <Navigate to={target} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const errs: typeof errors = { email: emailError(email), password: password ? undefined : 'Password is required.' };
    setErrors(errs);
    if (errs.email || errs.password) return;

    setBusy(true);
    try {
      await adminAuthApi.login(email.trim(), password);
      navigate(target, { replace: true });
    } catch (err) {
      setFormError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AdminAuthLayout
      title="Admin sign in"
      subtitle="Sign in to manage employees and certificates."
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {state.message && !formError && <FormAlert kind="success">{state.message}</FormAlert>}
        {formError && <FormAlert kind="error">{formError}</FormAlert>}

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <PasswordField id="password" label="Password" autoComplete="current-password" value={password} onChange={setPassword} error={errors.password} />

        <div className="text-right text-sm">
          <Link to="/admin/forgot-password" className="text-indigo-600 hover:underline">Forgot Password?</Link>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />} Sign in
        </button>
      </form>
    </AdminAuthLayout>
  );
}
