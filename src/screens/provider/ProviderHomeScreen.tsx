import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { isRTL } from '../../utils/rtl';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SERVICE_CARDS = [
  {
    id: 'service',
    icon: require('../../../assets/service.png'),
    titleKey: 'providerHome.cards.service.title',
    descriptionKey: 'providerHome.cards.service.description',
    route: 'AddNewService' as const,
  },
  {
    id: 'teams',
    icon: require('../../../assets/teams.png'),
    titleKey: 'providerHome.cards.teams.title',
    descriptionKey: 'providerHome.cards.teams.description',
    route: 'Teams' as const,
  },
];

export const ProviderHomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const rtl = isRTL();
  const { user, refreshUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      void refreshUser();
    }, [refreshUser]),
  );

  const displayName = user?.fullName ?? user?.commercialName ?? t('profile.userName');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.locationBtn} activeOpacity={0.7}>
          <Ionicons name="location-sharp" size={16} color={Colors.primary} />
          <Text style={styles.locationText}>{t('providerHome.location')}</Text>
          <Ionicons name="chevron-down" size={14} color="#1B1D36" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={22} color="#1B1D36" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <View style={styles.notifWrapper}>
              <Ionicons name="notifications-outline" size={22} color="#1B1D36" />
              <View style={styles.notifBadge} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.greeting, rtl && styles.textRtl]}>
          {t('providerHome.greeting', { name: displayName })}
        </Text>
        <View style={styles.cardsContainer}>
          {SERVICE_CARDS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => navigation.navigate(card.route)}
              activeOpacity={0.85}
            >
              <Image source={card.icon} style={styles.cardIcon} resizeMode="contain" />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, rtl && styles.textRtl]}>{t(card.titleKey)}</Text>
                <Text style={[styles.cardDesc, rtl && styles.textRtl]} numberOfLines={3}>
                  {t(card.descriptionKey)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('providerHome.addNewService')}
          onPress={() => navigation.navigate('AddNewService')}
          style={styles.addBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerRtl: { flexDirection: 'row-reverse' },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifWrapper: { position: 'relative' },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
    marginBottom: 18,
    textAlign: 'left',
  },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  cardsContainer: { gap: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: { width: 46, height: 46 },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 6,
    textAlign: 'left',
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    color: '#5A6178',
    lineHeight: 20,
    textAlign: 'left',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: '#F8F8F8',
  },
  addBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
});
