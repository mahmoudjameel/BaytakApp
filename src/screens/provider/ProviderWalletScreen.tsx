import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';
import { WalletService, Wallet, WalletTransaction } from '../../services/wallet.service';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const ProviderWalletScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
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

  const getAmountDisplay = (tx: WalletTransaction) => {
    const sign = tx.amount >= 0 ? '+' : '';
    return `${sign}${tx.amount} ${currency}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('providerWallet.title')}</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <LinearGradient colors={['#1F7572', '#147672']} style={styles.balanceCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.cardDecor} />
            <Text style={styles.balanceLabel}>{t('providerWallet.availableBalance')}</Text>
            <Text style={styles.balanceAmount}>{balance} {currency}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
                <View style={[styles.actionIconCircle, { backgroundColor: '#FF3B30' }]}>
                  <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.actionBtnText}>{t('providerWallet.transfers')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
                <View style={[styles.actionIconCircle, { backgroundColor: '#34C759' }]}>
                  <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.actionBtnText}>{t('providerWallet.deposits')}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('providerWallet.transactions')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionList}>
            {transactions.length === 0 && (
              <Text style={styles.emptyText}>{t('common.noResults')}</Text>
            )}
            {transactions.map((tx, index) => (
              <View key={tx.id}>
                <View style={[styles.txItem, rtl && styles.txItemRtl]}>
                  <View style={styles.txContent}>
                    <Text style={[styles.txName, rtl && styles.textRtl]}>{tx.description ?? t('providerWallet.service.homeCleaning')}</Text>
                    <Text style={[styles.txMeta, rtl && styles.textRtl]}>
                      {tx.reference ?? ''} {tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Text>
                  </View>
                  <Text style={[styles.txAmount, { color: tx.amount >= 0 ? '#34C759' : '#FF3B30' }]}>{getAmountDisplay(tx)}</Text>
                </View>
                {index < transactions.length - 1 && <View style={styles.txDivider} />}
              </View>
            ))}
          </View>
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
  scroll: { padding: 16, gap: 20, paddingBottom: 24 },
  balanceCard: { borderRadius: 20, padding: 20, gap: 8, overflow: 'hidden', position: 'relative' },
  cardDecor: { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)' },
  balanceLabel: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  balanceAmount: { fontSize: 36, fontFamily: FontFamily.outfit.bold, color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 40, paddingVertical: 10, gap: 8 },
  actionIconCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 13, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 17, fontFamily: FontFamily.outfit.bold, color: '#1B1D36', textAlign: 'left' },
  seeAll: { fontSize: 14, fontFamily: FontFamily.outfit.medium, color: '#1B1D36' },
  transactionList: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16 },
  txItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  txItemRtl: { flexDirection: 'row-reverse' },
  txContent: { flex: 1 },
  txName: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', marginBottom: 2, textAlign: 'left' },
  txMeta: { fontSize: 12, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE', textAlign: 'left' },
  txAmount: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold },
  txDivider: { height: 1, borderWidth: 0.5, borderColor: '#E0E0E0', borderStyle: 'dashed' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  emptyText: { textAlign: 'center', paddingVertical: 20, fontSize: 14, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular },
});
