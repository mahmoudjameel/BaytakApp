import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
};

export const ProviderProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const rtl = isRTL();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: '1',
        label: t('profile.favourites'),
        icon: 'heart-outline',
        onPress: () => navigation.navigate('Favourites'),
      },
      {
        id: '2',
        label: t('providerTime.title'),
        icon: 'time-outline',
        onPress: () => navigation.navigate('ProviderTime'),
      },
      {
        id: '3',
        label: t('providerWallet.title'),
        icon: 'wallet-outline',
        onPress: () => navigation.navigate('ProviderWallet'),
      },
      {
        id: '4',
        label: t('profile.notifications'),
        icon: 'notifications-outline',
        onPress: () => navigation.navigate('Notifications'),
      },
      {
        id: '5',
        label: t('profile.security'),
        icon: 'shield-checkmark-outline',
      },
      {
        id: '6',
        label: t('profile.language'),
        icon: 'language-outline',
        onPress: () => navigation.navigate('LanguageSettings'),
      },
      {
        id: '7',
        label: t('profile.helpCenter'),
        icon: 'help-circle-outline',
        onPress: () => navigation.navigate('HelpCenter'),
      },
      {
        id: '8',
        label: t('inviteFriends.menuLabel'),
        icon: 'people-outline',
      },
    ],
    [navigation, t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../../../assets/offer/Frame 1171279031.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View style={[styles.nameRow, rtl && styles.nameRowRtl]}>
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
              style={[
                styles.menuRow,
                rtl && styles.menuRowRtl,
                index < menuItems.length - 1 && styles.menuRowBorder,
              ]}
              activeOpacity={0.75}
              onPress={item.onPress}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={22} color="#7B8194" />
              </View>
              <Text style={[styles.menuLabel, rtl && styles.menuLabelRtl]}>{item.label}</Text>
              <Ionicons
                name={rtl ? 'chevron-back' : 'chevron-forward'}
                size={18}
                color="#B0B5C3"
              />
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
  headerRtl: { flexDirection: 'row-reverse' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  scrollContent: { alignItems: 'center', paddingHorizontal: 16 },
  avatarSection: { marginTop: 20, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F4F3',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
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
  nameRowRtl: { flexDirection: 'row-reverse' },
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
    marginBottom: 28,
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
  menuRowRtl: { flexDirection: 'row-reverse' },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F7',
  },
  menuIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.outfit.medium,
    color: '#1B1D36',
  },
  menuLabelRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
