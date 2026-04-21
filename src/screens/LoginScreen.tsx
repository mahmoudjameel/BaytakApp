import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { SocialButton } from '../components/SocialButton';
import { RootStackParamList } from '../navigation/AppNavigator';
import { isRTL } from '../utils/rtl';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          <Text style={[styles.title, rtl && styles.textRtl]}>{t('auth.loginTitle')}</Text>
          <Text style={[styles.subtitle, rtl && styles.textRtl]}>{t('auth.loginSubtitle')}</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label={t('auth.emailOrPhone')}
            placeholder={t('auth.emailOrPhonePlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leadingIcon="mail-outline"
            labelStyle={styles.fieldLabel}           // ← أضف
            inputWrapperStyle={styles.fieldWrapper}  // ← أضف
            inputStyle={styles.fieldInput}           // ← أضف
            placeholderColor="#A7AEC1"               // ← أضف
          
          />
          <InputField
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            isPassword
            leadingIcon="lock-closed-outline"
            labelStyle={styles.fieldLabel}           // ← أضف
            inputWrapperStyle={styles.fieldWrapper}  // ← أضف
            inputStyle={styles.fieldInput}           // ← أضف
            placeholderColor="#A7AEC1"               // ← أضف
          
          />

          <TouchableOpacity style={[styles.forgotBtn, rtl ? styles.forgotBtnRtl : styles.forgotBtnLtr]}>
            <Text style={[styles.forgotText, rtl && styles.textRtl]}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        <Button title={t('auth.signIn')} onPress={() => (navigation as any).replace('Main')} style={styles.signInBtn} />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.orOtherMethod')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialButton
          title={t('auth.signInGoogle')}
          icon="logo-google"
          onPress={() => {}}
          style={styles.socialBtn}
        />
        <SocialButton
          title={t('auth.signInApple')}
          icon="logo-apple"
          onPress={() => {}}
          style={styles.socialBtn}
        />

        <View style={styles.registerRow}>
          <Text style={[styles.registerText, rtl && styles.textRtl]}>{t('auth.noAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('ChooseAccount')}>
            <Text style={[styles.registerLink, rtl && styles.textRtl]}>{t('auth.createAccountLink')}</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 4,
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
  forgotBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
  forgotBtnLtr: {
    alignSelf: 'flex-end',
  },
  forgotBtnRtl: {
    alignSelf: 'flex-start',
  },
  forgotText: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.medium,
    color: '#1A7B6B',
  },
  signInBtn: {
    marginBottom: 24,
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
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#A7AEC1',
  },
  registerLink: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1A7B6B',
  },
});