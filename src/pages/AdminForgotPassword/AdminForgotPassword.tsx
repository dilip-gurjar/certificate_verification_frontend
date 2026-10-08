import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AdminAuthLayout from '../../components/admin/AdminAuthLayout';
import FormAlert from '../../components/admin/FormAlert';
import { adminAuthApi } from '../../api/adminAuthApi';
import { errorMessage } from '../../api/apiClient';
import { emailError } from '../../utils/validation';

export default function AdminForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const err = emailError(email);
    setError(err);
    if (err) return;

    setBusy(true);
    try {
      await adminAuthApi.forgotPassword(email.trim());
      setSent(true);
    } catch (ex) {
      setFormError(errorMessage(ex));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminAuthLayout
      title="Forgot password"
      subtitle="Enter your account email and we'll send you a reset code."
      footer={<Link to="/admin/login" className="font-medium text-indigo-600 hover:underline">Back to login</Link>}
    >
      {sent ? (
        <div className="space-y-4">
          <FormAlert kind="success">If an account exists for {email.trim()}, a reset code has been sent. Check your inbox.</FormAlert>
          <button className="btn-primary w-full" onClick={() => navigate('/admin/reset-password', { state: { email: email.trim() } })}>
            Enter reset code
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          {formError && <FormAlert kind="error">{formError}</FormAlert>}
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" />} Send Reset Code
          </button>
        </form>
      )}
    </AdminAuthLayout>
  );
}
