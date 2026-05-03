import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { RootStackParamList } from '../navigation/AppNavigator';
import { isRTL } from '../utils/rtl';
import { HomeHeader } from '../components/home/HomeHeader';
import { HomeSearchBar } from '../components/home/HomeSearchBar';
import { HomeBannerCarousel } from '../components/home/HomeBannerCarousel';
import { SectionHeader } from '../components/home/SectionHeader';
import { ServiceCategoriesGrid } from '../components/home/ServiceCategoriesGrid';
import { NearbyService, NearbyServicesList } from '../components/home/NearbyServicesList';
import { CategoriesService, Category, categoryDisplayName } from '../services/categories.service';
import { ProductsService, Product } from '../services/products.service';
import { ProvidersService, Provider } from '../services/providers.service';
import { TokenStorage } from '../services/api';

const FALLBACK_ICONS: ImageSourcePropType[] = [
  require('../../assets/Vector.png'),
  require('../../assets/Vector-1.png'),
  require('../../assets/Vector-2.png'),
  require('../../assets/Group (1).png'),
  require('../../assets/pest-control 1.png'),
  require('../../assets/sofa.png'),
  require('../../assets/Vector.png'),
  require('../../assets/menu 1.png'),
];

const banners = [
  { id: '1', image: require('../../assets/panner.png') },
  { id: '2', image: require('../../assets/panner.png') },
  { id: '3', image: require('../../assets/panner.png') },
];

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80';

export const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const preferAr = (i18n.language ?? '').startsWith('ar');
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const rtl = isRTL();

  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const token = await TokenStorage.getAccess();
        const res = token
          ? await CategoriesService.getAll({ limit: 8 })
          : await CategoriesService.getAllPublic({ limit: 8 });
        setCategories(res.data ?? []);
      } catch {
        setCategories([]);
      }
    };
    void loadCategories();
    ProvidersService.getAll({ limit: 5, isAvailable: true }).then((res) => setProviders(res.data ?? [])).catch(() => {});
    ProductsService.getAll({ limit: 5, isActive: true }).then((res) => setProducts(res.data ?? [])).catch(() => {});
  }, []);

  const categoryItems = categories.map((c, idx) => ({
    id: String(c.id),
    name: categoryDisplayName(c, preferAr),
    iconImage: c.image ? { uri: c.image } as ImageSourcePropType : FALLBACK_ICONS[idx % FALLBACK_ICONS.length],
    color: '#EAF4E4',
  }));

  const nearbyServices: NearbyService[] = providers.map((p) => ({
    id: String(p.id),
    name: p.fullName ?? p.commercialName ?? t('home.sampleServiceName'),
    rating: p.rating != null ? String(p.rating) : '4.8',
    distance: t('home.sampleDistance'),
    priceMain: t('home.samplePriceMain'),
    priceUnit: t('common.sar'),
    image: p.avatar ?? PLACEHOLDER_IMG,
  }));

  const getProductName = (p: Product) => p.title ?? p.name ?? t('home.dealName');
  const getProductPrice = (p: Product) => p.price != null ? `${p.price} ${t('common.sar')}` : t('home.dealPrice');
  const getProductImage = (p: Product) => p.images?.[0] ?? 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=80';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeHeader onPressLocation={() => navigation.navigate('CartAddAddress')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HomeSearchBar value={search} onChangeText={setSearch} />
        <HomeBannerCarousel banners={banners} onPressBanner={() => navigation.navigate('Offer')} />
        <SectionHeader title={t('home.serviceCategories')} onSeeAll={() => navigation.navigate('AllCategories')} />
        <ServiceCategoriesGrid categories={categoryItems} />
        <SectionHeader title={t('home.nearbyServices')} onSeeAll={() => navigation.navigate('AddAddress')} />
        <NearbyServicesList
          services={nearbyServices.length > 0 ? nearbyServices : [
            { id: '1', name: t('home.sampleServiceName'), rating: '4.8', distance: t('home.sampleDistance'), priceMain: t('home.samplePriceMain'), priceUnit: t('common.sar'), image: PLACEHOLDER_IMG },
          ]}
          onPressService={(service) => navigation.navigate('NearbyServiceDetails', service)}
        />

        <SectionHeader title={t('home.bestDeal')} onSeeAll={() => navigation.navigate('AllProducts')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.hList, { paddingBottom: 18 }]}
        >
          {(products.length > 0 ? products : []).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.dealCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  name: getProductName(item),
                  price: getProductPrice(item),
                  image: getProductImage(item),
                  rating: item.rating ?? 5,
                  productId: item.id,
                })
              }
            >
              <Image source={{ uri: getProductImage(item) }} style={styles.dealImage} />
              <View style={[styles.cardBody, rtl && styles.cardBodyRtl]}>
                <Text style={[styles.cardTitle, rtl && styles.cardTitleRtl]} numberOfLines={1}>{getProductName(item)}</Text>
                <View style={[styles.starsRow, rtl && styles.starsRowRtl]}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={10} color="#F6B100" />
                  ))}
                </View>
                <View style={styles.dealPriceRow}>
                  <Text style={[styles.cardPrice, rtl && styles.cardPriceRtl]}>{getProductPrice(item)}</Text>
                  <View style={styles.dealCartBtn} pointerEvents="none">
                    <Image source={require('../../assets/shopping-bag.png')} style={styles.dealCartIcon} resizeMode="contain" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 18, width: '100%' },
  hList: { paddingHorizontal: 16, gap: 10 },
  imageRounded: { borderRadius: 10 },
  cardBody: { padding: 8, gap: 3 },
  cardBodyRtl: { alignItems: 'stretch' },
  cardTitle: { fontSize: 12, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark, textAlign: 'left', flex: 1, minWidth: 0 },
  cardTitleRtl: { textAlign: 'right', writingDirection: 'rtl' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  starsRowRtl: { alignSelf: 'flex-end' },
  dealPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  cardPrice: { fontSize: 13, fontFamily: FontFamily.outfit.bold, color: Colors.textDark, marginTop: 2 },
  cardPriceRtl: { textAlign: 'right', alignSelf: 'stretch', writingDirection: 'rtl' },
  dealCartBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#E8F1E3', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dealCartIcon: { width: 18, height: 18 },
  dealCard: { width: 150, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDEFF3' },
  dealImage: { width: '100%', height: 78, borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#F3F4F6' },
});
