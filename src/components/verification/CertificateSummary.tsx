import Field from '../common/Field';
import CopyText from '../common/CopyText';
import type { Certificate } from '../../types/certificate';
import type { VerifiableCredential } from '../../types/verifiableCredential';
import { formatDate } from '../../utils/format';
import { certificateEmployeeName, issuerOf } from '../../utils/certificate';

export default function CertificateSummary({ cert, vc }: { cert: Certificate; vc: VerifiableCredential | null }) {
  return (
    <div className="card p-5">
      <dl className="grid gap-5 sm:grid-cols-2">
        <Field label="Issuer"><CopyText value={issuerOf(vc)} truncate={false} /></Field>
        <Field label="Employee">{certificateEmployeeName(cert, vc)}</Field>
        <div className="sm:col-span-2"><Field label="Employee DID"><CopyText value={vc?.credentialSubject?.id} truncate={false} /></Field></div>
        <Field label="Certificate ID"><CopyText value={cert.id} truncate={false} /></Field>
        <Field label="Issued">{formatDate(vc?.issuanceDate ?? cert.issuedAt)}</Field>
      </dl>
    </div>
  );
}
