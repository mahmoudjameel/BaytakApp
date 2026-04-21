import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { SocialButton } from '../components/SocialButton';
import { RootStackParamList } from '../navigation/AppNavigator';
import { isRTL } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;

type AccountKind = 'provider' | 'company' | 'individual';

type ProviderForm = {
  commercialRegistrationNumber: string;
  country: string;
  idNumber: string;
  nationalAddress: string;
  taxIdNumber: string;
  commercialName: string;
  emailAddress: string;
};

const initialProviderForm: ProviderForm = {
  commercialRegistrationNumber: '',
  country: '',
  idNumber: '',
  nationalAddress: '',
  taxIdNumber: '',
  commercialName: '',
  emailAddress: '',
};

export const CreateAccountScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  /** النوع يُختار من شاشة ChooseAccount فقط — لا يُعرض مرة أخرى هنا (حسب التصميم) */
  const accountType: AccountKind = route.params?.accountType ?? 'individual';

  const isProviderFlow = accountType === 'provider' || accountType === 'company';

  const subtitleKey = useMemo(() => {
    if (accountType === 'provider') return 'auth.createAccountSubtitleProvider';
    if (accountType === 'company') return 'auth.createAccountSubtitleCompany';
    return 'auth.createAccountSubtitleIndividual';
  }, [accountType]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [providerForm, setProviderForm] = useState<ProviderForm>(initialProviderForm);

  const providerFields = useMemo(
    () =>
      [
        {
          key: 'commercialRegistrationNumber' as const,
          label: t('providerForm.commercialRegistrationNumber'),
          placeholder: t('providerForm.commercialRegistrationPlaceholder'),
        },
        {
          key: 'country' as const,
          label: t('providerForm.country'),
          placeholder: t('providerForm.countryPlaceholder'),
        },
        {
          key: 'idNumber' as const,
          label: t('providerForm.idNumber'),
          placeholder: t('providerForm.idPlaceholder'),
        },
        {
          key: 'nationalAddress' as const,
          label: t('providerForm.nationalAddress'),
          placeholder: t('providerForm.nationalAddressPlaceholder'),
        },
        {
          key: 'taxIdNumber' as const,
          label: t('providerForm.taxIdNumber'),
          placeholder: t('providerForm.taxIdPlaceholder'),
        },
        {
          key: 'commercialName' as const,
          label: t('providerForm.commercialName'),
          placeholder: t('providerForm.commercialNamePlaceholder'),
        },
        {
          key: 'emailAddress' as const,
          label: t('providerForm.emailAddress'),
          placeholder: t('providerForm.emailAddressPlaceholder'),
        },
      ] as const,
    [t],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, rtl && styles.textRtl]}>{t('auth.createAccountTitle')}</Text>
          <Text style={[styles.subtitle, rtl && styles.textRtl]}>{t(subtitleKey)}</Text>
        </View>

        <View style={styles.form}>
          {isProviderFlow ? (
            providerFields.map((field) => (
              <InputField
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                value={providerForm[field.key]}
                onChangeText={(value) => setProviderForm((prev) => ({ ...prev, [field.key]: value }))}
                keyboardType={field.key === 'emailAddress' ? 'email-address' : 'default'}
                autoCapitalize="none"
                containerStyle={styles.providerField}
                labelStyle={[styles.providerFieldLabel, rtl && styles.providerFieldLabelRtl]}
                inputWrapperStyle={styles.providerFieldWrapper}
                inputStyle={styles.providerFieldInput}
                placeholderColor="#A7AEC1"
              />
            ))
          ) : (
            <>
              <InputField
                label={t('auth.username')}
                placeholder={t('auth.usernamePlaceholder')}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                leadingIcon="person-outline"        // ← أضف هاد
                labelStyle={[styles.providerFieldLabel, rtl && styles.providerFieldLabelRtl]}
                inputWrapperStyle={styles.providerFieldWrapper}
                inputStyle={styles.providerFieldInput}
                placeholderColor="#A7AEC1"
              />
              <InputField
                label={t('auth.emailOrPhone')}
                placeholder={t('auth.emailOrPhonePlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leadingIcon="mail-outline"          // ← أضف هاد

                labelStyle={[styles.providerFieldLabel, rtl && styles.providerFieldLabelRtl]}
                inputWrapperStyle={styles.providerFieldWrapper}
                inputStyle={styles.providerFieldInput}
                placeholderColor="#A7AEC1"
              />
              <InputField
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                isPassword
                leadingIcon="lock-closed-outline"   // ← أضف هاد
                labelStyle={[styles.providerFieldLabel, rtl && styles.providerFieldLabelRtl]}
                inputWrapperStyle={styles.providerFieldWrapper}
                inputStyle={styles.providerFieldInput}
                placeholderColor="#A7AEC1"
              />
            </>
          )}
        </View>

        <Button title={t('auth.createAccountButton')} onPress={() => navigation.navigate('Verification')} style={styles.createBtn} />

        {!isProviderFlow && (
          <>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, rtl && styles.textRtl]}>{t('auth.orOtherMethod')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <SocialButton
              title={t('auth.signUpGoogle')}
              icon="logo-google"
              onPress={() => {}}
              style={styles.socialBtn}
            />
            <SocialButton
              title={t('auth.signUpApple')}
              icon="logo-apple"
              onPress={() => {}}
              style={styles.socialBtn}
            />
          </>
        )}
      </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: FontFamily.outfit.bold,
    color: '#1E2239',
    marginBottom: 6,
    textAlign: 'left',
    width: '100%',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: FontFamily.outfit.regular,
    color: '#A7AEC1',
    textAlign: 'left',
    width: '100%',
  },
  textRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  form: {
    marginBottom: 8,
  },

  // ← Individual fields
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 10,
    width: '100%',
  },
  fieldWrapper: {
    height: 54,
    borderRadius: 10,
    backgroundColor: '#F5F6FA',
    borderColor: '#F0F1F5',
    borderWidth: 1,
  },
  fieldInput: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#1E2239',
  },

  // ← Provider fields (بدون icons)
  providerField: {
    marginBottom: 16,
  },
  providerFieldLabel: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 8,
    width: '100%',
  },
  providerFieldLabelRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  providerFieldWrapper: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F5F6FA',
    borderColor: '#F0F1F5',
    borderWidth: 1,
  },
  providerFieldInput: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#1E2239',
  },

  createBtn: {
    marginTop: 8,
    marginBottom: 28,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#1A7B6B',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F1F5',
  },
  dividerText: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    color: '#A7AEC1',
  },
  socialBtn: {
    marginBottom: 12,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E9EF',
    borderWidth: 1,
  },
});
