import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { CategoriesService, Category, categoryDisplayName } from '../services/categories.service';

type Props = NativeStackScreenProps<RootStackParamList, 'AllCategories'>;

const FALLBACK_ICONS = [
  require('../../assets/Group (1).png'),
  require('../../assets/Vector.png'),
  require('../../assets/Frame.png'),
  require('../../assets/Vector-2.png'),
  require('../../assets/Vector-1.png'),
  require('../../assets/pest-control 1.png'),
  require('../../assets/sofa.png'),
  require('../../assets/menu 1.png'),
];

export const AllCategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const rtl = isRTL();
  const preferAr = (i18n.language ?? '').startsWith('ar');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CategoriesService.getAll({ limit: 100 })
      .then((res) => setCategories(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('common.allCategories')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.grid}>
            {categories.map((item, idx) => (
              <View key={item.id} style={styles.itemWrap}>
                <View style={styles.iconCircle}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.iconRemote} resizeMode="contain" />
                  ) : (
                    <Image source={FALLBACK_ICONS[idx % FALLBACK_ICONS.length]} style={styles.icon} resizeMode="contain" />
                  )}
                </View>
                <Text style={styles.itemName}>{categoryDisplayName(item, preferAr)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  headerRtl: { flexDirection: 'row-reverse' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  rightPlaceholder: { width: 36, height: 36 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 18 },
  itemWrap: { width: '23%', alignItems: 'center', gap: 8 },
  iconCircle: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#F5F6F8', alignItems: 'center', justifyContent: 'center' },
  icon: { width: 32, height: 32, tintColor: Colors.primary },
  iconRemote: { width: 32, height: 32 },
  itemName: { fontSize: 11, lineHeight: 15, textAlign: 'center', color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
});
