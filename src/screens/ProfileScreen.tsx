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
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../utils/rtl';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  id: string;
  labelKey: string;
  iconSource: any;
  iconBg: string;
  onPress?: () => void;
};

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const rtl = isRTL();

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: '1',
        labelKey: 'profile.favourites',
        iconSource: require('../../assets/favourite.png'),
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('Favourites'),
      },
      {
        id: '2',
        labelKey: 'profile.wallet',
        iconSource: require('../../assets/wallet-01.png'),
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('Wallet'),
      },
      {
        id: '3',
        labelKey: 'profile.notifications',
        iconSource: require('../../assets/notification-02.png'),
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('Notifications'),
      },
      {
        id: '4',
        labelKey: 'profile.security',
        iconSource: require('../../assets/security-check.png'),
        iconBg: '#F0F0F0',
      },
      {
        id: '5',
        labelKey: 'profile.language',
        iconSource: require('../../assets/language-square.png'),
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('LanguageSettings'),
      },
      {
        id: '6',
        labelKey: 'profile.helpCenter',
        iconSource: require('../../assets/help-square.png'),
        iconBg: '#F0F0F0',
        onPress: () => navigation.navigate('HelpCenter'),
      },
      {
        id: '7',
        labelKey: 'inviteFriends.menuLabel',
        iconSource: require('../../assets/user-multiple.png'),
        iconBg: '#F0F0F0',
      },
    ],
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, rtl && styles.headerTitleRtl]}>{t('profile.title')}</Text>
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

        <View style={[styles.nameRow, rtl && styles.nameRowRtl]}>
          <Text style={[styles.name, rtl && styles.nameRtl]}>{t('profile.userName')}</Text>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.email, rtl && styles.emailRtl]}>{t('profile.userEmail')}</Text>

        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuRow, rtl && styles.menuRowRtl, index < menuItems.length - 1 && styles.menuRowBorder]}
              activeOpacity={0.75}
              onPress={item.onPress}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                <Image source={item.iconSource} style={styles.menuIconImage} resizeMode="contain" />
              </View>
              <Text style={[styles.menuLabel, rtl && styles.menuLabelRtl]}>{t(item.labelKey)}</Text>
              <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={18} color="#B0B5C3" />
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
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  headerTitleRtl: { writingDirection: 'rtl' },
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
  nameRowRtl: {
    flexDirection: 'row-reverse',
  },
  name: {
    fontSize: 20,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
  },
  nameRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
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
  emailRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
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
  menuRowRtl: {
    flexDirection: 'row-reverse',
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
  menuIconImage: {
    width: 21,
    height: 21,
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
