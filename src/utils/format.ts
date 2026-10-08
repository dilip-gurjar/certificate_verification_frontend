const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats an ISO string as "10 Jan 2026" using the UTC calendar date, so no timezone shifting occurs. */
export function formatDate(value?: string | null, fallback = 'N/A'): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (isNaN(d.getTime())) return fallback;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatDateTime(value?: string | null, fallback = 'N/A'): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (isNaN(d.getTime())) return fallback;
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${formatDate(value)}, ${hh}:${mm} UTC`;
}

/**
 * Converts a <input type="date"> value (YYYY-MM-DD) to the ISO string sent to the backend.
 * This is the single place to change if the backend expects a different date format.
 */
export function toApiDate(inputValue: string): string {
  return `${inputValue}T00:00:00.000Z`;
}

/** ISO string -> YYYY-MM-DD for <input type="date"> (UTC date part, no shifting). */
export function toInputDate(value?: string | null): string {
  return value ? value.slice(0, 10) : '';
}

export function shortId(value: string | number | undefined | null, n = 8): string {
  if (value === undefined || value === null) return '—';
  const s = String(value);
  return s.length > n + 1 ? `${s.slice(0, n)}…` : s;
}

export function byDateDesc(a?: string | null, b?: string | null): number {
  return (b ? new Date(b).getTime() : 0) - (a ? new Date(a).getTime() : 0);
}
