import i18n from '../i18n/i18n';

/**
 * Use app language — not I18nManager.isRTL. In RN, `I18nManager.isRTL` is a snapshot from
 * initial native constants and often stays false in JS even after forceRTL() until a full reload.
 */
export function isRTL(): boolean {
  return i18n.language?.startsWith('ar') ?? false;
}

/** Ionicons name for a leading back affordance that mirrors in RTL. */
export function backChevronIcon(): 'chevron-back' | 'chevron-forward' {
  return isRTL() ? 'chevron-forward' : 'chevron-back';
}

/** Arrow glyph variant for headers that use arrow-back / arrow-forward. */
export function backArrowIcon(): 'arrow-back' | 'arrow-forward' {
  return isRTL() ? 'arrow-forward' : 'arrow-back';
}
