import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import VerificationPanel from '../../components/verification/VerificationPanel';
import { useAsync } from '../../hooks/useAsync';
import { certificateApi } from '../../api/certificateApi';
import { certificateEmployeeName, getVC } from '../../utils/certificate';

export default function Verification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const { data: certs } = useAsync(() => (id ? Promise.resolve([]) : certificateApi.list()), [id]);

  const go = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) navigate(`/verification/${encodeURIComponent(input.trim())}`);
  };

  if (id) {
    return (
      <>
        <PageHeader
          title="Certificate Verification"
          description="Verification is performed by the backend using the issuer's public key from its DID document."
          actions={<Link to={`/certificates/${id}`} className="btn-secondary">View Certificate</Link>}
        />
        <div className="max-w-3xl space-y-5">
          <VerificationPanel certificateId={id} />
          <div className="card p-5 text-sm text-slate-600">
            <h3 className="mb-1 font-semibold text-slate-900">Why tampering is detected</h3>
            The issuer signs the credential's contents. If any signed field (name, dates, DID) is changed after issuance,
            the signature no longer matches and verification returns <code>verified: false</code>.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Verify Certificate" description="Enter a certificate ID or pick an issued certificate." />
      <div className="card max-w-xl space-y-5 p-5">
        <form onSubmit={go} className="space-y-2">
          <label className="label" htmlFor="cid">Certificate ID</label>
          <div className="flex gap-2">
            <input id="cid" className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste certificate ID" />
            <button className="btn-primary" type="submit" disabled={!input.trim()}>Verify</button>
          </div>
        </form>
        {(certs?.length ?? 0) > 0 && (
          <div>
            <label className="label" htmlFor="pick">Or choose a certificate</label>
            <select id="pick" className="input" defaultValue="" onChange={(e) => e.target.value && navigate(`/verification/${encodeURIComponent(e.target.value)}`)}>
              <option value="">Select…</option>
              {certs!.map((c) => <option key={c.id} value={String(c.id)}>{certificateEmployeeName(c, getVC(c))} — {String(c.id).slice(0, 8)}</option>)}
            </select>
          </div>
        )}
      </div>
    </>
  );
}
