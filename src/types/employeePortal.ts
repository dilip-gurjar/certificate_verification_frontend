import type { Id } from './certificate';
import type { VerifiableCredential } from './verifiableCredential';

/** GET /employee/public/:token */
export interface PublicEmployee {
  name: string;
  did?: string | null;
}

/** POST /auth/employee/login */
export interface EmployeeLoginResponse {
  accessToken: string;
  expiresIn?: number | string;
  type?: string;
}

export interface EmployeeCertificateRecord {
  id: Id;
  verifiableCredentials: VerifiableCredential | string | null;
  issuedAt?: string;
  /** Certificate sharing token (NOT the portal access token, NOT the JWT). */
  shareToken?: string | null;
}

/** GET /employee/certificate */
export interface MyCertificateResponse {
  name?: string;
  did?: string | null;
  /** Accepted here too in case the backend exposes it at the top level. */
  shareToken?: string | null;
  certificate?: EmployeeCertificateRecord | null;
}
