import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { backChevronIcon, isRTL } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'CartAddAddress'>;

export const CartAddAddressScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [block, setBlock] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1E2239" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addAddressForm.title')}</Text>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={20} color="#1B1D36" />
          <View style={styles.redDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addAddressForm.street')}</Text>
          <TextInput
            value={street}
            onChangeText={setStreet}
            placeholder={t('addAddressForm.streetPlaceholder')}
            placeholderTextColor="#C5C8D1"
            style={[styles.fieldInput, rtl && styles.textRtl]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addAddressForm.city')}</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder={t('addAddressForm.cityPlaceholder')}
            placeholderTextColor="#C5C8D1"
            style={[styles.fieldInput, rtl && styles.textRtl]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addAddressForm.postalCode')}</Text>
          <TextInput
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder={t('addAddressForm.postalCodePlaceholder')}
            placeholderTextColor="#C5C8D1"
            style={[styles.fieldInput, rtl && styles.textRtl]}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addAddressForm.block')}</Text>
          <TextInput
            value={block}
            onChangeText={setBlock}
            placeholder={t('addAddressForm.blockPlaceholder')}
            placeholderTextColor="#C5C8D1"
            style={[styles.fieldInput, rtl && styles.textRtl]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addAddressForm.phoneNumber')}</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder={t('addAddressForm.phoneNumberPlaceholder')}
            placeholderTextColor="#C5C8D1"
            style={[styles.fieldInput, rtl && styles.textRtl]}
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.updateBtn} activeOpacity={0.85}>
          <Text style={styles.updateBtnText}>{t('addAddressForm.updateAddress')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F6' },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#F4F4F6',
  },
  headerRtl: { flexDirection: 'row-reverse' },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: 34 / 2,
    color: '#1E2239',
    fontFamily: FontFamily.outfit.semiBold,
  },
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 35 / 2,
    color: '#1B1D36',
    fontFamily: FontFamily.outfit.medium,
    marginBottom: 8,
  },
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
  updateBtn: {
    height: 62,
    borderRadius: 16,
    backgroundColor: '#157E7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtnText: {
    color: '#FFFFFF',
    fontSize: 38 / 2,
    fontFamily: FontFamily.outfit.semiBold,
  },
  textRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
