import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontFamily } from '../theme/typography';
import { backArrowIcon, isRTL } from '../utils/rtl';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const CartScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const rtl = isRTL();
  const [items, setItems] = useState([
    { id: '1', price: 30, rating: '4.8', qty: 1 },
    { id: '2', price: 30, rating: '4.8', qty: 1 },
  ]);
  const [promo, setPromo] = useState('');

  const updateQty = (id: string, delta: number) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, rtl && styles.headerRtl]}>
          <TouchableOpacity style={styles.backBtn}>
            <Ionicons name={backArrowIcon()} size={22} color="#1B1D36" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('cart.title')}</Text>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={20} color="#1B1D36" />
            <View style={styles.redDot} />
          </TouchableOpacity>
        </View>

        {items.map((item) => (
          <View key={item.id} style={[styles.productCard, rtl && styles.productCardRtl]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1565802681622-8e7f6f4cd3b4?auto=format&fit=crop&w=240&q=80' }}
              style={styles.productImage}
            />
            <View style={styles.productBody}>
              <View style={[styles.productTopRow, rtl && styles.productTopRowRtl]}>
                <Text style={[styles.productName, rtl && styles.textRtl]} numberOfLines={1}>{t('cart.productName')}</Text>
                <Text style={styles.productPrice}>
                  {item.price} SAR
                </Text>
              </View>
              <View style={[styles.ratingRow, rtl && styles.ratingRowRtl]}>
                <Ionicons name="star" size={14} color="#F6C225" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View style={[styles.qtyRow, rtl && styles.qtyRowRtl]}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                  <Ionicons name="remove" size={18} color="#9FA5B3" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                  <Ionicons name="add" size={18} color="#9FA5B3" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={[styles.shipHeader, rtl && styles.shipHeaderRtl]}>
          <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('common.shippingAddress')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CartAddAddress')}>
            <Text style={styles.addAddressText}>{t('cart.addAddress')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.addressCard}>
          <View style={[styles.addressRow, rtl && styles.addressRowRtl]}>
            <Text style={[styles.addressType, rtl && styles.textRtl]}>{t('cart.addressType')}</Text>
            <Ionicons name="create-outline" size={18} color="#157E7A" />
          </View>
          <Text style={[styles.addressLine, rtl && styles.textRtl]}>{t('cart.addressLine1')}</Text>
          <Text style={[styles.addressLine, rtl && styles.textRtl]}>{t('cart.addressLine2')}</Text>
        </View>

        <View style={styles.paymentCard}>
          <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('common.paymentDetails')}</Text>
          <View style={[styles.paymentRow, rtl && styles.paymentRowRtl]}>
            <Text style={[styles.paymentLabel, rtl && styles.textRtl]}>{t('common.consultationFee')}</Text>
            <Text style={styles.paymentValue}>{t('cart.payment100')}</Text>
          </View>
          <View style={[styles.paymentRow, rtl && styles.paymentRowRtl]}>
            <Text style={[styles.paymentLabel, rtl && styles.textRtl]}>{t('common.vat')}</Text>
            <Text style={styles.paymentValue}>{t('cart.payment100')}</Text>
          </View>
          <View style={styles.paymentDivider} />
          <View style={[styles.paymentRow, rtl && styles.paymentRowRtl]}>
            <Text style={[styles.netLabel, rtl && styles.textRtl]}>{t('common.netAmount')}</Text>
            <Text style={styles.netValue}>200 SAR</Text>
          </View>
        </View>

        <View style={[styles.promoRow, rtl && styles.promoRowRtl]}>
          <TextInput
            value={promo}
            onChangeText={setPromo}
            placeholder={t('common.havePromoCode')}
            placeholderTextColor="#B5B9C7"
            style={[styles.promoInput, rtl && styles.textRtl]}
          />
          <TouchableOpacity style={styles.applyBtn}>
            <Text style={styles.applyText}>{t('common.apply')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.confirmText}>{t('common.confirmPayment')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F6' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 34 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
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
  redDot: {
    position: 'absolute',
    top: 11,
    end: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F80000',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  productCardRtl: { flexDirection: 'row-reverse' },
  productImage: { width: 112, height: 112, borderRadius: 8, backgroundColor: '#F2F3F6' },
  productBody: { flex: 1, justifyContent: 'space-between' },
  productTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productTopRowRtl: { flexDirection: 'row-reverse' },
  productName: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.medium, flex: 1 },
  productPrice: { fontSize: 17, color: '#1B1D36', fontFamily: FontFamily.outfit.medium, marginStart: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingRowRtl: { flexDirection: 'row-reverse', alignSelf: 'flex-start' },
  ratingText: { fontSize: 15, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyRowRtl: { flexDirection: 'row-reverse', alignSelf: 'flex-start' },
  qtyBtn: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.medium, minWidth: 14, textAlign: 'center' },
  shipHeader: { marginTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  shipHeaderRtl: { flexDirection: 'row-reverse' },
  sectionTitle: { fontSize: 35 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  addAddressText: { fontSize: 16, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  addressCard: { marginTop: 10, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14 },
  addressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addressRowRtl: { flexDirection: 'row-reverse' },
  addressType: { fontSize: 35 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  addressLine: { marginTop: 3, fontSize: 16, color: '#6F7688', fontFamily: FontFamily.outfit.regular },
  paymentCard: { marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, gap: 10 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentRowRtl: { flexDirection: 'row-reverse' },
  paymentLabel: { fontSize: 17, color: '#343C50', fontFamily: FontFamily.outfit.medium },
  paymentValue: { fontSize: 17, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  paymentDivider: { borderTopWidth: 1, borderTopColor: '#D8DBE4', borderStyle: 'dashed' },
  netLabel: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  netValue: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  promoRow: { marginTop: 10, flexDirection: 'row', gap: 10 },
  promoRowRtl: { flexDirection: 'row-reverse' },
  promoInput: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B8BDC8',
    paddingHorizontal: 14,
    color: '#1E2239',
    fontSize: 18 / 2,
    fontFamily: FontFamily.outfit.regular,
    backgroundColor: '#FFFFFF',
    textAlign: 'auto',
  },
  applyBtn: {
    width: 132,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#157E7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: '#157E7A', fontSize: 17, fontFamily: FontFamily.outfit.medium },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#F4F4F6',
  },
  confirmBtn: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#157E7A',
  },
  confirmText: { color: '#FFFFFF', fontSize: 36 / 2, fontFamily: FontFamily.outfit.semiBold },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
});
