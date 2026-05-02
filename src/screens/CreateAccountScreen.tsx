import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { SocialButton } from '../components/SocialButton';
import { RootStackParamList } from '../navigation/AppNavigator';
import { isRTL } from '../utils/rtl';
import { AuthService } from '../services/auth.service';

const StepIndicator = ({ current, total, rtl }: { current: number; total: number; rtl: boolean }) => (
  <View style={[stepStyles.row, rtl && stepStyles.rowRtl]}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[stepStyles.bar, i < current ? stepStyles.barActive : stepStyles.barInactive]} />
    ))}
  </View>
);

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, paddingTop: 8, marginBottom: 0 },
  rowRtl: { flexDirection: 'row-reverse' },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  barActive: { backgroundColor: Colors.primary },
  barInactive: { backgroundColor: '#E0E0E0' },
});

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;
type AccountKind = 'provider' | 'company' | 'individual';

export const CreateAccountScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const accountType: AccountKind = route.params?.accountType ?? 'individual';
  const isProviderFlow = accountType === 'provider';
  const isCompanyFlow = accountType === 'company';
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [commercialRegistrationNumber, setCommercialRegistrationNumber] = useState('');
  const [taxIdNumber, setTaxIdNumber] = useState('');
  const [commercialName, setCommercialName] = useState('');
  const [nationalAddress, setNationalAddress] = useState('');

  const subtitleKey = useMemo(() => {
    if (accountType === 'provider') return 'auth.createAccountSubtitleProvider';
    if (accountType === 'company') return 'auth.createAccountSubtitleCompany';
    return 'auth.createAccountSubtitleIndividual';
  }, [accountType]);

  const fieldStyle = {
    containerStyle: styles.fieldContainer,
    labelStyle: [styles.fieldLabel, rtl && styles.fieldLabelRtl] as any,
    inputWrapperStyle: styles.fieldWrapper,
    inputStyle: styles.fieldInput,
    placeholderColor: '#A7AEC1',
  };

  const handleRegister = async () => {
    if (isProviderFlow) {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim() || !nationalAddress.trim()) {
        Alert.alert(t('common.error'), t('auth.fillAllFields'));
        return;
      }
      navigation.navigate('ProviderSelectServices', {
        accountType: 'provider',
        registrationData: {
          role: 'PROVIDER',
          accountType: 'INDIVIDUAL',
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          nationalAddress: nationalAddress.trim(),
        },
      });
      return;
    }

    if (isCompanyFlow) {
      if (!commercialName.trim() || !email.trim() || !phone.trim() || !password.trim() ||
          !commercialRegistrationNumber.trim() || !taxIdNumber.trim() || !nationalAddress.trim()) {
        Alert.alert(t('common.error'), t('auth.fillAllFields'));
        return;
      }
      navigation.navigate('ProviderSelectServices', {
        accountType: 'company',
        registrationData: {
          role: 'PROVIDER',
          accountType: 'COMPANY',
          email: email.trim(),
          phone: phone.trim(),
          password,
          commercialRegistrationNumber: commercialRegistrationNumber.trim(),
          taxIdNumber: taxIdNumber.trim(),
          commercialName: commercialName.trim(),
          nationalAddress: nationalAddress.trim(),
        },
      });
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        role: 'CLIENT',
        accountType: 'INDIVIDUAL',
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      navigation.navigate('Verification');
    } catch (err: any) {
      Alert.alert(t('common.error'), err?.message ?? t('auth.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {(isProviderFlow || isCompanyFlow) && <StepIndicator current={2} total={3} rtl={rtl} />}
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.title, rtl && styles.textRtl]}>{t('auth.createAccountTitle')}</Text>
            <Text style={[styles.subtitle, rtl && styles.textRtl]}>{t(subtitleKey)}</Text>
          </View>

          <View style={styles.form}>
            {isProviderFlow && (
              <>
                <InputField label={t('providerForm.commercialName')} placeholder={t('providerForm.commercialNamePlaceholder')} value={fullName} onChangeText={setFullName} {...fieldStyle} />
                <InputField label={t('providerForm.nationalAddress')} placeholder={t('providerForm.nationalAddressPlaceholder')} value={nationalAddress} onChangeText={setNationalAddress} {...fieldStyle} />
                <InputField label={t('providerForm.emailAddress')} placeholder={t('providerForm.emailAddressPlaceholder')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" {...fieldStyle} />
                <InputField label={t('providerForm.phoneNumber')} placeholder={t('providerForm.phoneNumberPlaceholder')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" {...fieldStyle} />
                <InputField label={t('providerForm.password')} placeholder={t('providerForm.passwordPlaceholder')} value={password} onChangeText={setPassword} isPassword {...fieldStyle} />
              </>
            )}

            {isCompanyFlow && (
              <>
                <InputField label={t('companyDetails.companyName')} placeholder={t('companyDetails.companyNamePlaceholder')} value={commercialName} onChangeText={setCommercialName} {...fieldStyle} />
                <InputField label={t('companyDetails.registrationOrTax')} placeholder={t('companyDetails.registrationOrTaxPlaceholder')} value={commercialRegistrationNumber} onChangeText={setCommercialRegistrationNumber} {...fieldStyle} />
                <InputField label={t('providerForm.taxIdNumber')} placeholder={t('providerForm.taxIdPlaceholder')} value={taxIdNumber} onChangeText={setTaxIdNumber} {...fieldStyle} />
                <InputField label={t('providerForm.nationalAddress')} placeholder={t('providerForm.nationalAddressPlaceholder')} value={nationalAddress} onChangeText={setNationalAddress} {...fieldStyle} />
                <InputField label={t('providerForm.emailAddress')} placeholder={t('providerForm.emailAddressPlaceholder')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" {...fieldStyle} />
                <InputField label={t('providerForm.phoneNumber')} placeholder={t('providerForm.phoneNumberPlaceholder')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" {...fieldStyle} />
                <InputField label={t('providerForm.password')} placeholder={t('providerForm.passwordPlaceholder')} value={password} onChangeText={setPassword} isPassword {...fieldStyle} />
              </>
            )}

            {!isProviderFlow && !isCompanyFlow && (
              <>
                <InputField label={t('auth.username')} placeholder={t('auth.usernamePlaceholder')} value={fullName} onChangeText={setFullName} autoCapitalize="words" leadingIcon="person-outline" {...fieldStyle} />
                <InputField label={t('auth.emailOrPhone')} placeholder={t('auth.emailOrPhonePlaceholder')} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" leadingIcon="mail-outline" {...fieldStyle} />
                <InputField label={t('auth.phoneNumber', { defaultValue: 'Phone Number' })} placeholder="+966XXXXXXXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" leadingIcon="call-outline" {...fieldStyle} />
                <InputField label={t('auth.password')} placeholder={t('auth.passwordPlaceholder')} value={password} onChangeText={setPassword} isPassword leadingIcon="lock-closed-outline" {...fieldStyle} />
              </>
            )}
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginBottom: 28 }} />
          ) : (
            <Button title={t('auth.createAccountButton')} onPress={handleRegister} style={styles.createBtn} />
          )}

          {!isProviderFlow && !isCompanyFlow && (
            <>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={[styles.dividerText, rtl && styles.textRtl]}>{t('auth.orOtherMethod')}</Text>
                <View style={styles.dividerLine} />
              </View>
              <SocialButton title={t('auth.signUpGoogle')} icon="logo-google" onPress={() => {}} style={styles.socialBtn} />
              <SocialButton title={t('auth.signUpApple')} icon="logo-apple" onPress={() => {}} style={styles.socialBtn} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  header: { marginBottom: 28 },
  title: { fontSize: 28, fontFamily: FontFamily.outfit.bold, color: '#1E2239', marginBottom: 6, textAlign: 'left', width: '100%' },
  subtitle: { fontSize: 13, lineHeight: 20, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1', textAlign: 'left', width: '100%' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  form: { marginBottom: 8 },
  fieldContainer: { marginBottom: 16 },
  fieldLabel: { fontSize: 15, lineHeight: 21, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', marginBottom: 8, width: '100%' },
  fieldLabelRtl: { textAlign: 'right', writingDirection: 'rtl' },
  fieldWrapper: { height: 52, borderRadius: 10, backgroundColor: '#F5F6FA', borderColor: '#F0F1F5', borderWidth: 1 },
  fieldInput: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#1E2239' },
  createBtn: { marginTop: 8, marginBottom: 28, height: 54, borderRadius: 12, backgroundColor: '#1A7B6B' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#F0F1F5' },
  dividerText: { fontSize: 13, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1' },
  socialBtn: { marginBottom: 12, height: 54, borderRadius: 12, backgroundColor: '#FFFFFF', borderColor: '#E8E9EF', borderWidth: 1 },
});
