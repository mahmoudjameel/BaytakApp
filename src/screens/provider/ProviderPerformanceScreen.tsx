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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const DATA_POINTS_1 = [320, 380, 500, 340, 300, 260];
const DATA_POINTS_2 = [280, 320, 420, 310, 280, 240];
const Y_MAX = 800;
const CHART_HEIGHT = 160;

const normalize = (val: number) => ((Y_MAX - val) / Y_MAX) * CHART_HEIGHT;

const ORDERS = [
  { id: '1', title: 'HVAC Maintenance', desc: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', time: 'Mon - Fri, Morning 8 AM - Night 8 PM' },
  { id: '2', title: 'HVAC Maintenance', desc: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', time: 'Mon - Fri, Morning 8 AM - Night 8 PM' },
  { id: '3', title: 'HVAC Maintenance', desc: 'Lorem ipsum is simply dummy text of the printing and typesetting industry.', time: 'Mon - Fri, Morning 8 AM - Night 8 PM' },
];

export const ProviderPerformanceScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const rtl = isRTL();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="people-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Total Service{'\n'}Providers</Text>
            <Text style={styles.statValue}>560</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statLabel}>Total Order</Text>
            <Text style={styles.statValue}>560</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.yAxis}>
            {[800, 600, 400, 200, 0].map((v) => (
              <Text key={v} style={styles.yLabel}>{v}</Text>
            ))}
          </View>

          <View style={styles.chartArea}>
            <View style={[StyleSheet.absoluteFill, styles.chartLines]}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.gridLine} />
              ))}
            </View>

            <View style={StyleSheet.absoluteFill}>
              {DATA_POINTS_1.map((val, i) => {
                if (i === DATA_POINTS_1.length - 1) return null;
                const x1 = (i / (DATA_POINTS_1.length - 1)) * 100;
                const x2 = ((i + 1) / (DATA_POINTS_1.length - 1)) * 100;
                const y1 = normalize(val);
                const y2 = normalize(DATA_POINTS_1[i + 1]);
                const len = Math.sqrt(Math.pow((x2 - x1) * 2.4, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, (x2 - x1) * 2.4) * (180 / Math.PI);
                return (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${x1}%`,
                      top: y1,
                      width: len,
                      height: 2,
                      backgroundColor: Colors.primary,
                      transformOrigin: '0 0',
                      transform: [{ rotate: `${angle}deg` }],
                    }}
                  />
                );
              })}

              {DATA_POINTS_2.map((val, i) => {
                if (i === DATA_POINTS_2.length - 1) return null;
                const x1 = (i / (DATA_POINTS_2.length - 1)) * 100;
                const x2 = ((i + 1) / (DATA_POINTS_2.length - 1)) * 100;
                const y1 = normalize(val);
                const y2 = normalize(DATA_POINTS_2[i + 1]);
                const len = Math.sqrt(Math.pow((x2 - x1) * 2.4, 2) + Math.pow(y2 - y1, 2));
                const angle = Math.atan2(y2 - y1, (x2 - x1) * 2.4) * (180 / Math.PI);
                return (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${x1}%`,
                      top: y1,
                      width: len,
                      height: 1.5,
                      backgroundColor: `${Colors.primary}66`,
                      transformOrigin: '0 0',
                      transform: [{ rotate: `${angle}deg` }],
                    }}
                  />
                );
              })}

              <View style={styles.tooltip}>
                <Text style={styles.tooltipValue}>123 SAR</Text>
                <Text style={styles.tooltipLabel}>May</Text>
              </View>
            </View>

            <View style={styles.xAxis}>
              {MONTHS.map((m) => (
                <Text key={m} style={styles.xLabel}>{m}</Text>
              ))}
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>Last My Order</Text>

        <View style={styles.ordersList}>
          {ORDERS.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderIconBox}>
                <Ionicons name="shield-outline" size={22} color={Colors.primary} />
              </View>
              <View style={styles.orderContent}>
                <Text style={[styles.orderTitle, rtl && styles.textRtl]}>{order.title}</Text>
                <Text style={[styles.orderDesc, rtl && styles.textRtl]} numberOfLines={2}>{order.desc}</Text>
                <Text style={[styles.orderTime, rtl && styles.textRtl]}>{order.time}</Text>
              </View>
            </View>
          ))}
        </View>
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
  headerTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scroll: { padding: 16, gap: 16, paddingBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EDF7F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    lineHeight: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
  },
  chartContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  yAxis: {
    width: 36,
    height: CHART_HEIGHT + 24,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
    paddingBottom: 24,
  },
  yLabel: { fontSize: 10, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE' },
  chartArea: { flex: 1, height: CHART_HEIGHT + 24 },
  chartLines: {
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  gridLine: { width: '100%', height: 1, backgroundColor: '#F0F2F5' },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xLabel: { fontSize: 10, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE' },
  tooltip: {
    position: 'absolute',
    top: normalize(300) - 40,
    left: '66%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  tooltipValue: { fontSize: 16, fontFamily: FontFamily.outfit.bold, color: '#1B1D36' },
  tooltipLabel: { fontSize: 11, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE' },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
    textAlign: 'left',
    marginTop: 4,
  },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  ordersList: { gap: 12 },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orderIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDF7F6',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderContent: { flex: 1, gap: 4 },
  orderTitle: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    textAlign: 'left',
  },
  orderDesc: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    lineHeight: 18,
    textAlign: 'left',
  },
  orderTime: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    textAlign: 'left',
  },
});
