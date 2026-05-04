import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { AddressesService, Address } from '../services/addresses.service';
import { toErrorMessage } from '../utils/errors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const MyAddressesScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const rtl = isRTL();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AddressesService.getAll();
      setAddresses(data);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAddresses();
    }, [loadAddresses]),
  );

  const handleDelete = (address: Address) => {
    Alert.alert(
      t('myAddresses.deleteConfirmTitle'),
      t('myAddresses.deleteConfirmMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('myAddresses.delete'),
          style: 'destructive',
          onPress: async () => {
            setDeletingId(address.id);
            try {
              await AddressesService.remove(address.id);
              setAddresses((prev) => prev.filter((a) => a.id !== address.id));
            } catch (err: unknown) {
              Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  };

  const buildAddressLine = (addr: Address) => {
    return [addr.street, addr.district, addr.city].filter(Boolean).join('، ') || '—';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myAddresses.title')}</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="location-outline" size={54} color="#D0D5E3" />
          <Text style={styles.emptyText}>{t('myAddresses.noAddresses')}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {addresses.map((addr) => (
            <View key={addr.id} style={[styles.card, rtl && styles.cardRtl]}>
              <View style={styles.cardIcon}>
                <Ionicons name="location" size={20} color={Colors.primary} />
              </View>

              <View style={styles.cardBody}>
                <View style={[styles.titleRow, rtl && styles.rowRtl]}>
                  <Text style={[styles.cardTitle, rtl && styles.textRtl]} numberOfLines={1}>
                    {addr.title || t('myAddresses.address')}
                  </Text>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>{t('myAddresses.defaultBadge')}</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.cardAddress, rtl && styles.textRtl]} numberOfLines={2}>
                  {buildAddressLine(addr)}
                </Text>
                {addr.phone ? (
                  <Text style={[styles.cardPhone, rtl && styles.textRtl]}>{addr.phone}</Text>
                ) : null}
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  hitSlop={8}
                  onPress={() => navigation.navigate('CartAddAddress', { addressId: addr.id })}
                >
                  <Ionicons name="pencil" size={16} color={Colors.primary} />
                </TouchableOpacity>
                {deletingId === addr.id ? (
                  <ActivityIndicator size="small" color="#D72653" style={styles.actionBtn} />
                ) : (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    hitSlop={8}
                    onPress={() => handleDelete(addr)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#D72653" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      <View style={styles.fab}>
        <TouchableOpacity
          style={styles.fabBtn}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('CartAddAddress', {})}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.fabText}>{t('myAddresses.addNew')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  headerRtl: { flexDirection: 'row-reverse' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  emptyText: { fontSize: 15, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular },
  list: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardRtl: { flexDirection: 'row-reverse' },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDF7F6',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardBody: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  rowRtl: { flexDirection: 'row-reverse' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  cardTitle: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', flex: 1 },
  defaultBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    flexShrink: 0,
  },
  defaultBadgeText: { fontSize: 11, color: '#FFFFFF', fontFamily: FontFamily.outfit.medium },
  cardAddress: { fontSize: 13, color: '#6B7285', fontFamily: FontFamily.outfit.regular, lineHeight: 19 },
  cardPhone: { fontSize: 12, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular, marginTop: 4 },
  cardActions: { flexDirection: 'column', gap: 10, alignItems: 'center', paddingTop: 2, flexShrink: 0 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F5F6FA', alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', left: 16, right: 16, bottom: 24 },
  fabBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fabText: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#FFFFFF' },
});
