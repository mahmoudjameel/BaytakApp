import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { useAppLanguage } from '../context/LanguageContext';

type Props = NativeStackScreenProps<RootStackParamList, 'LanguageSettings'>;

export const LanguageScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const { language, setAppLanguage } = useAppLanguage();

  const options: { key: 'en' | 'ar'; label: string }[] = [
    { key: 'en', label: t('profile.languageEnglish') },
    { key: 'ar', label: 'Arbica' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.language')}</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.card}>
        <Text style={[styles.cardTitle, rtl && styles.textRtl]}>{t('language.suggestedLanguages')}</Text>
        {options.map((option, idx) => {
          const selected = language === option.key;
          return (
            <View key={option.key}>
              <TouchableOpacity
                style={[styles.optionRow, rtl && styles.optionRowRtl]}
                onPress={() => void setAppLanguage(option.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionLabel, rtl && styles.textRtl]}>{option.label}</Text>
                {selected ? (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.checkPlaceholder} />
                )}
              </TouchableOpacity>
              {idx < options.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerRtl: { flexDirection: 'row-reverse' },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  card: {
    marginTop: 22,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E5EB',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 36 / 2,
    color: '#6F7687',
    fontFamily: FontFamily.outfit.semiBold,
    marginBottom: 6,
  },
  optionRow: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionRowRtl: { flexDirection: 'row-reverse' },
  optionLabel: {
    fontSize: 23,
    lineHeight: 24,
    color: '#1B1D36',
    fontFamily: FontFamily.outfit.medium,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkPlaceholder: {
    width: 24,
    height: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E7ED',
  },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
});
