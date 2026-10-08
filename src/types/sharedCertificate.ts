import type { Id } from './certificate';
import type { VerifiableCredential } from './verifiableCredential';

/** Normalised result of the public share-token verification endpoint. */
export interface SharedCertificateVerification {
  verified: boolean;
  error: string | null;
  certificateId?: Id;
  issuedAt?: string;
  verifiableCredentials: VerifiableCredential | null;
}
