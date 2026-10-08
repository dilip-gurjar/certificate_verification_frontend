import { ApiError, apiClient } from './apiClient';
import { unwrapItem } from './unwrap';
import { adminPublicConfig, adminRequestConfig } from './adminRequestConfig';
import { clearAdminSession, saveAdminSession } from '../utils/adminAuth';
import type { AdminLoginResponse, ResetPasswordPayload, SendCodePayload } from '../types/adminAuth';

export const adminAuthApi = {
  /** POST /auth/login — body ASSUMED to be { email, password } (LoginRequestDto). Stores the admin session. */
  async login(email: string, password: string): Promise<void> {
    try {
      const res = await apiClient.post('/auth/login', { email, password }, adminPublicConfig());
      const data = unwrapItem<AdminLoginResponse>(res.data);
      if (!data?.accessToken) throw new ApiError('Login succeeded but no access token was returned.');
      if (data.type === 'employee') throw new ApiError('This is an employee account. Use the employee portal to sign in.');
      saveAdminSession(data.accessToken, data.type);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) throw new ApiError('Invalid email or password.', 401);
      throw e;
    }
  },

  /** POST /auth/send-code — body ASSUMED: { email } for email, { dialCode, mobile } for mobile. */
  async sendCode(payload: SendCodePayload): Promise<void> {
    await apiClient.post('/auth/send-code', payload, 
     
      adminPublicConfig());
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(
      '/auth/forgot-password',
      { email },
      adminPublicConfig(),
    );
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', undefined, adminRequestConfig());
    } catch {
      /* ignore: we are signing out locally regardless */
    } finally {
      clearAdminSession();
    }
  },

};
