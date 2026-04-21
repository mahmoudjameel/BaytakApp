import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import ar from './ar.json';

export const STORAGE_KEY = '@baytak_language';

export const RTL_LAYOUT_KEY = '@baytak_rtl_layout';

export type AppLanguage = 'en' | 'ar';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: 'ar',
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

function persistLanguageCode(lng: string) {
  const code: AppLanguage = lng?.startsWith('ar') ? 'ar' : 'en';
  void AsyncStorage.setItem(STORAGE_KEY, code);
}

i18n.on('languageChanged', persistLanguageCode);

export default i18n;
