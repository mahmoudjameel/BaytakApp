import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';
import { BookingsService, Booking, BookingStatus } from '../../services/bookings.service';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type DisplayStatus = 'new' | 'in_progress' | 'completed';

const mapStatus = (status: BookingStatus): DisplayStatus => {
  if (status === 'PENDING' || status === 'CONFIRMED') return 'new';
  if (status === 'IN_PROGRESS') return 'in_progress';
  if (status === 'COMPLETED') return 'completed';
  return 'new';
};

export const ProviderOrderScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  const rtl = isRTL();
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookingsService.getMyBookings()
      .then((data) => setOrders(data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const STATUS_CONFIG: Record<DisplayStatus, { label: string; bg: string; color: string }> = {
    new: { label: t('providerOrder.status.newOrder'), bg: '#29B21F', color: '#FFFFFF' },
    in_progress: { label: t('providerOrder.status.inProgress'), bg: Colors.primary, color: '#FFFFFF' },
    completed: { label: t('providerOrder.status.completed'), bg: '#E8F5E9', color: '#2E7D32' },
  };

  const getTitle = (b: Booking) =>
    b.subCategory?.name ?? b.provider?.fullName ?? t('providerOrder.orderTitles.homeCleaning');

  const getTime = (b: Booking) =>
    b.startTime && b.endTime ? `${b.startTime} - ${b.endTime}` : '—';

  const getDate = (b: Booking) => {
    if (!b.scheduledDate) return '—';
    const d = new Date(b.scheduledDate);
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('providerOrder.title')}</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {orders.length === 0 && (
            <Text style={styles.emptyText}>{t('booking.empty', { status: '' })}</Text>
          )}
          {orders.map((order) => {
            const displayStatus = mapStatus(order.status);
            const statusCfg = STATUS_CONFIG[displayStatus];
            return (
              <View key={order.id} style={styles.card}>
                <View style={styles.iconCircle}>
                  <Image source={require('../../../assets/Services.png')} style={styles.orderIcon} resizeMode="contain" />
                </View>

                <View style={styles.cardContent}>
                  <View style={[styles.cardRow, rtl && styles.cardRowRtl]}>
                    <Text style={[styles.orderTitle, rtl && styles.textRtl]}>{getTitle(order)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                      <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                    </View>
                  </View>

                  <View style={[styles.metaRow, rtl && styles.metaRowRtl]}>
                    <View style={styles.metaItem}>
                      <Image source={require('../../../assets/Icon-Bold.png')} style={styles.metaIcon} resizeMode="contain" />
                      <Text style={styles.metaText}>{getTime(order)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Image source={require('../../../assets/Icon-Bold-1.png')} style={styles.metaIcon} resizeMode="contain" />
                      <Text style={styles.metaText}>{getDate(order)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 52, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerRtl: { flexDirection: 'row-reverse' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  list: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 22, gap: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 14, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  iconCircle: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#F5F6FA', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  orderIcon: { width: 30, height: 30 },
  cardContent: { flex: 1, gap: 7 },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardRowRtl: { flexDirection: 'row-reverse' },
  orderTitle: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', textAlign: 'left', flex: 1 },
  statusBadge: { minWidth: 102, alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontFamily: FontFamily.outfit.semiBold },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaRowRtl: { flexDirection: 'row-reverse' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaIcon: { width: 14, height: 14 },
  metaText: { fontSize: 13, fontFamily: FontFamily.outfit.regular, color: '#8A8FA0' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular },
});
