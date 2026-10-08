import { apiClient } from './apiClient';
import { adminRequestConfig } from './adminRequestConfig';
import { unwrapItem, unwrapList } from './unwrap';
import type { Certificate, Id, VerificationResult } from '../types/certificate';

export const certificateApi = {
  async list(): Promise<Certificate[]> {
    return unwrapList<Certificate>((await apiClient.get('/certificate', adminRequestConfig())).data);
  },

  /**
   * The backend exposes no GET /certificate/{id}, so a single certificate is
   * looked up from the list endpoint. Replace with a direct call if one is added.
   */
  async getById(id: Id): Promise<Certificate | null> {
    const all = await certificateApi.list();
    return all.find((c) => String(c.id) === String(id)) ?? null;
  },

  async generate(employeeId: Id): Promise<Certificate> {
    return unwrapItem<Certificate>((await apiClient.post(`/certificate/${employeeId}`, undefined, adminRequestConfig())).data);
  },

  
  async verify(id: Id): Promise<VerificationResult> {
    const raw = unwrapItem<Record<string, unknown>>((await apiClient.get(`/certificate/${id}/verify`, adminRequestConfig())).data);
    const err = raw?.error;
    return {
      verified: raw?.verified === true,
      error: err === null || err === undefined || err === '' ? null : typeof err === 'string' ? err : JSON.stringify(err),
    };
  },
};
