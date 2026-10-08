import { ApiError, apiClient } from './apiClient';
import { unwrapItem } from './unwrap';
import { clearEmployeeSession, getEmployeeToken, saveEmployeeSession } from '../utils/employeeAuth';
import type { EmployeeLoginResponse, MyCertificateResponse, PublicEmployee } from '../types/employeePortal';

/** Reuses the shared axios instance (base URL + error mapping); the JWT is attached per request only. */
export const employeePortalApi = {
  /** GET /employee/public/:token — no JWT. The :token is the emailed portal token, NOT a login JWT. */
  async getPublicEmployee(token: string): Promise<PublicEmployee> {
    try {
      const res = await apiClient.get(`/employee/public/${encodeURIComponent(token)}`);
      return unwrapItem<PublicEmployee>(res.data);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 400 || e.status === 404)) {
        throw new ApiError('Employee profile not found or this link is invalid.', e.status);
      }
      throw e;
    }
  },

  /** POST /auth/employee/login — stores the returned JWT as an employee session. */
  async login(personalEmail: string, password: string): Promise<void> {
    try {
      const res = await apiClient.post('/auth/employee/login', { personalEmail, password });
      const data = unwrapItem<EmployeeLoginResponse>(res.data);
      if (!data?.accessToken) throw new ApiError('Login succeeded but no access token was returned.');
      if (data.type && data.type !== 'employee') throw new ApiError('This account is not an employee account.');
      saveEmployeeSession(data.accessToken);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        throw new ApiError('Incorrect personal email or password.', 401);
      }
      throw e;
    }
  },

  /** GET /employee/certificate — Bearer JWT; the backend identifies the employee from it. */
  async getMyCertificate(): Promise<MyCertificateResponse> {
    const token = getEmployeeToken();
    if (!token) throw new ApiError('Please sign in to view your certificate.', 401);
    try {
      const res = await apiClient.get('/employee/certificate', { headers: { Authorization: `Bearer ${token}` } });
      const data = unwrapItem<MyCertificateResponse>(res.data);
      const cert = data?.certificate as unknown;
      // Tolerate a list-shaped certificate; use the most recent one.
      if (Array.isArray(cert)) return { ...data, certificate: (cert[cert.length - 1] ?? null) as MyCertificateResponse['certificate'] };
      return data;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        clearEmployeeSession();
        throw new ApiError('Your session has expired. Please sign in again.', 401);
      }
      if (e instanceof ApiError && e.status === 404) {
        throw new ApiError('No certificate was found for your account.', 404);
      }
      throw e;
    }
  },

  /** GET /employee/certificate/pdf — Bearer JWT, returns the PDF as a Blob. */
  async downloadCertificatePdf(): Promise<Blob> {
    const token = getEmployeeToken();
    if (!token) throw new ApiError('Please sign in to download your certificate.', 401);
    try {
      const res = await apiClient.get<Blob>('/employee/certificate/pdf', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        clearEmployeeSession();
        throw new ApiError('Your session has expired. Please sign in again.', 401);
      }
      if (e instanceof ApiError && e.status === 404) {
        throw new ApiError('No certificate was found for your account.', 404);
      }
      throw e;
    }
  },
};
