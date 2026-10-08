import type { Employee } from './employee';
import type { VerifiableCredential } from './verifiableCredential';

export type Id = string | number;

export interface Certificate {
  id: Id;
  employeeId: Id;
  issuedAt: string;
  verifiableCredentials: VerifiableCredential | string | null;
  employee?: Employee | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VerificationResult {
  verified: boolean;
  error: string | null;
}
