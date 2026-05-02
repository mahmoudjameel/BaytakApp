import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Platform } from 'react-native';
import i18n, { AppLanguage, RTL_LAYOUT_KEY, STORAGE_KEY } from './i18n';

export async function bootstrapLanguage(): Promise<void> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const lng: AppLanguage = raw === 'en' || raw === 'ar' ? raw : 'ar';
  if (raw !== 'en' && raw !== 'ar') {
    await AsyncStorage.setItem(STORAGE_KEY, lng);
  }
  if (Platform.OS === 'web') {
    await i18n.changeLanguage(lng);
    return;
  }

  // Keep native layout fixed to LTR and manage RTL manually in components.
  I18nManager.allowRTL(true);
  I18nManager.swapLeftAndRightInRTL(false);
  I18nManager.forceRTL(false);
  await AsyncStorage.setItem(RTL_LAYOUT_KEY, 'ltr');

  await i18n.changeLanguage(lng);
}
