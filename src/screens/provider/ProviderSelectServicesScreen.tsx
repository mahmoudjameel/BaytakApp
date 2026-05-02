import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { isRTL } from '../../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'ProviderSelectServices'>;

const SERVICES = [
  { id: '1', labelKey: 'categories.electricity', icon: require('../../../assets/shopping-bag.png') },
  { id: '2', labelKey: 'categories.plumbing', icon: require('../../../assets/Vector-1.png') },
  { id: '3', labelKey: 'categories.beauty', icon: require('../../../assets/Vector-2.png') },
  { id: '4', labelKey: 'categories.appliance', icon: require('../../../assets/menu 1.png') },
  { id: '5', labelKey: 'categories.electricity', icon: require('../../../assets/shopping-bag.png') },
  { id: '6', labelKey: 'categories.plumbing', icon: require('../../../assets/Vector-1.png') },
  { id: '7', labelKey: 'categories.beauty', icon: require('../../../assets/Vector-2.png') },
  { id: '8', labelKey: 'categories.appliance', icon: require('../../../assets/menu 1.png') },
  { id: '9', labelKey: 'categories.electricity', icon: require('../../../assets/shopping-bag.png') },
  { id: '10', labelKey: 'categories.plumbing', icon: require('../../../assets/Vector-1.png') },
  { id: '11', labelKey: 'categories.beauty', icon: require('../../../assets/Vector-2.png') },
  { id: '12', labelKey: 'categories.appliance', icon: require('../../../assets/menu 1.png') },
  { id: '13', labelKey: 'categories.electricity', icon: require('../../../assets/shopping-bag.png') },
  { id: '14', labelKey: 'categories.plumbing', icon: require('../../../assets/Vector-1.png') },
  { id: '15', labelKey: 'categories.beauty', icon: require('../../../assets/Vector-2.png') },
  { id: '16', labelKey: 'categories.appliance', icon: require('../../../assets/menu 1.png') },
];

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

export const ProviderSelectServicesScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [selected, setSelected] = useState<string[]>(['1']);

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator current={3} total={3} rtl={rtl} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, rtl && styles.textRtl]}>{t('auth.createAccountTitle')}</Text>
        <Text style={[styles.subtitle, rtl && styles.textRtl]}>
          {t('auth.createAccountSubtitle')}
        </Text>

        <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>
          {t('providerSelectServices.chooseService')}
        </Text>

        <View style={styles.grid}>
          {SERVICES.map((svc) => {
            const isActive = selected.includes(svc.id);
            return (
              <TouchableOpacity
                key={svc.id}
                style={[styles.serviceCard, isActive && styles.serviceCardActive]}
                onPress={() => toggleService(svc.id)}
                activeOpacity={0.8}
              >
                <Image source={svc.icon} style={styles.serviceIcon} resizeMode="contain" />
                <Text style={[styles.serviceLabel, isActive && styles.serviceLabelActive]}>
                  {t(svc.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('auth.createAccountButton')}
          onPress={() => navigation.navigate('ProviderAccountSuccess')}
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontFamily: FontFamily.outfit.bold,
    color: '#1E2239',
    marginBottom: 6,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    color: '#A7AEC1',
    marginBottom: 24,
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1E2239',
    marginBottom: 16,
    textAlign: 'left',
  },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#F5F6FA',
    borderWidth: 1.5,
    borderColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  serviceCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  serviceIcon: { width: 36, height: 36 },
  serviceLabel: {
    fontSize: 10,
    fontFamily: FontFamily.outfit.medium,
    color: '#1E2239',
    textAlign: 'center',
  },
  serviceLabelActive: {
    color: Colors.primary,
    fontFamily: FontFamily.outfit.semiBold,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
  },
  btn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.primary,
  },
});
