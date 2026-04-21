import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

const PAYEES = ['1', '2', '3', '4', '5'];

export const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('wallet.title')}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceAmount}>{t('wallet.totalAmount')}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceMeta}>
              <Text style={styles.metaLabel}>{t('wallet.dueLabel')}</Text>
              <Text style={styles.metaValue}>{t('wallet.dueAmount')}</Text>
            </View>
            <View style={styles.balanceMeta}>
              <Text style={[styles.metaLabel, styles.metaLabelRight]}>{t('wallet.totalPaymentLabel')}</Text>
              <Text style={[styles.metaValue, styles.metaValueRight]}>{t('wallet.totalPaymentAmount')}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.makePaymentsBtn} activeOpacity={0.85}>
            <Text style={styles.makePaymentsBtnText}>{t('wallet.makePayments')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('wallet.paymentSection')}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>{t('wallet.seeAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dueDateRow}>
          <Text style={styles.dueDate}>{t('wallet.dueDate')} </Text>
          <Text style={styles.dueDays}>{t('wallet.dueDays')}</Text>
        </View>

        <View style={styles.paymentList}>
          {PAYEES.map((id) => (
            <View key={id} style={styles.paymentItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>Moh</Text>
              </View>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentTopRow}>
                  <Text style={styles.payeeName}>{t('wallet.payeeName')}</Text>
                  <Text style={styles.payeeAmount}>{t('wallet.payeeAmount')}</Text>
                </View>
                <Text style={styles.payeeDesc} numberOfLines={2}>
                  {t('wallet.payeeDesc')}{' '}
                  <Text style={styles.readMore}>{t('wallet.readMore')}</Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F7' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceAmount: {
    fontSize: 28,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
    textAlign: 'center',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceMeta: { gap: 2 },
  metaLabel: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
  },
  metaLabelRight: { textAlign: 'right' },
  metaValue: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  metaValueRight: { textAlign: 'right' },
  makePaymentsBtn: {
    borderWidth: 1,
    borderColor: '#C8E6C9',
    backgroundColor: '#F1FAF1',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makePaymentsBtnText: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.medium,
    color: '#1B1D36',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dueDate: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.medium,
    color: '#1B1D36',
  },
  dueDays: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.primary,
  },
  paymentList: { backgroundColor: '#FFFFFF' },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#FFFFFF',
  },
  paymentInfo: { flex: 1, gap: 4 },
  paymentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payeeName: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  payeeAmount: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  payeeDesc: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    lineHeight: 18,
  },
  readMore: {
    color: Colors.primary,
    fontFamily: FontFamily.outfit.medium,
  },
});
