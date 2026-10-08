/** Tolerates both bare arrays and common wrappers such as { data: [...] }. */
export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>;
    for (const key of ['data', 'items', 'results', 'employees', 'certificates']) {
      if (Array.isArray(o[key])) return o[key] as T[];
    }
  }
  return [];
}

export function unwrapItem<T>(data: unknown): T {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const inner = (data as Record<string, unknown>).data;
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) return inner as T;
  }
  return data as T;
}
