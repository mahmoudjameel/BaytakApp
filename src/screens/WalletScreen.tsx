import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { WalletService, Wallet, WalletTransaction } from '../services/wallet.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

export const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      WalletService.getWallet().catch(() => null),
      WalletService.getTransactions().catch(() => []),
    ]).then(([w, txs]) => {
      setWallet(w);
      setTransactions(txs ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const currency = wallet?.currency ?? 'SAR';
  const balance = wallet?.balance ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('wallet.title')}</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceAmount}>{balance} {currency}</Text>
            <View style={[styles.balanceRow, rtl && styles.balanceRowRtl]}>
              <View style={styles.balanceMeta}>
                <Text style={[styles.metaLabel, rtl && styles.metaLabelRtl]}>{t('wallet.dueLabel')}</Text>
                <Text style={[styles.metaValue, rtl && styles.metaValueRtl]}>0 {currency}</Text>
              </View>
              <View style={styles.balanceMeta}>
                <Text style={[styles.metaLabel, styles.metaLabelRight, rtl && styles.metaLabelRtl]}>{t('wallet.totalPaymentLabel')}</Text>
                <Text style={[styles.metaValue, styles.metaValueRight, rtl && styles.metaValueRtl]}>{balance} {currency}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.makePaymentsBtn} activeOpacity={0.85}>
              <Text style={styles.makePaymentsBtnText}>{t('wallet.makePayments')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.sectionHeader, rtl && styles.sectionHeaderRtl]}>
            <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('wallet.paymentSection')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('wallet.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.paymentList}>
            {transactions.length === 0 && (
              <Text style={[styles.emptyText, { paddingVertical: 20 }]}>{t('common.noResults')}</Text>
            )}
            {transactions.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={[styles.paymentItem, rtl && styles.paymentItemRtl]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Invoice')}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{String(tx.amount).slice(0, 3)}</Text>
                </View>
                <View style={styles.paymentInfo}>
                  <View style={[styles.paymentTopRow, rtl && styles.paymentTopRowRtl]}>
                    <Text style={[styles.payeeName, rtl && styles.textRtl]}>{tx.description ?? t('wallet.payeeName')}</Text>
                    <Text style={styles.payeeAmount}>{tx.amount} {currency}</Text>
                  </View>
                  <Text style={[styles.payeeDesc, rtl && styles.textRtl]} numberOfLines={2}>
                    {tx.reference ?? ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F7' },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between', backgroundColor: '#FFFFFF' },
  headerRtl: { flexDirection: 'row-reverse' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  balanceCard: { backgroundColor: '#FFFFFF', margin: 16, borderRadius: 16, padding: 20, gap: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  balanceAmount: { fontSize: 28, fontFamily: FontFamily.outfit.bold, color: '#1B1D36', textAlign: 'center' },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceRowRtl: { flexDirection: 'row-reverse' },
  balanceMeta: { gap: 2 },
  metaLabel: { fontSize: 12, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE' },
  metaLabelRight: { textAlign: 'right' },
  metaLabelRtl: { textAlign: 'right', writingDirection: 'rtl' },
  metaValue: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  metaValueRight: { textAlign: 'right' },
  metaValueRtl: { textAlign: 'right', writingDirection: 'rtl' },
  makePaymentsBtn: { borderWidth: 1, borderColor: '#C8E6C9', backgroundColor: '#F1FAF1', borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
  makePaymentsBtnText: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 4 },
  sectionHeaderRtl: { flexDirection: 'row-reverse' },
  sectionTitle: { fontSize: 17, fontFamily: FontFamily.outfit.bold, color: '#1B1D36' },
  seeAll: { fontSize: 14, fontFamily: FontFamily.outfit.medium, color: '#1B1D36' },
  paymentList: { backgroundColor: '#FFFFFF' },
  paymentItem: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  paymentItemRtl: { flexDirection: 'row-reverse' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 12, fontFamily: FontFamily.outfit.semiBold, color: '#FFFFFF' },
  paymentInfo: { flex: 1, gap: 4 },
  paymentTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentTopRowRtl: { flexDirection: 'row-reverse' },
  payeeName: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  payeeAmount: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  payeeDesc: { fontSize: 12, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE', lineHeight: 18 },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  emptyText: { textAlign: 'center', fontSize: 14, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular },
});
