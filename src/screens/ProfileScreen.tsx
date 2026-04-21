import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { useAppLanguage } from '../context/LanguageContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  id: string;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  onPress?: () => void;
};

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const { language, setAppLanguage } = useAppLanguage();
  const navigation = useNavigation<NavigationProp>();

  const openLanguagePicker = useCallback(() => {
    Alert.alert(t('profile.chooseLanguageTitle'), t('profile.chooseLanguageMessage'), [
      { text: t('profile.languageEnglish'), onPress: () => void setAppLanguage('en') },
      { text: t('profile.languageArabic'), onPress: () => void setAppLanguage('ar') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  }, [setAppLanguage, t]);

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: '1',
        labelKey: 'profile.favourites',
        icon: 'heart-outline',
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('Favourites'),
      },
      {
        id: '2',
        labelKey: 'profile.wallet',
        icon: 'wallet-outline',
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('Wallet'),
      },
      {
        id: '3',
        labelKey: 'profile.notifications',
        icon: 'notifications-outline',
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('Notifications'),
      },
      {
        id: '4',
        labelKey: 'profile.security',
        icon: 'shield-checkmark-outline',
        iconBg: '#F0F0F0',
      },
      {
        id: '5',
        labelKey: 'profile.language',
        icon: 'language-outline',
        iconBg: '#F0F0F0',
        onPress: openLanguagePicker,
      },
      {
        id: '6',
        labelKey: 'profile.helpCenter',
        icon: 'help-circle-outline',
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('HelpCenter'),
      },
      {
        id: '7',
        labelKey: 'inviteFriends.menuLabel',
        icon: 'people-outline',
        iconBg: '#F0F0F0',
      },
    ],
    [navigation, openLanguagePicker],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../../assets/offer/Frame 1171279031.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.name}>{t('profile.userName')}</Text>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.email}>{t('profile.userEmail')}</Text>

        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuRow, index < menuItems.length - 1 && styles.menuRowBorder]}
              activeOpacity={0.75}
              onPress={item.onPress}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={20} color="#5C6272" />
              </View>
              <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
              <Ionicons name="chevron-forward" size={18} color="#B0B5C3" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scrollContent: { alignItems: 'center', paddingHorizontal: 16 },
  avatarSection: { marginTop: 20, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E8F4F3',
  },
  plusBadge: {
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
    borderColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
  },
  editBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    marginBottom: 24,
  },
  menuList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EDEFF3',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F7',
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.outfit.medium,
    color: '#1B1D36',
  },
});
