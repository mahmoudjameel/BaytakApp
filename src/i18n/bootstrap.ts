import AsyncStorage from '@react-native-async-storage/async-storage';
import { DevSettings, I18nManager, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import i18n, { AppLanguage, RTL_LAYOUT_KEY, STORAGE_KEY } from './i18n';

function reloadApp() {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    return;
  }
  if (__DEV__) {
    DevSettings.reload();
    return;
  }
  void Updates.reloadAsync();
}

/**
 * RTL bootstrap must NOT use I18nManager.isRTL for reload decisions: it stays stale in JS.
 * We persist the layout direction we last applied and reload at most once per target change.
 *
 * Always call allowRTL + swap + forceRTL on every cold start: when lastLayout already matches,
 * we previously skipped forceRTL entirely, so native/layout stayed LTR while text was Arabic.
 */
export async function bootstrapLanguage(): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const lng: AppLanguage = raw === 'en' || raw === 'ar' ? raw : 'ar';
  if (raw !== 'en' && raw !== 'ar') {
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  }
  const shouldRTL = lng === 'ar';
  const layoutTarget = shouldRTL ? 'rtl' : 'ltr';

  if (Platform.OS === 'web') {
    await i18n.changeLanguage(lng);
    return;
  }

  I18nManager.allowRTL(true);
  I18nManager.swapLeftAndRightInRTL(true);
  I18nManager.forceRTL(shouldRTL);

  const lastLayout = await AsyncStorage.getItem(RTL_LAYOUT_KEY);

  if (lastLayout !== layoutTarget) {
    await AsyncStorage.setItem(RTL_LAYOUT_KEY, layoutTarget);
    reloadApp();
    return;
  }

  await i18n.changeLanguage(lng);
}
