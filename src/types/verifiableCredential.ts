export interface VCProof {
  type?: string;
  created?: string;
  verificationMethod?: string;
  proofPurpose?: string;
  proofValue?: string;
  [key: string]: unknown;
}

export interface VCSubject {
  id?: string;
  name?: string;
  workEmail?: string;
  joiningDate?: string | null;
  leavingDate?: string | null;
  [key: string]: unknown;
}

export interface VerifiableCredential {
  '@context'?: unknown;
  id?: string;
  type?: string[] | string;
  issuer?: string | { id?: string; [key: string]: unknown };
  credentialSubject?: VCSubject;
  issuanceDate?: string;
  proof?: VCProof;
  [key: string]: unknown;
}

/** The API may return the VC as an object or as a JSON string. */
export function parseVC(input: unknown): VerifiableCredential | null {
  if (!input) return null;
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return parsed && typeof parsed === 'object' ? (parsed as VerifiableCredential) : null;
    } catch {
      return null;
    }
  }
  return typeof input === 'object' ? (input as VerifiableCredential) : null;
}
