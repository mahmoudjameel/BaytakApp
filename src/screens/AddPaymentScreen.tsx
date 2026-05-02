import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { backChevronIcon, isRTL } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPayment'>;

export const AddPaymentScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, rtl && styles.headerRtl]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('addPayment.title')}</Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.cardPreview}>
          <View style={styles.cardShapeA} />
          <View style={styles.cardShapeB} />
          <View style={styles.cardShapeC} />
          <View style={styles.cardShapeD} />
          <View style={styles.cardChip} />
          <Text style={styles.cardBrand}>VISA</Text>
          <Text style={styles.cardNumberPreview}>7654 6432 3478 0001</Text>
          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardMetaLabel}>Card Holder</Text>
              <Text style={styles.cardMetaValue}>Jonathan Lee</Text>
            </View>
            <View>
              <Text style={styles.cardMetaLabel}>Exp date</Text>
              <Text style={styles.cardMetaValue}>28/12</Text>
            </View>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addPayment.cardName')}</Text>
          <TextInput
            value={cardName}
            onChangeText={setCardName}
            placeholder={t('addPayment.cardName')}
            placeholderTextColor="#C3C7CF"
            style={[styles.fieldInput, rtl && styles.textRtl]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addPayment.cardNumber')}</Text>
          <TextInput
            value={cardNumber}
            onChangeText={setCardNumber}
            placeholder={t('addPayment.cardNumber')}
            placeholderTextColor="#C3C7CF"
            style={[styles.fieldInput, rtl && styles.textRtl]}
            keyboardType="number-pad"
          />
        </View>

        <View style={[styles.twoColsRow, rtl && styles.twoColsRowRtl]}>
          <View style={styles.halfField}>
            <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addPayment.expiryDate')}</Text>
            <TextInput
              value={expiryDate}
              onChangeText={setExpiryDate}
              placeholder="MM/YY"
              placeholderTextColor="#C3C7CF"
              style={[styles.fieldInput, rtl && styles.textRtl]}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addPayment.cvc')}</Text>
            <TextInput
              value={cvv}
              onChangeText={setCvv}
              placeholder="***"
              placeholderTextColor="#C3C7CF"
              style={[styles.fieldInput, rtl && styles.textRtl]}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addPaymentBtn}
          onPress={() => navigation.navigate('ContractSuccess')}
          activeOpacity={0.85}
        >
          <Text style={styles.addPaymentText}>{t('addPayment.addPayment')}</Text>
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
    marginBottom: 8,
  },
  headerRtl: { flexDirection: 'row-reverse' },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  cardPreview: {
    height: 210,
    borderRadius: 18,
    backgroundColor: '#1D8783',
    padding: 18,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardShapeA: {
    position: 'absolute',
    width: 230,
    height: 170,
    borderRadius: 90,
    backgroundColor: '#8FB9A9',
    right: -30,
    bottom: 2,
    transform: [{ rotate: '-18deg' }],
  },
  cardShapeB: {
    position: 'absolute',
    width: 200,
    height: 150,
    borderRadius: 85,
    backgroundColor: '#0A5E61',
    right: 10,
    bottom: 32,
    transform: [{ rotate: '-18deg' }],
  },
  cardShapeC: {
    position: 'absolute',
    width: 186,
    height: 136,
    borderRadius: 80,
    backgroundColor: '#76AFA5',
    right: 40,
    bottom: 44,
    transform: [{ rotate: '-18deg' }],
  },
  cardShapeD: {
    position: 'absolute',
    width: 160,
    height: 122,
    borderRadius: 70,
    backgroundColor: '#194D7B',
    opacity: 0.8,
    right: -6,
    bottom: 38,
    transform: [{ rotate: '-18deg' }],
  },
  cardChip: { width: 58, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.17)' },
  cardBrand: {
    position: 'absolute',
    top: 20,
    right: 22,
    fontSize: 42 / 2,
    color: '#FFFFFF',
    fontFamily: FontFamily.outfit.bold,
  },
  cardNumberPreview: {
    marginTop: 56,
    fontSize: 44 / 2,
    color: '#FFFFFF',
    fontFamily: FontFamily.outfit.medium,
  },
  cardBottomRow: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMetaLabel: { fontSize: 16 / 2, color: 'rgba(255,255,255,0.75)', fontFamily: FontFamily.outfit.regular },
  cardMetaValue: { fontSize: 18 / 2 * 2, color: '#FFFFFF', fontFamily: FontFamily.outfit.medium },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 35 / 2, color: '#1B1D36', fontFamily: FontFamily.outfit.medium, marginBottom: 8 },
  fieldInput: {
    height: 68,
    borderRadius: 14,
    backgroundColor: '#F2F3F7',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    paddingHorizontal: 18,
    fontSize: 17,
    color: '#1E2239',
    fontFamily: FontFamily.outfit.regular,
    textAlign: 'auto',
  },
  twoColsRow: { flexDirection: 'row', gap: 12 },
  twoColsRowRtl: { flexDirection: 'row-reverse' },
  halfField: { flex: 1 },
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
  addPaymentBtn: {
    height: 62,
    borderRadius: 16,
    backgroundColor: '#157E7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPaymentText: { color: '#FFFFFF', fontSize: 38 / 2, fontFamily: FontFamily.outfit.semiBold },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
});
