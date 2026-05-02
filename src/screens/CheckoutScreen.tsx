import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '../theme/typography';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;
type Method = 'milestones' | 'full' | 'apple' | 'cash';

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);

  const paymentOptions: { key: Method; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
    { key: 'full', icon: 'card', label: t('checkout.fullPayment') },
    { key: 'apple', icon: 'logo-apple', label: t('checkout.applePay') },
    { key: 'cash', icon: 'logo-usd', label: t('checkout.cash') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, rtl && styles.headerRtl]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('checkout.title')}</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={20} color="#1B1D36" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={[styles.productCard, rtl && styles.productCardRtl]}>
          <View style={styles.productImageFallback}>
            <Image source={require('../../assets/service.png')} style={styles.productFallbackIcon} resizeMode="contain" />
          </View>
          <View style={styles.productBody}>
            <View style={[styles.productTopRow, rtl && styles.productTopRowRtl]}>
              <Text style={[styles.productName, rtl && styles.textRtl]} numberOfLines={1}>
                {t('checkout.companyName')}
              </Text>
            </View>
            <View style={[styles.starsRow, rtl && styles.starsRowRtl]}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name="star" size={13} color="#F6C225" />
              ))}
            </View>
            <Text style={[styles.productDesc, rtl && styles.textRtl]} numberOfLines={2}>
              {t('checkout.productDescription')}
            </Text>
          </View>
        </View>

        <View style={[styles.metaWrap, rtl && styles.metaWrapRtl]}>
          <View style={[styles.metaItem, rtl && styles.metaItemRtl]}>
            <View style={styles.metaIconBox}>
              <Ionicons name="sparkles-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={[styles.metaText, rtl && styles.textRtl]}>{t('checkout.serviceLine')}</Text>
          </View>
          <View style={[styles.metaItem, rtl && styles.metaItemRtl]}>
            <View style={styles.metaIconBox}>
              <Ionicons name="location-sharp" size={18} color={Colors.primary} />
            </View>
            <Text style={[styles.metaText, rtl && styles.textRtl]}>{t('checkout.locationLine')}</Text>
          </View>
          <View style={[styles.metaItem, rtl && styles.metaItemRtl]}>
            <View style={styles.metaIconBox}>
              <Ionicons name="time" size={18} color={Colors.primary} />
            </View>
            <Text style={[styles.metaText, rtl && styles.textRtl]}>{t('checkout.durationLine')}</Text>
          </View>
        </View>

        <View style={[styles.expertCard, rtl && styles.expertCardRtl]}>
          <View style={[styles.expertLeft, rtl && styles.expertLeftRtl]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' }}
              style={styles.expertAvatar}
            />
            <View>
              <Text style={[styles.expertName, rtl && styles.textRtl]}>{t('checkout.expertName')}</Text>
              <Text style={[styles.expertRole, rtl && styles.textRtl]}>{t('checkout.expertRole')}</Text>
            </View>
          </View>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color={Colors.primary}
            style={rtl ? styles.expertChatRtl : undefined}
          />
        </View>

        <View style={styles.optionsList}>
          {paymentOptions.map((option) => {
            const selected = selectedMethod === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.optionCard,
                  rtl && styles.optionCardRtl,
                ]}
                activeOpacity={0.85}
                onPress={() => setSelectedMethod(option.key)}
              >
                <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Ionicons
                  name={option.icon}
                  size={26}
                  color="#292E42"
                  style={styles.optionIcon}
                />
                <Text style={[styles.optionText, rtl && styles.textRtl]}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => navigation.navigate('AddPayment')}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmText}>{t('common.confirmPayment')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F6' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 110 },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerRtl: { flexDirection: 'row-reverse' },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAF0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  notifDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F80000',
    top: 11,
    right: 11,
  },
  productCard: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  productCardRtl: { flexDirection: 'row-reverse' },
  productImageFallback: {
    width: 142,
    height: 142,
    borderRadius: 12,
    backgroundColor: '#EDEFF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productFallbackIcon: {
    width: 88,
    height: 88,
    tintColor: Colors.primary,
  },
  productBody: { flex: 1, justifyContent: 'center' },
  productTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productTopRowRtl: { flexDirection: 'row-reverse' },
  productName: { flex: 1, fontSize: 22 / 2 * 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  starsRow: { flexDirection: 'row', gap: 3, marginTop: 6 },
  starsRowRtl: { flexDirection: 'row-reverse', alignSelf: 'flex-start' },
  productDesc: { marginTop: 6, fontSize: 15, lineHeight: 22, color: '#62697A', fontFamily: FontFamily.outfit.regular },
  metaWrap: {
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 14,
    rowGap: 10,
  },
  metaWrapRtl: {
    flexDirection: 'row-reverse',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItemRtl: {
    flexDirection: 'row-reverse',
  },
  metaIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EDF4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaText: {
    fontSize: 16,
    color: '#596074',
    fontFamily: FontFamily.outfit.medium,
  },
  expertCard: {
    marginBottom: 14,
    backgroundColor: '#ECEFF4',
    borderRadius: 12,
    height: 76,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expertCardRtl: {
    flexDirection: 'row-reverse',
  },
  expertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expertLeftRtl: {
    flexDirection: 'row-reverse',
  },
  expertChatRtl: {
    transform: [{ scaleX: -1 }],
  },
  expertAvatar: { width: 42, height: 42, borderRadius: 21 },
  expertName: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  expertRole: { fontSize: 14, color: '#757D8F', fontFamily: FontFamily.outfit.regular },
  optionsList: { gap: 10, marginBottom: 14 },
  optionCard: {
    height: 78,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8DCE6',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  optionCardRtl: { flexDirection: 'row-reverse' },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CDD1DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  optionIcon: { marginHorizontal: 14 },
  optionText: { fontSize: 35 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#F4F4F6',
  },
  confirmBtn: {
    height: 60,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#157E7A',
  },
  confirmText: { color: '#FFFFFF', fontSize: 36 / 2, fontFamily: FontFamily.outfit.semiBold },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
});
