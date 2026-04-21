import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { backChevronIcon } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'NearbyServiceDetails'>;

export const NearbyServiceDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { name, priceMain, priceUnit, image } = route.params;
  const { width } = useWindowDimensions();
  const providerCardWidth = (width - 48) / 4;

  const providers = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `${i + 1}`,
        name: t('nearbyDetails.providerName'),
        role: t('home.cleaningExpert'),
        rating: '4.8',
        price: t('home.pricePerHour', { rate: '15' }),
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      })),
    [t],
  );

  const reviews = useMemo(
    () => [
      {
        id: '1',
        name: t('nearbyDetails.reviewer1'),
        date: t('home.reviewDate'),
        text: t('home.reviewText'),
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80',
      },
      {
        id: '2',
        name: t('nearbyDetails.reviewer2'),
        date: t('home.reviewDate'),
        text: t('home.reviewText'),
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      },
      {
        id: '3',
        name: t('nearbyDetails.reviewer3'),
        date: t('home.reviewDate'),
        text: t('home.reviewText'),
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      },
    ],
    [t],
  );

  const metrics = useMemo(
    () => [
      { icon: 'people' as const, title: t('home.clientsPlus'), sub: t('home.metricClient') },
      { icon: 'briefcase' as const, title: t('home.yearsPlus'), sub: t('home.metricExperience') },
      { icon: 'star' as const, title: '4.9', sub: t('home.metricRating') },
      { icon: 'chatbubble' as const, title: t('home.reviewsPlus'), sub: t('home.metricReviews') },
    ],
    [t],
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground source={{ uri: image }} style={styles.heroImage}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name={backChevronIcon()} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.contentCard}>
          <View style={styles.nameRow}>
            <Text style={styles.serviceName}>{name.replace('...', 'nance')}</Text>
            <Text style={styles.price}>
              {priceMain} {priceUnit}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F6C225" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>

          <View style={styles.metricsRow}>
            {metrics.map((m) => (
              <View key={m.title} style={styles.metricItem}>
                <View style={styles.metricIconCircle}>
                  <Ionicons name={m.icon as any} size={14} color="#2F3A56" />
                </View>
                <Text style={styles.metricTitle}>{m.title}</Text>
                <Text style={styles.metricSub}>{m.sub}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.allServicesProvider')}</Text>
            <Text style={styles.seeAll}>{t('common.seeAllProviders')}</Text>
          </View>

          <View style={styles.providerGrid}>
            {providers.map((p) => (
              <View key={p.id} style={[styles.providerCard, { width: providerCardWidth }]}>
                <Image source={{ uri: p.avatar }} style={styles.providerAvatar} />
                <Text style={styles.providerName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.providerRole} numberOfLines={1}>
                  {p.role}
                </Text>
                <View style={styles.providerRateRow}>
                  <Ionicons name="star" size={10} color="#F6C225" />
                  <Text style={styles.providerRate}>{p.rating}</Text>
                </View>
                <Text style={styles.providerPrice}>{p.price}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitleAlt}>{t('home.workingTime')}</Text>
          <Text style={styles.workTime}>{t('home.workingHours')}</Text>

          <Text style={styles.sectionTitleAlt}>{t('home.reviewsCount')}</Text>
          <View style={styles.reviewsList}>
            {reviews.map((r) => (
              <View key={r.id} style={styles.reviewItem}>
                <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewBody}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewName}>{r.name}</Text>
                    <View style={styles.reviewStars}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name="star" size={10} color="#F6C225" />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                  <Text style={styles.reviewText}>{r.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('MakeAppointment', {
              serviceName: name.replace('...', 'nance'),
              serviceImage: image,
            })
          }
        >
          <Text style={styles.actionText}>{t('common.makeAppointments')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingBottom: 116 },
  heroImage: { height: 276, justifyContent: 'flex-start' },
  backBtn: {
    marginTop: 50,
    marginStart: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    marginTop: -20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceName: { fontSize: 31 / 2, fontFamily: FontFamily.outfit.semiBold, color: '#177674' },
  price: { fontSize: 28 / 2, fontFamily: FontFamily.outfit.semiBold, color: '#1E2239' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  ratingText: { fontSize: 11, color: '#989BA8', fontFamily: FontFamily.outfit.regular },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 16 },
  metricItem: { alignItems: 'center', width: '24%' },
  metricIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  metricTitle: { fontSize: 14, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  metricSub: { fontSize: 10, color: '#8A90A2', fontFamily: FontFamily.outfit.regular },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 4 },
  sectionTitle: { fontSize: 13, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  seeAll: { fontSize: 12, color: Colors.primary, fontFamily: FontFamily.outfit.medium },
  providerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EAF0',
    borderRadius: 8,
    padding: 6,
  },
  providerAvatar: { width: 20, height: 20, borderRadius: 10, alignSelf: 'center', marginBottom: 4 },
  providerName: { fontSize: 9, color: '#1E2239', fontFamily: FontFamily.outfit.medium },
  providerRole: { fontSize: 7, color: '#8A90A2', fontFamily: FontFamily.outfit.regular, marginTop: 1 },
  providerRateRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 3 },
  providerRate: { fontSize: 8, color: '#8A90A2', fontFamily: FontFamily.outfit.regular },
  providerPrice: { fontSize: 8, color: '#1E2239', fontFamily: FontFamily.outfit.medium, marginTop: 2 },
  sectionTitleAlt: { fontSize: 30 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold, marginTop: 2, marginBottom: 5 },
  workTime: { fontSize: 12, color: '#6C7282', fontFamily: FontFamily.outfit.regular, marginBottom: 12 },
  reviewsList: {
    borderTopWidth: 1,
    borderTopColor: '#D4E8EA',
    marginTop: 2,
  },
  reviewItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D4E8EA',
  },
  reviewAvatar: { width: 52, height: 52, borderRadius: 26, marginTop: 2 },
  reviewBody: { flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewName: { fontSize: 21 / 2, color: '#1E2239', fontFamily: FontFamily.outfit.semiBold },
  reviewStars: { flexDirection: 'row', gap: 2, marginTop: 1 },
  reviewDate: { fontSize: 10, color: '#8A90A2', fontFamily: FontFamily.outfit.regular, marginBottom: 6, marginTop: 2 },
  reviewText: { fontSize: 18 / 2, color: '#535A6C', lineHeight: 14, fontFamily: FontFamily.outfit.regular, paddingEnd: 2 },
  bottomAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
    backgroundColor: '#F5F5F5',
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: { color: '#FFFFFF', fontSize: 18, fontFamily: FontFamily.outfit.semiBold },
});
