import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { isRTL } from '../../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'ProviderAccountSuccess'>;

const StepIndicator = ({ current, total, rtl }: { current: number; total: number; rtl: boolean }) => (
  <View style={[stepStyles.row, rtl && stepStyles.rowRtl]}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[stepStyles.bar, i < current ? stepStyles.barActive : stepStyles.barInactive]}
      />
    ))}
  </View>
);

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, marginBottom: 24 },
  rowRtl: { flexDirection: 'row-reverse' },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  barActive: { backgroundColor: Colors.primary },
  barInactive: { backgroundColor: '#E0E0E0' },
});

export const ProviderAccountSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator current={3} total={3} rtl={rtl} />

      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-done" size={52} color="#FFFFFF" />
        </View>

        <Text style={styles.heading}>{t('providerAccountSuccess.heading')}</Text>
        <Text style={styles.description}>{t('providerAccountSuccess.description')}</Text>
      </View>

      <View style={styles.footer}>
        <Button
          title={t('providerAccountSuccess.continueToApp')}
          onPress={() => navigation.navigate('ProviderMain')}
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heading: {
    fontSize: 22,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.regular,
    color: '#5A6178',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 8,
  },
  btn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.primary,
  },
});
