import React, { useCallback, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Share, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ProviderTabParamList } from '../../navigation/ProviderTabNavigator';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';
import { useAuth } from '../../context/AuthContext';

type MenuItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  danger?: boolean;
};

export const ProviderProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<ProviderTabParamList, 'ProviderProfile'>>();
  const rtl = isRTL();
  const { user, signOut, refreshUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const openRoot = useCallback((screen: keyof RootStackParamList) => {
    const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    if (parent) parent.navigate(screen as never);
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setRefreshing(true);
      void refreshUser().finally(() => {
        if (alive) setRefreshing(false);
      });
      return () => {
        alive = false;
      };
    }, [refreshUser]),
  );

  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOut'),
      t('profile.signOutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            const root = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
            const reset = CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] });
            if (root) root.dispatch(reset);
            else navigation.dispatch(reset);
          },
        },
      ],
    );
  };

  const handleInvite = useCallback(async () => {
    try {
      await Share.share({ message: t('inviteFriends.shareMessage') });
    } catch {
      /* cancelled */
    }
  }, [t]);

  const menuItems: MenuItem[] = useMemo(
    () => [
      { id: '1', label: t('profile.favourites'), icon: 'heart-outline', onPress: () => openRoot('Favourites') },
      { id: '2', label: t('providerTime.title'), icon: 'time-outline', onPress: () => openRoot('ProviderTime') },
      { id: '3', label: t('providerWallet.title'), icon: 'wallet-outline', onPress: () => openRoot('ProviderWallet') },
      { id: '4', label: t('teams.title'), icon: 'people-outline', onPress: () => openRoot('Teams') },
      { id: '5', label: t('profile.notifications'), icon: 'notifications-outline', onPress: () => openRoot('Notifications') },
      { id: '6', label: t('profile.security'), icon: 'shield-checkmark-outline', onPress: () => openRoot('HelpCenter') },
      { id: '7', label: t('profile.language'), icon: 'language-outline', onPress: () => openRoot('LanguageSettings') },
      { id: '8', label: t('profile.helpCenter'), icon: 'help-circle-outline', onPress: () => openRoot('HelpCenter') },
      { id: '9', label: t('inviteFriends.menuLabel'), icon: 'share-social-outline', onPress: handleInvite },
      { id: '10', label: t('profile.signOut'), icon: 'log-out-outline', onPress: handleSignOut, danger: true },
    ],
    [handleInvite, openRoot, t],
  );

  const displayName = user?.fullName ?? user?.commercialName ?? t('profile.userName');
  const displayEmail = user?.email ?? t('profile.userEmail');
  const avatarUri = user?.avatar;

  const serviceChips = useMemo(() => {
    if (user?.categories?.length) {
      return user.categories.map((c) => ({ key: `c-${c.id}`, label: c.name }));
    }
    if (user?.offeredServices?.length) {
      return user.offeredServices.map((s, i) => ({ key: `s-${i}`, label: s }));
    }
    return [];
  }, [user?.categories, user?.offeredServices]);

  const accountTypeLabel =
    user?.accountType === 'COMPANY' ? t('providerProfile.company')
    : user?.accountType === 'INDIVIDUAL' ? t('providerProfile.individual')
    : null;

  const editComing = () => {
    Alert.alert(t('providerProfile.editComingTitle'), t('providerProfile.editComingBody'));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('ProviderHome'))}
        >
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <View style={styles.backBtn} />
      </View>

      {refreshing && !user?.id ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrap} onPress={editComing} activeOpacity={0.85}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <Image source={require('../../../assets/offer/Frame 1171279031.png')} style={styles.avatar} resizeMode="cover" />
            )}
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.nameRow, rtl && styles.nameRowRtl]}>
          <Text style={styles.name}>{displayName}</Text>
          <TouchableOpacity style={styles.editBadge} onPress={editComing} activeOpacity={0.8}>
            <Ionicons name="pencil" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.email, rtl && styles.metaRtl]}>{displayEmail}</Text>
        {user?.phone ? <Text style={[styles.phone, rtl && styles.metaRtl]}>{user.phone}</Text> : null}
        {user?.nationalAddress ? (
          <Text style={[styles.address, rtl && styles.metaRtl]} numberOfLines={2}>
            {user.nationalAddress}
          </Text>
        ) : null}

        {accountTypeLabel ? (
          <View style={[styles.badgeRow, rtl && styles.badgeRowRtl]}>
            <View style={styles.typeBadge}>
              <Ionicons name="briefcase-outline" size={14} color={Colors.primary} />
              <Text style={styles.typeBadgeText}>{accountTypeLabel}</Text>
            </View>
            {user?.role === 'PROVIDER' ? (
              <View style={styles.typeBadgeMuted}>
                <Text style={styles.typeBadgeMutedText}>{t('providerProfile.providerRole')}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {serviceChips.length > 0 ? (
          <View style={styles.servicesBlock}>
            <Text style={[styles.servicesHeading, rtl && styles.metaRtl]}>{t('providerProfile.myServices')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.chipsRow, rtl && styles.chipsRowRtl]}
            >
              {serviceChips.map((chip) => (
                <View key={chip.key} style={styles.chip}>
                  <Text style={[styles.chipText, rtl && styles.chipTextRtl]} numberOfLines={1}>
                    {chip.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuRow, rtl && styles.menuRowRtl, index < menuItems.length - 1 && styles.menuRowBorder]}
              activeOpacity={item.onPress ? 0.75 : 1}
              onPress={item.onPress}
              disabled={!item.onPress}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={22} color={item.danger ? '#D72653' : '#7B8194'} />
              </View>
              <Text style={[styles.menuLabel, rtl && styles.menuLabelRtl, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
              {item.onPress ? (
                <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={18} color="#B0B5C3" />
              ) : (
                <View style={{ width: 18 }} />
              )}
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
  header: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between' },
  headerRtl: { flexDirection: 'row-reverse' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scrollContent: { alignItems: 'center', paddingHorizontal: 16 },
  avatarSection: { marginTop: 20, marginBottom: 16 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E8F4F3' },
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
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameRowRtl: { flexDirection: 'row-reverse' },
  name: { fontSize: 20, fontFamily: FontFamily.outfit.bold, color: '#1B1D36' },
  editBadge: { width: 26, height: 26, borderRadius: 6, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  email: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE', marginBottom: 4, alignSelf: 'stretch', textAlign: 'center' },
  phone: { fontSize: 14, fontFamily: FontFamily.outfit.medium, color: '#5A6178', marginBottom: 4, alignSelf: 'stretch', textAlign: 'center' },
  address: { fontSize: 12, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE', marginBottom: 12, alignSelf: 'stretch', textAlign: 'center', lineHeight: 18 },
  metaRtl: { textAlign: 'center', writingDirection: 'rtl' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16, justifyContent: 'center' },
  badgeRowRtl: { flexDirection: 'row-reverse' },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E8F5F4',
    borderWidth: 1,
    borderColor: '#C5E8E4',
  },
  typeBadgeText: { fontSize: 12, fontFamily: FontFamily.outfit.semiBold, color: Colors.primary },
  typeBadgeMuted: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
  },
  typeBadgeMutedText: { fontSize: 12, fontFamily: FontFamily.outfit.medium, color: '#5A6178' },
  servicesBlock: { width: '100%', marginBottom: 20 },
  servicesHeading: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  chipsRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  chipsRowRtl: { flexDirection: 'row-reverse' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F6FA',
    borderWidth: 1,
    borderColor: '#EDEFF3',
    maxWidth: 220,
  },
  chipText: { fontSize: 13, fontFamily: FontFamily.outfit.medium, color: '#1B1D36' },
  chipTextRtl: { textAlign: 'right', writingDirection: 'rtl' },
  menuList: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#EDEFF3', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, gap: 14 },
  menuRowRtl: { flexDirection: 'row-reverse' },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F3F7' },
  menuIconWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontFamily: FontFamily.outfit.medium, color: '#1B1D36' },
  menuLabelRtl: { textAlign: 'right', writingDirection: 'rtl' },
  menuLabelDanger: { color: '#D72653' },
});
