import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus, I18nManager, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n, { AppLanguage, RTL_LAYOUT_KEY, STORAGE_KEY } from '../i18n/i18n';

type LanguageContextValue = {
  language: AppLanguage;
  setAppLanguage: (lng: AppLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n: i18nInstance } = useTranslation();

  const language: AppLanguage = i18nInstance.language?.startsWith('ar') ? 'ar' : 'en';

  /** عند إرسال التطبيق للخلفية/الإغلاق: نعيد كتابة اللغة الحالية (أمان ضد أي تعارض) */
  useEffect(() => {
    const persistCurrent = async () => {
      const code: AppLanguage = i18n.language?.startsWith('ar') ? 'ar' : 'en';
      await AsyncStorage.setItem(STORAGE_KEY, code);
    };
    const onAppState = (next: AppStateStatus) => {
      if (next === 'background') {
        void persistCurrent();
      }
    };
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, []);

  const setAppLanguage = useCallback(
    async (lng: AppLanguage) => {
      await AsyncStorage.setItem(STORAGE_KEY, lng);

      if (Platform.OS === 'web') {
        await i18nInstance.changeLanguage(lng);
        return;
      }

      // Avoid native auto-mirroring on Android (double reverse issue).
      // We handle layout direction manually in UI components.
      I18nManager.allowRTL(true);
      I18nManager.swapLeftAndRightInRTL(false);
      I18nManager.forceRTL(false);
      await AsyncStorage.setItem(RTL_LAYOUT_KEY, 'ltr');
      await i18nInstance.changeLanguage(lng);
    },
    [i18nInstance],
  );

  const value = useMemo(() => ({ language, setAppLanguage }), [language, setAppLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useAppLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useAppLanguage must be used within LanguageProvider');
  }
  return ctx;
}
