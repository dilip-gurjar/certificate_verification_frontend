import type { Certificate, Id } from './certificate';

export interface Employee {
  id: Id;
  name: string;
  workEmail: string;
  personalEmail?: string | null;
  joiningDate: string;
  leavingDate?: string | null;
  did?: string | null;
  organizationDid?: string | null;
  certificate?: Certificate | Certificate[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeePayload {
  name: string;
  workEmail: string;
  personalEmail?: string | null;
  joiningDate: string;
  leavingDate?: string | null;
}
