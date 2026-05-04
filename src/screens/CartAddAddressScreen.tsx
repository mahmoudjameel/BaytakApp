import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { AddressesService } from '../services/addresses.service';
import { toErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'CartAddAddress'>;

export const CartAddAddressScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const addressId = route.params?.addressId;
  const isEdit = addressId != null;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [block, setBlock] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const loadExisting = useCallback(async () => {
    if (!addressId) return;
    try {
      const addr = await AddressesService.getOne(addressId);
      setTitle(addr.title ?? '');
      setStreet(addr.street ?? '');
      setDistrict(addr.district ?? '');
      setCity(addr.city ?? '');
      setPostalCode(addr.postalCode ?? '');
      setBlock(addr.block ?? '');
      setPhoneNumber(addr.phone ?? '');
    } catch {
    } finally {
      setLoading(false);
    }
  }, [addressId]);

  useEffect(() => {
    void loadExisting();
  }, [loadExisting]);

  const handleSave = async () => {
    const payload = {
      title: title.trim() || undefined,
      street: street.trim() || undefined,
      district: district.trim() || undefined,
      city: city.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
      block: block.trim() || undefined,
      phone: phoneNumber.trim() || undefined,
    };
    setSaving(true);
    try {
      if (isEdit) {
        await AddressesService.update(addressId!, payload);
      } else {
        await AddressesService.create(payload);
      }
      navigation.goBack();
    } catch (err: unknown) {
      Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, rtl && styles.headerRtl]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name={backChevronIcon()} size={22} color="#1E2239" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEdit ? t('myAddresses.editTitle') : t('addAddressForm.title')}
          </Text>
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
          <Field label={t('addAddressForm.label')} value={title} onChangeText={setTitle}
            placeholder={t('addAddressForm.labelPlaceholder')} rtl={rtl} />
          <Field label={t('addAddressForm.street')} value={street} onChangeText={setStreet}
            placeholder={t('addAddressForm.streetPlaceholder')} rtl={rtl} />
          <Field label={t('addAddressForm.district')} value={district} onChangeText={setDistrict}
            placeholder={t('addAddressForm.districtPlaceholder')} rtl={rtl} />
          <Field label={t('addAddressForm.city')} value={city} onChangeText={setCity}
            placeholder={t('addAddressForm.cityPlaceholder')} rtl={rtl} />
          <Field label={t('addAddressForm.postalCode')} value={postalCode} onChangeText={setPostalCode}
            placeholder={t('addAddressForm.postalCodePlaceholder')} keyboardType="number-pad" rtl={rtl} />
          <Field label={t('addAddressForm.block')} value={block} onChangeText={setBlock}
            placeholder={t('addAddressForm.blockPlaceholder')} rtl={rtl} />
          <Field label={t('addAddressForm.phoneNumber')} value={phoneNumber} onChangeText={setPhoneNumber}
            placeholder={t('addAddressForm.phoneNumberPlaceholder')} keyboardType="phone-pad" rtl={rtl} />
        </ScrollView>

        <View style={styles.footer}>
          {saving ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <TouchableOpacity style={styles.updateBtn} activeOpacity={0.85} onPress={handleSave}>
              <Text style={styles.updateBtnText}>{t('addAddressForm.saveAddress')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
  rtl: boolean;
};
const Field: React.FC<FieldProps> = ({ label, value, onChangeText, placeholder, keyboardType = 'default', rtl }) => (
  <View style={styles.fieldGroup}>
    <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#C5C8D1"
      keyboardType={keyboardType}
      style={[styles.fieldInput, rtl && styles.textRtl]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F6' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
  headerTitle: { fontSize: 17, color: '#1E2239', fontFamily: FontFamily.outfit.semiBold },
  notifBtn: {
    width: 42, height: 42, borderRadius: 12, borderWidth: 1, borderColor: '#E8EAF0',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF',
  },
  redDot: { position: 'absolute', top: 11, end: 11, width: 7, height: 7, borderRadius: 4, backgroundColor: '#F80000' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 },
  fieldGroup: { marginBottom: 14 },
  fieldLabel: { fontSize: 15, color: '#1B1D36', fontFamily: FontFamily.outfit.medium, marginBottom: 8 },
  fieldInput: {
    height: 68, borderRadius: 14, backgroundColor: '#F2F3F7', borderWidth: 1, borderColor: '#F0F1F4',
    paddingHorizontal: 18, fontSize: 15, color: '#1E2239', fontFamily: FontFamily.outfit.regular,
  },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20, backgroundColor: '#F4F4F6' },
  updateBtn: { height: 62, borderRadius: 16, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  updateBtnText: { color: '#FFFFFF', fontSize: 17, fontFamily: FontFamily.outfit.semiBold },
});
