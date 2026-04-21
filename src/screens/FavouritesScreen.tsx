import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'Favourites'>;

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=80',
];

type FavItem = { id: string; image: string; rating: number };

const items: FavItem[] = PRODUCT_IMAGES.map((img, i) => ({
  id: String(i + 1),
  image: img,
  rating: 4,
}));

export const FavouritesScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const gap = 12;
  const pad = 16;
  const cardWidth = (width - pad * 2 - gap) / 2;

  const renderStars = (rating: number) =>
    [1, 2, 3, 4, 5].map((i) => (
      <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={13} color="#F6B100" />
    ));

  const renderItem = useCallback(
    ({ item }: { item: FavItem }) => (
      <TouchableOpacity style={[styles.card, { width: cardWidth }]} activeOpacity={0.88}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <TouchableOpacity style={styles.heartBtn} activeOpacity={0.8}>
            <Ionicons name="heart" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.productName} numberOfLines={1}>
            {t('favourites.productName')}
          </Text>
          <View style={styles.starsRow}>{renderStars(item.rating)}</View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{t('favourites.productPrice')}</Text>
            <TouchableOpacity style={styles.cartBtn}>
              <Image
                source={require('../../assets/shopping-bag.png')}
                style={styles.cartIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [cardWidth, t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('favourites.title')}</Text>
        <View style={styles.headerSide} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#A0A7B5" />
        <Text style={styles.searchPlaceholder}>{t('favourites.searchPlaceholder')}</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={18} color="#5C6272" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
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
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerSide: { width: 36 },
  title: { fontSize: 18, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#A0A7B5',
  },
  filterBtn: { padding: 4 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF3',
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative' },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    end: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: 10, gap: 4 },
  productName: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: { fontSize: 13, fontFamily: FontFamily.outfit.bold, color: '#1B1D36' },
  cartBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF6F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: { width: 16, height: 16 },
});
