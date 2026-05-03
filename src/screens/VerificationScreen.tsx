import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { AuthService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { toErrorMessage } from '../utils/errors';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Verification'>;
};

export const VerificationScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const { refreshUser } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < code.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 5) {
      Alert.alert(t('common.error'), t('verification.enterCode'));
      return;
    }
    setLoading(true);
    try {
      const profile = await refreshUser();
      if (!profile) {
        Alert.alert(t('common.error'), t('verification.invalidCode'));
        return;
      }
      if (profile.role === 'PROVIDER') {
        navigation.replace('ProviderMain');
      } else {
        navigation.replace('Main');
      }
    } catch (err: unknown) {
      Alert.alert(t('common.error'), toErrorMessage(err, t('verification.invalidCode')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.topBar, rtl && styles.topBarRtl]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={backChevronIcon()} size={22} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>{t('verification.screenTitle')}</Text>
        <View style={styles.topRightPlaceholder} />
      </View>
      <View style={styles.topDivider} />

      <View style={styles.contentArea}>
        <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Ionicons name="mail-open-outline" size={30} color={Colors.white} />
            <Ionicons name="lock-closed" size={10} color={Colors.white} style={styles.lockBadge} />
          </View>
        </View>

        <Text style={styles.title}>{t('verification.codeTitle')}</Text>
        <Text style={styles.subtitle}>{t('verification.subtitle')}</Text>
        <Text style={styles.phoneNumber}>{t('verification.phone')}</Text>

        <View style={styles.codeRow}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputs.current[index] = ref; }}
              style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
              value={digit}
              onChangeText={(txt) => handleChange(txt.slice(-1), index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={Colors.primary}
            />
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginBottom: 24 }} />
        ) : (
          <Button
            title={t('verification.submit')}
            onPress={handleSubmit}
            style={styles.submitBtn}
            textStyle={styles.submitText}
          />
        )}

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>{t('verification.resendPrompt')} </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>{t('verification.resend')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  topBarRtl: { flexDirection: 'row-reverse' },
  topTitle: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#1B2038' },
  topRightPlaceholder: { width: 40, height: 40 },
  topDivider: { height: 1, backgroundColor: '#E8EAF0' },
  contentArea: { flex: 1, backgroundColor: '#F5F5F5' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingTop: 40 },
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  iconBg: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  lockBadge: { position: 'absolute', end: 28, bottom: 28 },
  title: { fontSize: 20, fontFamily: FontFamily.outfit.semiBold, color: '#1E2239', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1', textAlign: 'center', lineHeight: 18, marginBottom: 6 },
  phoneNumber: { textAlign: 'center', fontSize: 17, fontFamily: FontFamily.outfit.medium, color: '#1E2239', marginBottom: 24 },
  codeRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30, gap: 8 },
  codeInput: { width: 62, height: 68, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EC', backgroundColor: '#F8F8FB', fontSize: 18, fontFamily: FontFamily.outfit.bold, color: '#1E2239' },
  codeInputFilled: { borderColor: Colors.primary, backgroundColor: '#FFFFFF' },
  submitBtn: { marginBottom: 24, height: 48, borderRadius: 12, backgroundColor: Colors.primary },
  submitText: { fontSize: 17, fontFamily: FontFamily.outfit.medium, color: Colors.white },
  resendRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  resendText: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1' },
  resendLink: { fontSize: 14, fontFamily: FontFamily.outfit.medium, color: '#D72653' },
});
