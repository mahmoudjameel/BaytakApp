import React from 'react';
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
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'Invoice'>;

export const InvoiceScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('invoice.title')}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color="#1B1D36" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../../assets/offer/Frame 1171279031.png')}
              style={styles.providerImage}
              resizeMode="cover"
            />
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.providerName}>{t('invoice.providerName')}</Text>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={13} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.email}>{t('invoice.providerEmail')}</Text>

        <View style={styles.invoiceCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>{t('invoice.timeTaken')}</Text>
              <Text style={styles.infoValue}>{t('invoice.timeValue')}</Text>
            </View>
            <View style={styles.infoColRight}>
              <Text style={styles.infoLabel}>{t('invoice.bookingId')}</Text>
              <Text style={styles.infoValue}>{t('invoice.bookingIdValue')}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.providerCol}>
            <Text style={styles.infoLabel}>{t('invoice.serviceProvider')}</Text>
            <Text style={styles.infoValue}>{t('invoice.serviceProviderName')}</Text>
          </View>

          <TouchableOpacity style={styles.totalBtn} activeOpacity={0.85}>
            <Text style={styles.totalBtnText}>{t('invoice.totalPayment')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentMethodRow}>
          <View style={styles.visaBadge}>
            <Text style={styles.visaText}>VISA</Text>
          </View>
          <View style={styles.paymentMethodInfo}>
            <Text style={styles.paymentMethodTitle}>{t('invoice.paymentMethod')}</Text>
            <Text style={styles.cardNumber}>{t('invoice.cardNumber')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.backHomeBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.backHomeBtnText}>{t('invoice.backHome')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' },
  avatarSection: { marginTop: 24, marginBottom: 16, alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  providerImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F1E3',
  },
  plusBadge: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 20,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
  },
  editBadge: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  email: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    marginBottom: 24,
  },
  invoiceCard: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 14,
    borderStyle: 'dashed',
    padding: 18,
    marginBottom: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoCol: { flex: 1, gap: 4 },
  infoColRight: { flex: 1, alignItems: 'flex-end', gap: 4 },
  infoLabel: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
  },
  divider: { height: 1, backgroundColor: '#EDEFF3' },
  providerCol: { alignItems: 'center', gap: 4 },
  totalBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  totalBtnText: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#FFFFFF',
  },
  paymentMethodRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDEFF3',
  },
  visaBadge: {
    width: 52,
    height: 34,
    borderRadius: 6,
    backgroundColor: '#1A1F71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visaText: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  paymentMethodInfo: { flex: 1, gap: 2 },
  paymentMethodTitle: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.primary,
  },
  cardNumber: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDEFF3',
    backgroundColor: '#FFFFFF',
  },
  backHomeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeBtnText: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#FFFFFF',
  },
});
