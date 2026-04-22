import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type OrderStatus = 'new' | 'in_progress' | 'completed';

const ORDERS: {
  id: string;
  title: string;
  time: string;
  date: string;
  status: OrderStatus;
  icon: ReturnType<typeof require>;
}[] = [
  { id: '1', title: 'Home Cleaning', time: '10:00-11:00 Am', date: '4 Nov', status: 'new', icon: require('../../../assets/shopping-bag.png') },
  { id: '2', title: 'Electronics', time: '10:00-11:00 Am', date: '4 Nov', status: 'in_progress', icon: require('../../../assets/Vector-1.png') },
  { id: '3', title: 'Electronics', time: '10:00-11:00 Am', date: '4 Nov', status: 'in_progress', icon: require('../../../assets/Vector-1.png') },
  { id: '4', title: 'Electronics', time: '10:00-11:00 Am', date: '4 Nov', status: 'in_progress', icon: require('../../../assets/Vector-1.png') },
  { id: '5', title: 'Electronics', time: '10:00-11:00 Am', date: '4 Nov', status: 'in_progress', icon: require('../../../assets/Vector-1.png') },
  { id: '6', title: 'Electronics', time: '10:00-11:00 Am', date: '4 Nov', status: 'in_progress', icon: require('../../../assets/Vector-1.png') },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  new: { label: 'New Order', bg: '#FFF3E6', color: '#FF8C00' },
  in_progress: { label: 'In Progress', bg: Colors.primary, color: '#FFFFFF' },
  completed: { label: 'Completed', bg: '#E8F5E9', color: '#2E7D32' },
};

export const ProviderOrderScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const rtl = isRTL();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>order</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {ORDERS.map((order) => {
          const statusCfg = STATUS_CONFIG[order.status];
          return (
            <View key={order.id} style={styles.card}>
              <View style={styles.iconCircle}>
                <Image source={order.icon} style={styles.orderIcon} resizeMode="contain" />
              </View>

              <View style={styles.cardContent}>
                <View style={[styles.cardRow, rtl && styles.cardRowRtl]}>
                  <Text style={[styles.orderTitle, rtl && styles.textRtl]}>{order.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                    <Text style={[styles.statusText, { color: statusCfg.color }]}>
                      {statusCfg.label}
                    </Text>
                  </View>
                </View>

                <View style={[styles.metaRow, rtl && styles.metaRowRtl]}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color="#9AA0AE" />
                    <Text style={styles.metaText}>{order.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={12} color="#9AA0AE" />
                    <Text style={styles.metaText}>{order.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
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
  headerTitle: {
    fontSize: 17,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderIcon: { width: 26, height: 26 },
  cardContent: { flex: 1, gap: 6 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRowRtl: { flexDirection: 'row-reverse' },
  orderTitle: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    textAlign: 'left',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FontFamily.outfit.semiBold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  metaRowRtl: { flexDirection: 'row-reverse' },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
  },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
});
