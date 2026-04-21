import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { useAppLanguage } from '../context/LanguageContext';
import { isRTL } from '../utils/rtl';

type MenuItem = {
  id: string;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  value?: string;
  onPress?: () => void;
};

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const { language, setAppLanguage } = useAppLanguage();

  const languageLabel = language === 'ar' ? t('profile.languageArabic') : t('profile.languageEnglish');

  const openLanguagePicker = useCallback(() => {
    Alert.alert(t('profile.chooseLanguageTitle'), t('profile.chooseLanguageMessage'), [
      { text: t('profile.languageEnglish'), onPress: () => void setAppLanguage('en') },
      { text: t('profile.languageArabic'), onPress: () => void setAppLanguage('ar') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  }, [setAppLanguage, t]);

  const menuItems: MenuItem[] = useMemo(
    () => [
      { id: '1', labelKey: 'profile.favourites', icon: 'heart-outline', iconBg: '#FFEBEE' },
      { id: '2', labelKey: 'profile.wallet', icon: 'wallet-outline', iconBg: '#E8F5E9' },
      { id: '3', labelKey: 'profile.notifications', icon: 'notifications-outline', iconBg: '#FFF8E7', value: '3' },
      { id: '4', labelKey: 'profile.security', icon: 'shield-checkmark-outline', iconBg: Colors.primaryLight },
      {
        id: '5',
        labelKey: 'profile.language',
        icon: 'language-outline',
        iconBg: '#F3E5F5',
        value: languageLabel,
        onPress: openLanguagePicker,
      },
      { id: '6', labelKey: 'profile.helpCenter', icon: 'help-circle-outline', iconBg: '#E3F2FD' },
    ],
    [languageLabel, openLanguagePicker],
  );

  const chevronName = isRTL() ? 'chevron-back' : 'chevron-forward';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.title')}</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={44} color={Colors.primary} />
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={13} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{t('profile.userName')}</Text>
          <Text style={styles.email}>{t('profile.userEmail')}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>{t('profile.bookings')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>4</Text>
              <Text style={styles.statLabel}>{t('profile.contracts')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>250</Text>
              <Text style={styles.statLabel}>{t('profile.sarWallet')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.75}
              onPress={item.onPress}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={22} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
              <View style={styles.menuRight}>
                {item.value && (
                  <View style={styles.valueBadge}>
                    <Text style={styles.valueText}>{item.value}</Text>
                  </View>
                )}
                <Ionicons name={chevronName} size={18} color={Colors.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          </View>
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: FontSize.xl, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrap: { position: 'relative', marginBottom: 8 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  name: { fontSize: FontSize.xl, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  email: { fontSize: FontSize.base, fontFamily: FontFamily.outfit.regular, color: Colors.textGray },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundSecondary,
    width: '100%',
    justifyContent: 'space-around',
  },
  stat: { alignItems: 'center', gap: 2 },
  statNum: { fontSize: FontSize.xl, fontFamily: FontFamily.outfit.bold, color: Colors.textDark },
  statLabel: { fontSize: FontSize.sm, fontFamily: FontFamily.outfit.regular, color: Colors.textGray },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  menuCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.backgroundSecondary },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.outfit.medium, color: Colors.textDark },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  valueBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  valueText: { fontSize: 11, fontFamily: FontFamily.outfit.semiBold, color: Colors.primary },
  logoutBtn: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: { fontSize: FontSize.base, fontFamily: FontFamily.outfit.semiBold, color: Colors.error },
});
