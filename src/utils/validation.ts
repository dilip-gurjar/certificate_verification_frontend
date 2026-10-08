export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Frontend minimum only; the backend remains the authority on password rules. */
export const MIN_PASSWORD_LENGTH = 8;

export function emailError(value: string): string | undefined {
  if (!value.trim()) return 'Email is required.';
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.';
  return undefined;
}

export function newPasswordError(value: string): string | undefined {
  if (!value) return 'Password is required.';
  if (value.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return undefined;
}

export function confirmPasswordError(password: string, confirm: string): string | undefined {
  if (!confirm) return 'Please confirm your password.';
  if (password !== confirm) return 'Passwords do not match.';
  return undefined;
}
