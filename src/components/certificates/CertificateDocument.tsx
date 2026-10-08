import { Award } from 'lucide-react';
import Field from '../common/Field';
import CopyText from '../common/CopyText';
import type { Certificate } from '../../types/certificate';
import type { VerifiableCredential } from '../../types/verifiableCredential';
import { formatDate } from '../../utils/format';
import { issuerOf } from '../../utils/certificate';
import { ORG_NAME } from '../../utils/constants';

export default function CertificateDocument({ cert, vc }: { cert: Certificate; vc: VerifiableCredential | null }) {
  const s = vc?.credentialSubject;
  const name = cert.employee?.name ?? s?.name ?? '—';

  return (
    <div className="rounded-xl border-2 border-slate-300 bg-white p-3 shadow-sm sm:p-5">
      <div className="rounded-lg border border-slate-200 px-5 py-8 sm:px-10">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Award size={26} /></div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Employment Certificate</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{ORG_NAME}</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-slate-300" />
        </div>

        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Field label="Employee">{name}</Field>
          <Field label="Work Email">{s?.workEmail ?? cert.employee?.workEmail ?? '—'}</Field>
          <Field label="Joining Date">{formatDate(s?.joiningDate ?? cert.employee?.joiningDate)}</Field>
          <Field label="Leaving Date">{formatDate(s?.leavingDate ?? cert.employee?.leavingDate)}</Field>
          <div className="sm:col-span-2"><Field label="Employee DID"><CopyText value={s?.id} truncate={false} /></Field></div>
          <div className="sm:col-span-2"><Field label="Issuer"><CopyText value={issuerOf(vc)} truncate={false} /></Field></div>
          <Field label="Issued">{formatDate(vc?.issuanceDate ?? cert.issuedAt)}</Field>
          <Field label="Certificate ID"><CopyText value={cert.id} /></Field>
        </dl>
      </div>
    </div>
  );
}
