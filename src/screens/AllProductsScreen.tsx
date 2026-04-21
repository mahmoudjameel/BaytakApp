import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  useWindowDimensions,
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

type Props = NativeStackScreenProps<RootStackParamList, 'AllProducts'>;

const CHIP_KEYS = ['categories.cleaning', 'categories.painting', 'categories.electronics', 'categories.beauty'] as const;

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80',
];

type ProductRow = {
  id: string;
  nameKey: string;
  priceKey: string;
  image: string;
  rating: number;
};

export const AllProductsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const rtl = isRTL();
  const [search, setSearch] = useState('');
  const [selectedChip, setSelectedChip] = useState(0);

  const products: ProductRow[] = useMemo(
    () => [
      { id: '1', nameKey: 'home.dealName', priceKey: 'allProducts.price180', image: PRODUCT_IMAGES[0], rating: 4 },
      { id: '2', nameKey: 'allProducts.productKettle', priceKey: 'home.dealPrice', image: PRODUCT_IMAGES[1], rating: 4 },
      { id: '3', nameKey: 'allProducts.productStove', priceKey: 'allProducts.price180', image: PRODUCT_IMAGES[2], rating: 4 },
      { id: '4', nameKey: 'home.dealName', priceKey: 'home.dealPrice', image: PRODUCT_IMAGES[0], rating: 4 },
      { id: '5', nameKey: 'allProducts.productKettle', priceKey: 'allProducts.price180', image: PRODUCT_IMAGES[1], rating: 4 },
      { id: '6', nameKey: 'allProducts.productStove', priceKey: 'home.dealPrice', image: PRODUCT_IMAGES[2], rating: 4 },
    ],
    [],
  );

  const gap = 12;
  const pad = 16;
  const cardWidth = (width - pad * 2 - gap) / 2;

  const renderStars = useCallback(
    (rating: number) =>
      [1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={11}
          color="#F6B100"
        />
      )),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: ProductRow }) => (
      <TouchableOpacity
        style={[styles.productCard, { width: cardWidth }]}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('ProductDetails', {
            name: t(item.nameKey),
            price: t(item.priceKey),
            image: item.image,
            rating: item.rating,
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={[styles.cardBody, rtl && styles.cardBodyRtl]}>
          <Text style={[styles.productName, rtl && styles.textRtl]} numberOfLines={1}>
            {t(item.nameKey)}
          </Text>
          <View style={[styles.starsRow, rtl && styles.starsRowRtl]}>{renderStars(item.rating)}</View>
          <View style={styles.priceRow}>
            <Text style={[styles.price, rtl && styles.textRtl]}>{t(item.priceKey)}</Text>
            <View style={styles.cartBtn} pointerEvents="none">
              <Image
                source={require('../../assets/shopping-bag.png')}
                style={styles.cartIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [cardWidth, navigation, renderStars, rtl, t],
  );

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

      <ScrollView
        horizontal
        style={styles.chipsScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CHIP_KEYS.map((key, index) => {
          const selected = selectedChip === index;
          return (
            <TouchableOpacity
              key={key + index}
              style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}
              onPress={() => setSelectedChip(index)}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextIdle, rtl && styles.chipTextRtl]}
                numberOfLines={1}
              >
                {t(key)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        style={styles.gridList}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerSide: {
    width: 40,
    height: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCenter: {
    flex: 1,
    fontSize: 18,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    textAlign: 'center',
  },

  // ← Chips
  chipsScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  chipsRow: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
  },
  chip: {
    paddingHorizontal: 14,
    height: 29,
    borderRadius: 5,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 29,
  },
  chipIdle: {
    backgroundColor: '#E8F1E3',
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.medium,
  },
  chipTextIdle: {
    color: '#1B1D36',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextRtl: {
    writingDirection: 'rtl',
  },

  // ← Grid
  gridList: {
    flex: 1,
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 0,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },

  // ← Product Card
  productCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF3',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F7F8FA',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  cardBody: {
    padding: 10,
    paddingTop: 8,
    gap: 4,
  },
  cardBodyRtl: {
    alignItems: 'stretch',
  },
  productName: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    textAlign: 'left',
    marginBottom: 2,
  },
  textRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  starsRowRtl: {
    justifyContent: 'flex-end',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  price: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.bold,
    color: '#1B1D36',
    flex: 1,
    minWidth: 0,
  },
  cartBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EEF6F4',       // ← أخضر فاتح
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cartIcon: {
    width: 18,
    height: 18,
  },
  
});