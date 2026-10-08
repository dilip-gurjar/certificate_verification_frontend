import type { Certificate } from '../types/certificate';
import type { Employee } from '../types/employee';
import { parseVC, type VerifiableCredential } from '../types/verifiableCredential';

export function getVC(cert: Certificate): VerifiableCredential | null {
  return parseVC(cert.verifiableCredentials);
}

export function issuerOf(vc: VerifiableCredential | null): string {
  if (!vc?.issuer) return '';
  return typeof vc.issuer === 'string' ? vc.issuer : vc.issuer.id ?? '';
}

export function certificateTypeLabel(vc: VerifiableCredential | null): string {
  if (!vc?.type) return '—';
  const types = Array.isArray(vc.type) ? vc.type : [vc.type];
  const specific = types.filter((t) => t !== 'VerifiableCredential');
  return (specific.length ? specific : types).join(', ');
}

export function certificateEmployeeName(cert: Certificate, vc: VerifiableCredential | null): string {
  return cert.employee?.name ?? vc?.credentialSubject?.name ?? '—';
}

export function findEmployeeCertificate(emp: Employee, certs: Certificate[]): Certificate | null {
  const match = certs.find((c) => String(c.employeeId) === String(emp.id));
  if (match) return match;
  const embedded = Array.isArray(emp.certificate) ? emp.certificate[emp.certificate.length - 1] : emp.certificate;
  if (embedded && typeof embedded === 'object' && 'id' in embedded) return embedded;
  return null;
}
