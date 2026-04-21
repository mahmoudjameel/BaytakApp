import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'MakeAppointment'>;

const dateOptionIds = ['1', '2', '3', '4', '5', '6'] as const;

const timeSlotKeys = ['timeSlots.t1', 'timeSlots.t2', 'timeSlots.t3', 'timeSlots.t4', 'timeSlots.t5', 'timeSlots.t6'] as const;

const weekdayKeys = ['weekdays.mon', 'weekdays.tu', 'weekdays.wed', 'weekdays.thu', 'weekdays.fri', 'weekdays.sat'] as const;

export const MakeAppointmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [selectedDateId, setSelectedDateId] = useState('4');
  const [selectedTimeKey, setSelectedTimeKey] = useState<string>('timeSlots.t2');
  const [promo, setPromo] = useState('');

  const { serviceName, serviceImage } = route.params;

  const dateOptions = useMemo(
    () =>
      dateOptionIds.map((id, idx) => ({
        id,
        day: t(weekdayKeys[idx]),
        num: ['21', '22', '23', '24', '25', '26'][idx],
      })),
    [t],
  );

  const timeOptions = useMemo(() => timeSlotKeys.map((k) => ({ key: k, label: t(k) })), [t]);

  const summary = useMemo(
    () => ({
      consultation: 100,
      vat: 100,
      total: 200,
    }),
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name={backChevronIcon()} size={22} color="#1E2239" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('common.makeAppointment')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.serviceCard}>
          <Image source={{ uri: serviceImage }} style={styles.serviceImage} />
          <View style={styles.serviceBody}>
            <Text style={styles.serviceTitle} numberOfLines={1}>
              {serviceName}
            </Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={13} color="#F6C225" />
              ))}
            </View>
            <Text style={styles.serviceDesc} numberOfLines={2}>
              {t('makeAppointment.serviceDescription')}
            </Text>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>{t('common.selectDate')}</Text>
          <Text style={styles.monthText}>{t('common.monthJuly')}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
          {dateOptions.map((item) => {
            const selected = item.id === selectedDateId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.dateItem, selected && styles.dateItemSelected]}
                onPress={() => setSelectedDateId(item.id)}
                activeOpacity={0.85}
              >
                <Text style={[styles.dateDay, selected && styles.dateTextSelected]}>{item.day}</Text>
                <Text style={[styles.dateNum, selected && styles.dateTextSelected]}>{item.num}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>{t('common.time')}</Text>
        <View style={styles.timeGrid}>
          {timeOptions.map((time) => {
            const selected = time.key === selectedTimeKey;
            return (
              <TouchableOpacity
                key={time.key}
                style={[styles.timeItem, selected && styles.timeItemSelected]}
                onPress={() => setSelectedTimeKey(time.key)}
                activeOpacity={0.85}
              >
                <Text style={[styles.timeText, selected && styles.timeTextSelected]}>{time.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.clientBox}>
          <Text style={styles.clientTitle}>{t('common.clientInformation')}</Text>
          <View style={styles.clientRow}>
            <View style={styles.clientLeft}>
              <View style={styles.radioActive}>
                <View style={styles.radioInner} />
              </View>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80' }}
                style={styles.clientAvatar}
              />
              <View>
                <Text style={styles.clientName}>{t('makeAppointment.clientName')}</Text>
                <Text style={styles.clientMeta}>{t('makeAppointment.clientMeta')}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addAddressBtn} onPress={() => navigation.navigate('AddAddress')}>
              <Text style={styles.addAddressText}>{t('common.addNewAddress')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>{t('common.paymentDetails')}</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t('common.consultationFee')}</Text>
            <Text style={styles.paymentValue}>
              {summary.consultation}
              {t('common.sar')}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t('common.vat')}</Text>
            <Text style={styles.paymentValue}>
              {summary.vat}
              {t('common.sar')}
            </Text>
          </View>
          <View style={styles.paymentDivider} />
          <View style={styles.paymentRow}>
            <Text style={styles.paymentTotalLabel}>{t('common.netAmount')}</Text>
            <Text style={styles.paymentTotalValue}>
              {summary.total}
              {t('common.sar')}
            </Text>
          </View>
        </View>

        <View style={styles.promoRow}>
          <TextInput
            value={promo}
            onChangeText={setPromo}
            placeholder={t('common.havePromoCode')}
            placeholderTextColor="#B5B9C7"
            style={styles.promoInput}
          />
          <TouchableOpacity style={styles.applyBtn}>
            <Text style={styles.applyText}>{t('common.apply')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.mainActionBtn} activeOpacity={0.9}>
          <Text style={styles.mainActionText}>{t('common.makeAppointments')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 112 },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 30 / 2, color: '#1E2239', fontFamily: FontFamily.outfit.semiBold },
  headerSpacer: { width: 34 },
  serviceCard: {
    marginTop: 10,
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#EFEFF1',
    flexDirection: 'row',
    gap: 10,
  },
  serviceImage: { width: 112, height: 110, borderRadius: 10 },
  serviceBody: { flex: 1, paddingVertical: 2 },
  serviceTitle: { fontSize: 15, color: '#1E2239', fontFamily: FontFamily.outfit.semiBold },
  starsRow: { flexDirection: 'row', gap: 1, marginTop: 3 },
  serviceDesc: { marginTop: 4, fontSize: 11, lineHeight: 14, color: '#666D80', fontFamily: FontFamily.outfit.regular },
  rowBetween: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 34 / 2, color: '#161A30', fontFamily: FontFamily.outfit.semiBold },
  monthText: { fontSize: 15, color: '#6D7383', fontFamily: FontFamily.outfit.medium },
  datesRow: { gap: 8, marginTop: 8 },
  dateItem: {
    width: 58,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#ECEEF3',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dateItemSelected: { backgroundColor: Colors.primary },
  dateDay: { fontSize: 14, color: '#8A90A2', fontFamily: FontFamily.outfit.medium },
  dateNum: { fontSize: 16, color: '#697083', fontFamily: FontFamily.outfit.semiBold },
  dateTextSelected: { color: '#FFFFFF' },
  timeGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  timeItem: {
    width: '31%',
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ECEEF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeItemSelected: { backgroundColor: Colors.primary },
  timeText: { fontSize: 16, color: '#4D5364', fontFamily: FontFamily.outfit.medium },
  timeTextSelected: { color: '#FFFFFF' },
  clientBox: { marginTop: 14, backgroundColor: '#EFEFF1', borderRadius: 12, padding: 12 },
  clientTitle: { fontSize: 33 / 2, color: '#1A1F34', fontFamily: FontFamily.outfit.semiBold, marginBottom: 10, textTransform: 'lowercase' },
  clientRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  clientLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radioActive: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2DB99B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2DB99B' },
  clientAvatar: { width: 34, height: 34, borderRadius: 17 },
  clientName: { fontSize: 14, color: '#1E2239', fontFamily: FontFamily.outfit.medium },
  clientMeta: { fontSize: 11, color: '#8A90A2', fontFamily: FontFamily.outfit.regular },
  addAddressBtn: {
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAddressText: { color: '#FFFFFF', fontSize: 12, fontFamily: FontFamily.outfit.medium },
  paymentBox: { marginTop: 10, backgroundColor: '#EFEFF1', borderRadius: 12, padding: 12 },
  paymentTitle: { fontSize: 18, color: '#1A1F34', fontFamily: FontFamily.outfit.semiBold, marginBottom: 8 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  paymentLabel: { fontSize: 14, color: '#3E465B', fontFamily: FontFamily.outfit.regular },
  paymentValue: { fontSize: 14, color: '#1A1F34', fontFamily: FontFamily.outfit.semiBold },
  paymentDivider: { borderTopWidth: 1, borderTopColor: '#D7DAE2', borderStyle: 'dashed', marginVertical: 4 },
  paymentTotalLabel: { fontSize: 16, color: '#1A1F34', fontFamily: FontFamily.outfit.medium },
  paymentTotalValue: { fontSize: 16, color: '#1A1F34', fontFamily: FontFamily.outfit.semiBold },
  promoRow: { marginTop: 10, flexDirection: 'row', gap: 10 },
  promoInput: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A8ADB9',
    paddingHorizontal: 10,
    color: '#1E2239',
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    backgroundColor: '#F5F5F5',
    textAlign: 'auto',
  },
  applyBtn: {
    width: 106,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  applyText: { color: Colors.primary, fontSize: 16, fontFamily: FontFamily.outfit.medium },
  bottomAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  mainActionBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainActionText: { color: '#FFFFFF', fontSize: 34 / 2, fontFamily: FontFamily.outfit.semiBold },
});
