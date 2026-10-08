import axios from 'axios';
import { getAdminToken, notifyAdminUnauthorized } from '../utils/adminAuth';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '');

export class ApiError extends Error {
  status?: number;
  details: string[];
  constructor(message: string, status?: number, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : 'Something went wrong. Please try again.';
}

function toApiError(err: unknown): ApiError {
  if (!axios.isAxiosError(err)) return new ApiError(errorMessage(err));
  if (!err.response) {
    return new ApiError(
      err.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Unable to reach the server. Check your connection and the configured API URL.',
    );
  }
  const { status, data } = err.response;
  const raw = (data as { message?: unknown } | undefined)?.message;
  const details = Array.isArray(raw) ? raw.map(String) : typeof raw === 'string' ? [raw] : [];
  const first = details[0];

  if (status === 400) return new ApiError(first ? `Validation failed: ${details.join('; ')}` : 'The request was invalid.', status, details);
  if (status === 404) return new ApiError(first ?? 'The requested resource was not found.', status, details);
  if (status === 409) return new ApiError(first ?? 'This action conflicts with existing data.', status, details);
  if (status >= 500) return new ApiError('The server ran into a problem. Please try again later.', status);
  return new ApiError(first ?? `Request failed (${status}).`, status, details);
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (r) => r,
  (e) => {
    // A 401 on a request that carried the ADMIN token ends the admin session only.
    // Employee requests carry a different token, so they never match.
    if (axios.isAxiosError(e) && e.response?.status === 401) {
      const adminToken = getAdminToken();
      if (adminToken && e.config?.headers.get('Authorization') === `Bearer ${adminToken}`) notifyAdminUnauthorized();
    }
    return Promise.reject(toApiError(e));
  },
);
