/**
 * طباعة في Metro/Console أثناء التطوير فقط — لتتبع استجابات الـ API دون تلويث الإنتاج.
 */
export function devLog(tag: string, payload: unknown): void {
  if (!__DEV__) return;
  try {
    const serialized =
      typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
    console.log(`[Baytak:${tag}]`, serialized);
  } catch {
    console.log(`[Baytak:${tag}]`, payload);
  }
}

/** يخفي قيمة طويلة (مثل التوكن) في اللوج */
export function devLogRedacted(tag: string, obj: Record<string, unknown>): void {
  if (!__DEV__) return;
  const copy = { ...obj };
  for (const k of Object.keys(copy)) {
    if (/token|secret|password|authorization/i.test(k) && typeof copy[k] === 'string') {
      const s = copy[k] as string;
      copy[k] = s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)}` : '***';
    }
  }
  devLog(tag, copy);
}
