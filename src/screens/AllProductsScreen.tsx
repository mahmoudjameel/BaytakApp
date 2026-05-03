import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, useWindowDimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { HomeSearchBar } from '../components/home/HomeSearchBar';
import { ProductsService, Product } from '../services/products.service';
import { CategoriesService, Category, categoryDisplayName } from '../services/categories.service';

type Props = NativeStackScreenProps<RootStackParamList, 'AllProducts'>;

export const AllProductsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const preferAr = (i18n.language ?? '').startsWith('ar');
  const { width } = useWindowDimensions();
  const rtl = isRTL();
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const gap = 12;
  const pad = 16;
  const cardWidth = (width - pad * 2 - gap) / 2;

  useEffect(() => {
    CategoriesService.getAll({ limit: 20 }).then((res) => setCategories(res.data ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    ProductsService.getAll({ categoryId: selectedCategoryId, search: search || undefined, limit: 40 })
      .then((res) => setProducts(res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategoryId, search]);

  const getProductName = (p: Product) => p.title ?? p.name ?? '';
  const getProductImage = (p: Product) => p.images?.[0] ?? 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80';
  const getProductPrice = (p: Product) => p.price != null ? `${p.price} SAR` : '—';

  const renderStars = useCallback((rating: number) =>
    [1, 2, 3, 4, 5].map((i) => (
      <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={11} color="#F6B100" />
    )), []);

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { width: cardWidth }]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ProductDetails', {
        name: getProductName(item),
        price: getProductPrice(item),
        image: getProductImage(item),
        rating: item.rating ?? 4,
        productId: item.id,
      })}
    >
      <Image source={{ uri: getProductImage(item) }} style={styles.productImage} />
      <View style={[styles.cardBody, rtl && styles.cardBodyRtl]}>
        <Text style={[styles.productName, rtl && styles.textRtl]} numberOfLines={1}>{getProductName(item)}</Text>
        <View style={[styles.starsRow, rtl && styles.starsRowRtl]}>{renderStars(item.rating ?? 4)}</View>
        <View style={styles.priceRow}>
          <Text style={[styles.price, rtl && styles.textRtl]}>{getProductPrice(item)}</Text>
          <View style={styles.cartBtn} pointerEvents="none">
            <Image source={require('../../assets/shopping-bag.png')} style={styles.cartIcon} resizeMode="contain" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [cardWidth, navigation, renderStars, rtl]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { direction: 'ltr' }]}>
        {rtl ? (
          <>
            <View style={styles.headerSide} />
            <Text style={styles.headerTitleCenter}>{t('allProducts.title')}</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
              <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
              <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
            </TouchableOpacity>
            <Text style={styles.headerTitleCenter}>{t('allProducts.title')}</Text>
            <View style={styles.headerSide} />
          </>
        )}
      </View>

      <HomeSearchBar value={search} onChangeText={setSearch} />

      <ScrollView horizontal style={styles.chipsScroll} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
        <TouchableOpacity
          style={[styles.chip, selectedCategoryId === undefined ? styles.chipSelected : styles.chipIdle]}
          onPress={() => setSelectedCategoryId(undefined)}
          activeOpacity={0.85}
        >
          <Text style={[styles.chipText, selectedCategoryId === undefined ? styles.chipTextSelected : styles.chipTextIdle]}>{t('common.all')}</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.chip, selectedCategoryId === cat.id ? styles.chipSelected : styles.chipIdle]}
            onPress={() => setSelectedCategoryId(cat.id)}
            activeOpacity={0.85}
          >
            <Text style={[styles.chipText, selectedCategoryId === cat.id ? styles.chipTextSelected : styles.chipTextIdle]} numberOfLines={1}>
              {categoryDisplayName(cat, preferAr)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          style={styles.gridList}
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('common.noResults')}</Text>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  headerSide: { width: 40, height: 40 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitleCenter: { flex: 1, fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', textAlign: 'center' },
  chipsScroll: { flexGrow: 0, flexShrink: 0 },
  chipsRow: { paddingHorizontal: 16, paddingTop: 2, paddingBottom: 8, gap: 8, flexDirection: 'row', alignItems: 'center', flexGrow: 0 },
  chip: { paddingHorizontal: 14, height: 29, borderRadius: 5, flexShrink: 0, alignItems: 'center', justifyContent: 'center', minHeight: 29 },
  chipIdle: { backgroundColor: '#E8F1E3' },
  chipSelected: { backgroundColor: Colors.primary },
  chipText: { fontSize: 12, fontFamily: FontFamily.outfit.medium },
  chipTextIdle: { color: '#1B1D36' },
  chipTextSelected: { color: '#FFFFFF' },
  gridList: { flex: 1 },
  gridContent: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 0 },
  gridRow: { justifyContent: 'space-between', marginBottom: 14, gap: 12 },
  productCard: { borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDEFF3', overflow: 'hidden' },
  productImage: { width: '100%', aspectRatio: 1, backgroundColor: '#F7F8FA', borderTopLeftRadius: 13, borderTopRightRadius: 13 },
  cardBody: { padding: 10, paddingTop: 8, gap: 4 },
  cardBodyRtl: { alignItems: 'stretch' },
  productName: { fontSize: 13, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', textAlign: 'left', marginBottom: 2 },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  starsRowRtl: { justifyContent: 'flex-end' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  price: { fontSize: 13, fontFamily: FontFamily.outfit.bold, color: '#1B1D36', flex: 1, minWidth: 0 },
  cartBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#EEF6F4', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cartIcon: { width: 18, height: 18 },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14, color: '#9AA0AE', fontFamily: FontFamily.outfit.regular },
});
