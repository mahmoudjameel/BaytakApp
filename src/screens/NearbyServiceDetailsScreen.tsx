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
import { backChevronIcon, isRTL } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'NearbyServiceDetails'>;

export const NearbyServiceDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const { name, priceMain, priceUnit, image } = route.params;
  const { width } = useWindowDimensions();
  // 4 cards per row: (screen - content horizontal padding - 3 gaps) / 4
  const providerCardWidth = Math.floor((width - 36 - 24) / 4);

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

  const metrics = useMemo((): Array<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    sub: string;
  }> => [
    { icon: 'people', title: t('home.clientsPlus'), sub: t('home.metricClient') },
    { icon: 'briefcase', title: t('home.yearsPlus'), sub: t('home.metricExperience') },
    { icon: 'star', title: '4.9', sub: t('home.metricRating') },
    { icon: 'chatbubble', title: t('home.reviewsPlus'), sub: t('home.metricReviews') },
  ], [t]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ImageBackground source={{ uri: image }} style={styles.heroImage}>
          <TouchableOpacity style={[styles.backBtn, rtl ? styles.backBtnRtl : styles.backBtnLtr]} onPress={() => navigation.goBack()}>
            <Ionicons name={backChevronIcon()} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.contentCard}>
          <View style={styles.pagerDots}>
            {[0, 1, 2, 3, 4].map((dot) => (
              <View key={dot} style={[styles.pagerDot, dot === 0 && styles.pagerDotActive]} />
            ))}
          </View>

          <View style={[styles.nameRow, rtl && styles.rowRtl]}>
            <Text style={[styles.serviceName, rtl && styles.textRtl]}>{name.replace('...', 'nance')}</Text>
            <Text style={[styles.price, rtl && styles.textRtl]}>
              {priceMain} {priceUnit}
            </Text>
          </View>

          <View style={[styles.ratingRow, rtl && styles.rowRtl]}>
            <Ionicons name="star" size={12} color="#F6C225" />
            <Text style={[styles.ratingText, rtl && styles.textRtl]}>4.8</Text>
          </View>

          <View style={styles.metricsRow}>
            {metrics.map((m) => (
              <View key={m.title} style={styles.metricItem}>
                <View style={styles.metricIconCircle}>
                  <Ionicons name={m.icon} size={14} color="#2F3A56" />
                </View>
                <Text style={[styles.metricTitle, rtl && styles.textRtl]}>{m.title}</Text>
                <Text style={[styles.metricSub, rtl && styles.textRtl]}>{m.sub}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.sectionHeader, rtl && styles.rowRtl]}>
            <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('home.allServicesProvider')}</Text>
            <Text style={[styles.seeAll, rtl && styles.textRtl]}>{t('common.seeAllProviders')}</Text>
          </View>

          <View style={[styles.providerGrid, rtl && styles.providerGridRtl]}>
            {providers.map((p) => (
              <View key={p.id} style={[styles.providerCard, { width: providerCardWidth }]}>
                <Image source={{ uri: p.avatar }} style={styles.providerAvatar} />
                <Text style={[styles.providerName, rtl && styles.textRtl]} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={[styles.providerRole, rtl && styles.textRtl]} numberOfLines={1}>
                  {p.role}
                </Text>
                <View style={[styles.providerRateRow, rtl && styles.rowRtl]}>
                  <Ionicons name="star" size={10} color="#F6C225" />
                  <Text style={[styles.providerRate, rtl && styles.textRtl]}>{p.rating}</Text>
                </View>
                <Text style={[styles.providerPrice, rtl && styles.textRtl]}>{p.price}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitleAlt, rtl && styles.textRtl]}>{t('home.workingTime')}</Text>
          <Text style={[styles.workTime, rtl && styles.textRtl]}>{t('home.workingHours')}</Text>

          <Text style={[styles.sectionTitleAlt, rtl && styles.textRtl]}>{t('home.reviewsCount')}</Text>
          <View style={styles.reviewsList}>
            {reviews.map((r) => (
              <View key={r.id} style={[styles.reviewItem, rtl && styles.rowRtl]}>
                <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewBody}>
                  <View style={[styles.reviewHeader, rtl && styles.rowRtl]}>
                    <Text style={[styles.reviewName, rtl && styles.textRtl]}>{r.name}</Text>
                    <View style={[styles.reviewStars, rtl && styles.rowRtl]}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name="star" size={10} color="#F6C225" />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.reviewDate, rtl && styles.textRtl]}>{r.date}</Text>
                  <Text style={[styles.reviewText, rtl && styles.textRtl]}>{r.text}</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 116 },
  heroImage: { height: 345, justifyContent: 'flex-start' },
  backBtn: {
    marginTop: 50,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnLtr: { marginStart: 16, alignSelf: 'flex-start' },
  backBtnRtl: { marginEnd: 16, alignSelf: 'flex-end' },
  contentCard: {
    marginTop: -34,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
  },
  pagerDots: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCE4D9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 14,
  },
  pagerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F4F7F3',
  },
  pagerDotActive: {
    backgroundColor: Colors.primary,
  },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowRtl: { flexDirection: 'row-reverse' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  serviceName: { fontSize: 35 / 2, fontFamily: FontFamily.outfit.semiBold, color: '#177674' },
  price: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#1E2239' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: 12, color: '#989BA8', fontFamily: FontFamily.outfit.regular },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 18 },
  metricItem: { alignItems: 'center', width: '24%' },
  metricIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  metricTitle: { fontSize: 31 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  metricSub: { fontSize: 12, color: '#8A90A2', fontFamily: FontFamily.outfit.regular },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 6 },
  sectionTitle: { fontSize: 15, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  seeAll: { fontSize: 14, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  providerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  providerGridRtl: { flexDirection: 'row-reverse' },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EAF0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  providerAvatar: { width: 24, height: 24, borderRadius: 12, alignSelf: 'center', marginBottom: 6 },
  providerName: { fontSize: 9.5, color: '#1E2239', fontFamily: FontFamily.outfit.medium, textAlign: 'center' },
  providerRole: { fontSize: 8, color: '#8A90A2', fontFamily: FontFamily.outfit.regular, marginTop: 2, textAlign: 'center' },
  providerRateRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 3 },
  providerRate: { fontSize: 8, color: '#8A90A2', fontFamily: FontFamily.outfit.regular },
  providerPrice: { fontSize: 8.5, color: '#1E2239', fontFamily: FontFamily.outfit.medium, marginTop: 3, textAlign: 'center' },
  sectionTitleAlt: { fontSize: 34 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold, marginTop: 4, marginBottom: 6 },
  workTime: { fontSize: 17 / 2, color: '#4E5568', fontFamily: FontFamily.outfit.medium, marginBottom: 14 },
  reviewsList: {
    marginTop: 0,
  },
  reviewItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
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
    backgroundColor: '#FFFFFF',
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
