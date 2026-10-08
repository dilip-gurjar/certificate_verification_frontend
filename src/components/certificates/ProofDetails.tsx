import Field from '../common/Field';
import type { VCProof } from '../../types/verifiableCredential';
import { formatDateTime } from '../../utils/format';

export default function ProofDetails({ proof }: { proof?: VCProof }) {
  if (!proof) return <p className="text-sm text-slate-500">This credential contains no proof.</p>;
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <Field label="Proof type">{proof.type ?? '—'}</Field>
      <Field label="Proof purpose">{proof.proofPurpose ?? '—'}</Field>
      <div className="sm:col-span-2"><Field label="Verification method"><span className="break-all font-mono text-xs">{proof.verificationMethod ?? '—'}</span></Field></div>
      <Field label="Created">{formatDateTime(proof.created)}</Field>
    </dl>
  );
}
