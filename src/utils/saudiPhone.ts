/** أرقام جوال السعودية: إما 10 أرقام وطنية `05xxxxxxxx` أو 9 أرقام `5xxxxxxxx` (بدون الصفر). */

export function sanitizeSaudiLocalDigits(input: string): string {
  let d = input.replace(/\D/g, '');
  if (d.startsWith('966')) d = d.slice(3);
  if (d.length === 0) return '';
  if (d.startsWith('0')) return d.slice(0, 10);
  return d.slice(0, 9);
}

export function isValidSaudiMobileLocal(d: string): boolean {
  return /^05\d{8}$/.test(d) || /^5\d{8}$/.test(d);
}

/** للـ API: `966` متبوعًا بـ 9 أرقام تبدأ بـ 5 */
export function toInternationalSa(d: string): string | null {
  if (!isValidSaudiMobileLocal(d)) return null;
  const body = d.startsWith('0') ? d.slice(1) : d;
  return `966${body}`;
}
