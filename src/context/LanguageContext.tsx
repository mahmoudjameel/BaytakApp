import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus, DevSettings, I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import i18n, { AppLanguage, RTL_LAYOUT_KEY, STORAGE_KEY } from '../i18n/i18n';

function reloadApp() {
  if (__DEV__) {
    DevSettings.reload();
    return;
  }
  void Updates.reloadAsync();
}

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
      const shouldRTL = lng === 'ar';
      const layoutTarget = shouldRTL ? 'rtl' : 'ltr';
      const lastLayout = await AsyncStorage.getItem(RTL_LAYOUT_KEY);

      I18nManager.allowRTL(true);
      I18nManager.swapLeftAndRightInRTL(true);
      I18nManager.forceRTL(shouldRTL);

      if (lastLayout !== layoutTarget) {
        await AsyncStorage.setItem(RTL_LAYOUT_KEY, layoutTarget);
        reloadApp();
        return;
      }
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
