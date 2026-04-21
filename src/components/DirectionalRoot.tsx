import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

/**
 * Forces layout direction from the active i18n language. Relying only on I18nManager.isRTL
 * is unreliable in JS (stale at import time); root `direction` ensures flex rows mirror for Arabic.
 */
export const DirectionalRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith('ar') ?? false;

  return <View style={[styles.root, { direction: isArabic ? 'rtl' : 'ltr' }]}>{children}</View>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
