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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const ProviderTimeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const rtl = isRTL();

  const [currentYear, setCurrentYear] = useState(2021);
  const [currentMonth, setCurrentMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState<number | null>(7);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Time</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoBanner}>
          <View style={styles.infoBannerLeft} />
          <Text style={styles.infoBannerText}>Select your Date & Time?</Text>
          <TouchableOpacity hitSlop={12}>
            <Ionicons name="close" size={18} color="#9AA0AE" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.selectorCard} activeOpacity={0.8}>
          <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
          <View style={styles.selectorContent}>
            <Text style={styles.selectorLabel}>Date</Text>
            <Text style={styles.selectorValue}>
              {selectedDay ? `${selectedDay} ${MONTH_NAMES[currentMonth]} ${currentYear}` : 'Select your Date'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.calendarCard}>
          <View style={styles.calendarNav}>
            <TouchableOpacity onPress={goToPrevMonth} hitSlop={12}>
              <Ionicons name="chevron-back" size={20} color="#1B1D36" />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={goToNextMonth} hitSlop={12}>
              <Ionicons name="chevron-forward" size={20} color="#1B1D36" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {DAYS_OF_WEEK.map((d) => (
              <Text key={d} style={styles.weekDayLabel}>{d}</Text>
            ))}
          </View>

          {rows.map((row, ri) => (
            <View key={ri} style={styles.calRow}>
              {row.map((day, ci) => {
                const isSelected = day === selectedDay;
                return (
                  <TouchableOpacity
                    key={ci}
                    style={styles.dayCell}
                    onPress={() => day && setSelectedDay(day)}
                    disabled={!day}
                    activeOpacity={0.8}
                  >
                    {day ? (
                      <View style={[styles.dayInner, isSelected && styles.dayInnerSelected]}>
                        <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                          {day}
                        </Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.selectorCard} activeOpacity={0.8}>
          <Ionicons name="time-outline" size={18} color={Colors.primary} />
          <View style={styles.selectorContent}>
            <Text style={styles.selectorLabel}>Time</Text>
            <Text style={styles.selectorValue}>Select your Time</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() => navigation.goBack()}
          style={styles.continueBtn}
          textStyle={styles.continueBtnText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerRtl: { flexDirection: 'row-reverse' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scroll: { padding: 16, gap: 12, paddingBottom: 24 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  infoBannerLeft: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.outfit.medium,
    color: '#1B1D36',
  },
  selectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF7F6',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  selectorContent: { flex: 1 },
  selectorLabel: {
    fontSize: 11,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    marginBottom: 2,
  },
  selectorValue: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthLabel: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FontFamily.outfit.medium,
    color: '#9AA0AE',
    paddingVertical: 4,
  },
  calRow: { flexDirection: 'row' },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayInner: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInnerSelected: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    color: '#1B1D36',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontFamily: FontFamily.outfit.semiBold,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  continueBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
  },
});
