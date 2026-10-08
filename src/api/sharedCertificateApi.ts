import { apiClient } from './apiClient';
import { unwrapItem } from './unwrap';
import { parseVC } from '../types/verifiableCredential';
import type { Id } from '../types/certificate';
import type { SharedCertificateVerification } from '../types/sharedCertificate';

/**
 * ASSUMED backend endpoint (public, no JWT). The project did not contain one for share tokens,
 * so this is the single place to change if your route is different.
 */
const verifyPath = (shareToken: string) => `/certificate/public/${encodeURIComponent(shareToken)}`;

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const asString = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);
const asId = (v: unknown): Id | undefined => (typeof v === 'string' || typeof v === 'number' ? v : undefined);

export const sharedCertificateApi = {
  /** GET <verifyPath> — never sends any JWT. A 404 is surfaced as ApiError(status 404). */
  async verify(shareToken: string): Promise<SharedCertificateVerification> {
    const res = await apiClient.get(verifyPath(shareToken));
    const raw = unwrapItem<unknown>(res.data);
    const body: Record<string, unknown> = isObject(raw) ? raw : {};
    const cert = isObject(body.certificate) ? body.certificate : {};
    const verification = isObject(body.verification) ? body.verification : body;

    const err = verification.error;
    return {
      verified: verification.verified === true,
      error: err === null || err === undefined || err === '' ? null : typeof err === 'string' ? err : JSON.stringify(err),
      certificateId: asId(cert.id) ?? asId(body.certificateId),
      issuedAt: asString(cert.issuedAt) ?? asString(body.issuedAt),
      verifiableCredentials: parseVC(body.verifiableCredentials ?? cert.verifiableCredentials ?? body.credential ?? null),
    };
  },
};
