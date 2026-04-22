import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpCenter'>;

const HELP_CARDS = ['card1Title', 'card2Title'] as const;

export const HelpCenterScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const { width } = useWindowDimensions();
  const cardWidth = (width - 16 * 2 - 12) / 2;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('helpCenter.title')}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsRow}>
          {HELP_CARDS.map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.helpCard, { width: cardWidth }]}
              activeOpacity={0.85}
            >
              <View style={styles.iconWrap}>
                <Ionicons name="headset-outline" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>{t(`helpCenter.${key}`)}</Text>
              <Text style={styles.cardDesc} numberOfLines={4}>
                {t('helpCenter.cardDesc')}{' '}
                <Text style={styles.readMore}>{t('helpCenter.readMore')}</Text>
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ticketLabel}>{t('helpCenter.ticketSection')}</Text>

        <View style={styles.emptyState}>
          <View style={styles.noFeeBox}>
            <Text style={styles.noFeeTextTop}>NO</Text>
            <Text style={styles.noFeeTextBottom}>FEE</Text>
            <View style={styles.noFeeLine} />
          </View>
          <View style={styles.notchBottom} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85}>
          <Text style={styles.confirmBtnText}>{t('helpCenter.confirmHelp')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scrollContent: { padding: 16 },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  helpCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF3',
    padding: 14,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.primary,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    lineHeight: 18,
  },
  readMore: {
    color: Colors.primary,
    fontFamily: FontFamily.outfit.medium,
  },
  ticketLabel: {
    fontSize: 17,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noFeeBox: {
    width: 90,
    height: 110,
    backgroundColor: '#A8C9C7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  noFeeTextTop: {
    fontSize: 22,
    fontFamily: FontFamily.outfit.bold,
    color: '#FFFFFF',
  },
  noFeeTextBottom: {
    fontSize: 22,
    fontFamily: FontFamily.outfit.bold,
    color: '#FFFFFF',
  },
  noFeeLine: {
    width: 60,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginTop: 4,
  },
  notchBottom: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDEFF3',
    backgroundColor: '#FFFFFF',
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#FFFFFF',
  },
});
