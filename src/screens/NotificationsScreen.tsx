import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type NotifFilter = 'all' | 'unread';
const NOTIF_IDS = ['1', '2', '3', '4', '5'];

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<NotifFilter>('all');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('notifications.title')}</Text>
        <View style={styles.iconBtn} />
      </View>

      <View style={styles.filtersRow}>
        {(['all', 'unread'] as NotifFilter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>
              {t(`notifications.${f}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {NOTIF_IDS.map((id) => (
          <View key={id} style={styles.notifItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="notifications" size={22} color={Colors.primary} />
            </View>
            <View style={styles.notifBody}>
              <View style={styles.notifTopRow}>
                <Text style={styles.notifTitle} numberOfLines={1}>
                  {t('notifications.itemTitle')}
                </Text>
                <Text style={styles.notifTime}>{t('notifications.itemTime')}</Text>
              </View>
              <Text style={styles.notifDesc} numberOfLines={3}>
                {t('notifications.itemDesc')}{' '}
                <Text style={styles.readMore}>{t('notifications.readMore')}</Text>
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F7' },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: '#F5F7F7',
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0D4DE',
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.medium,
    color: '#9AA0AE',
  },
  chipTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.outfit.semiBold,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EDF4F3',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifBody: { flex: 1, gap: 4 },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  notifTime: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: Colors.primary,
    flexShrink: 0,
  },
  notifDesc: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    lineHeight: 18,
  },
  readMore: {
    color: Colors.primary,
    fontFamily: FontFamily.outfit.medium,
  },
});
