import { ExternalLink, Fingerprint } from 'lucide-react';
import CopyText from './CopyText';
import { CFT_DID, CFT_DID_DOCUMENT_URL } from '../../utils/constants';

export default function DidInfo({ employeeDid }: { employeeDid?: string | null }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold"><Fingerprint size={18} /> DID information</h3>
      <div className="space-y-5 text-sm">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">CFT DID (issuer)</div>
          <div className="mt-1"><CopyText value={CFT_DID} truncate={false} /></div>
          <p className="mt-1 text-slate-500">
            CFT's DID identifies the certificate issuer. Its DID document contains the public verification key used to verify certificates issued by CFT.
          </p>
          <a href={CFT_DID_DOCUMENT_URL} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline">
            View CFT DID Document <ExternalLink size={14} />
          </a>
        </div>
        {employeeDid !== undefined && (
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Employee DID (subject)</div>
            <div className="mt-1"><CopyText value={employeeDid} truncate={false} /></div>
            <p className="mt-1 text-slate-500">This DID identifies the employee as the subject of the credential.</p>
          </div>
        )}
      </div>
    </div>
  );
}
