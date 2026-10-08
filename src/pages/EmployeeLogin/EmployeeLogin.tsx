import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { employeePortalApi } from '../../api/employeePortalApi';
import { errorMessage } from '../../api/apiClient';
import { isEmployeeAuthenticated } from '../../utils/employeeAuth';

interface LocationState {
  from?: string;
  portalToken?: string;
  expired?: boolean;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as LocationState;
  const target = state.from ?? '/employee/certificate';

  const [personalEmail, setPersonalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(state.expired ? 'Your session has expired. Please sign in again.' : null);
  const [busy, setBusy] = useState(false);

  if (isEmployeeAuthenticated() && !busy) return <Navigate to={target} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const errs: typeof errors = {};
    if (!personalEmail.trim()) errs.email = 'Personal email is required.';
    else if (!EMAIL.test(personalEmail.trim())) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      await employeePortalApi.login(personalEmail.trim(), password);
      navigate(target, { replace: true });
    } catch (err) {
      setFormError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="card mx-auto max-w-md p-6 sm:p-8">
      <h1 className="text-xl font-semibold tracking-tight">Employee sign in</h1>
      <p className="mt-1 text-sm text-slate-500">Sign in with your personal email and password to view your certificate.</p>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        {formError && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</div>}

        <div>
          <label className="label" htmlFor="personalEmail">Personal Email</label>
          <input id="personalEmail" type="email" autoComplete="username" className="input" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="input pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy && <Loader2 size={16} className="animate-spin" />} Sign in
        </button>
      </form>

      {state.portalToken && (
        <div className="mt-4 text-center text-sm">
          <Link to={`/employee/${state.portalToken}`} className="text-indigo-600 hover:underline">Back to my profile</Link>
        </div>
      )}
    </div>
  );
}
