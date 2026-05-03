import i18n from '../i18n/i18n';

/** رموز رسائل الخادم (مثل Zod) → مفاتيح ترجمة */
const KNOWN_CODES: Record<string, string> = {
  'auth:invalidEmail': 'apiErrors.authInvalidEmail',
  'auth:passwordTooShort': 'apiErrors.authPasswordTooShort',
  'auth:invalidEmailOrPassword': 'apiErrors.invalidCredentials',
};

function translateCode(code: string): string {
  const key = KNOWN_CODES[code];
  if (key) return i18n.t(key);
  if (code.startsWith('auth:')) return i18n.t('apiErrors.authGeneric', { code });
  return code;
}

/** يبني رسالة للمستخدم من جسم خطأ الـ API (message + errors[]) */
export function messageFromApiErrorJson(json: unknown): string {
  if (!json || typeof json !== 'object') return i18n.t('apiErrors.generic');
  const o = json as Record<string, unknown>;

  const top = o.message ?? o.error;
  const topStr = Array.isArray(top) ? top.join(', ') : top != null ? String(top) : '';

  const lower = topStr.toLowerCase();
  if (lower.includes('invalid email or password') || lower.includes('invalid credentials')) {
    return i18n.t('apiErrors.invalidCredentials');
  }

  const errs = o.errors;
  if (Array.isArray(errs) && errs.length > 0) {
    const lines = errs.map((item) => {
      const e = item as Record<string, unknown>;
      const code = String(e.message ?? e.code ?? '');
      if (code) return translateCode(code);
      const path = e.path;
      if (Array.isArray(path)) return path.join('.');
      return '';
    });
    const joined = lines.filter(Boolean);
    if (joined.length) return joined.join('\n');
  }

  if (topStr) return topStr;
  return i18n.t('apiErrors.generic');
}
