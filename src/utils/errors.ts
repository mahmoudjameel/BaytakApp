export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** رسالة واضحة عند رفض الخادم لعرض الفئات بدون توثيق */
export function categoryLoadErrorMessage(
  error: unknown,
  t: (key: string) => string,
  fallback: string,
): string {
  const raw = error instanceof Error ? error.message : String(error);
  const lower = raw.toLowerCase();
  if (
    lower.includes('unauthorized') ||
    lower.includes('auth:unauthorized') ||
    /\b401\b/.test(raw)
  ) {
    return t('providerSelectServices.unauthorizedCategories');
  }
  return toErrorMessage(error, fallback);
}
