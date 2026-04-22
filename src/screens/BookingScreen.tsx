import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '../theme/typography';
import { backArrowIcon, isRTL } from '../utils/rtl';

type BookingFilter = 'upcoming' | 'past' | 'cancel';

const filters: BookingFilter[] = ['upcoming', 'past', 'cancel'];

export const BookingScreen = () => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [activeFilter, setActiveFilter] = useState<BookingFilter>('upcoming');

  const bookings = useMemo(
    () => [
      {
        id: '1',
        name: t('booking.serviceName'),
        date: t('booking.dateSample'),
        time: t('booking.timeSample'),
        location: t('booking.locationSample'),
        status: 'upcoming' as BookingFilter,
        image: require('../../assets/offer/Frame 1171279031.png'),
      },
      {
        id: '2',
        name: t('booking.serviceName'),
        date: t('booking.dateSample'),
        time: t('booking.timeSample'),
        location: t('booking.locationSample'),
        status: 'upcoming' as BookingFilter,
        image: require('../../assets/offer/Frame 1171279031.png'),
      },
      {
        id: '3',
        name: t('booking.serviceName'),
        date: t('booking.dateSample'),
        time: t('booking.timeSample'),
        location: t('booking.locationSample'),
        status: 'upcoming' as BookingFilter,
        image: require('../../assets/offer/Frame 1171279031.png'),
      },
    ],
    [t],
  );

  const filtered = bookings.filter((b) => b.status === activeFilter);

  const filterLabel = (f: BookingFilter) =>
    f === 'upcoming' ? t('booking.filterUpcoming') : f === 'past' ? t('booking.filterPast') : t('booking.filterCancel');

  const emptyStatusLabel = filterLabel(activeFilter);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name={backArrowIcon()} size={23} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('booking.title')}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={21} color="#1B1D36" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.9}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{filterLabel(f)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={styles.topRow}>
              <Image source={item.image} style={styles.serviceImage} />
              <View style={styles.infoCol}>
                <View style={styles.metaRow}>
                  <Ionicons name="calendar-outline" size={18} color="#96A0AF" />
                  <Text style={styles.metaTextStrong}>{item.date}</Text>
                  <Text style={styles.sep}>|</Text>
                  <Ionicons name="time-outline" size={18} color="#96A0AF" />
                  <Text style={styles.metaTextStrong}>{item.time}</Text>
                </View>
                <Text style={styles.cardName}>{item.name}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="location" size={18} color="#96A0AF" />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.ratingBtn}>
                <Text style={styles.ratingText}>{t('common.rating')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailBtn}>
                <Text style={styles.detailText}>{t('common.detail')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>{t('booking.empty', { status: emptyStatusLabel })}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAF0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: { fontSize: 35 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F2F6',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 6,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: { backgroundColor: '#157E7A' },
  filterText: { fontSize: 16, color: '#B2B6C0', fontFamily: FontFamily.outfit.medium },
  filterTextActive: { color: '#FFFFFF', fontFamily: FontFamily.outfit.semiBold },
  list: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E1E4EB',
    padding: 12,
  },
  topRow: { flexDirection: 'row' },
  serviceImage: { width: 98, height: 98, borderRadius: 12 },
  infoCol: { flex: 1, paddingStart: 10, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTextStrong: { fontSize: 15, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  sep: { fontSize: 18, color: '#C9CDD7' },
  cardName: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold, lineHeight: 24 },
  locationText: { fontSize: 15, color: '#9AA0AE', fontFamily: FontFamily.outfit.medium },
  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  ratingBtn: {
    flex: 1,
    height: 52,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D7DAE2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  ratingText: { fontSize: 34 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  detailBtn: {
    flex: 1,
    height: 52,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#157E7A',
  },
  detailText: { fontSize: 34 / 2, color: '#FFFFFF', fontFamily: FontFamily.outfit.medium },
  emptyWrap: { alignItems: 'center', paddingTop: 70 },
  emptyText: { fontSize: 16, color: '#9AA0AE', fontFamily: FontFamily.outfit.medium },
});
