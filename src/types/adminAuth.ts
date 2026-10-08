/** POST /auth/login response */
export interface AdminLoginResponse {
  accessToken: string;
  expiresIn?: number | string;
  type?: string;
}

/** POST /auth/send-code body (ASSUMED shape: email, or dialCode + mobile). */
export interface SendCodePayload {
  email?: string;
  dialCode?: string;
  mobile?: string;
}



/** POST /auth/reset-password body */
export interface ResetPasswordPayload {
  code: string;
  newPassword: string;
  email: string;
}
