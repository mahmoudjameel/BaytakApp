import React, { useMemo, useState } from 'react';
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

interface CategoryDef {
  id: string;
  nameKey: string;
  iconImage: ImageSourcePropType;
  color: string;
}

const categoryDefs: CategoryDef[] = [
  { id: '1', nameKey: 'categories.electricity', iconImage: require('../../assets/Vector.png'), color: '#EAF4E4' },
  { id: '2', nameKey: 'categories.plumbing', iconImage: require('../../assets/Vector-1.png'), color: '#EAF4E4' },
  { id: '3', nameKey: 'categories.joinery', iconImage: require('../../assets/Vector-2.png'), color: '#EAF4E4' },
  { id: '4', nameKey: 'categories.cleaning', iconImage: require('../../assets/Group (1).png'), color: '#EAF4E4' },
  { id: '5', nameKey: 'categories.fridge', iconImage: require('../../assets/pest-control 1.png'), color: '#EAF4E4' },
  { id: '6', nameKey: 'categories.sofa', iconImage: require('../../assets/sofa.png'), color: '#EAF4E4' },
  { id: '7', nameKey: 'categories.painting', iconImage: require('../../assets/Vector.png'), color: '#EAF4E4' },
  { id: '8', nameKey: 'categories.more', iconImage: require('../../assets/menu 1.png'), color: '#EAF4E4' },
];

const banners = [
  { id: '1', image: require('../../assets/panner.png') },
  { id: '2', image: require('../../assets/panner.png') },
  { id: '3', image: require('../../assets/panner.png') },
];

export const HomeScreen = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const rtl = isRTL();

  const categories = useMemo(
    () => categoryDefs.map((c) => ({ ...c, name: t(c.nameKey) })),
    [t],
  );

  const nearbyServices: NearbyService[] = useMemo(
    () => [
      {
        id: '1',
        name: t('home.sampleServiceName'),
        rating: '4,8',
        distance: t('home.sampleDistance'),
        priceMain: t('home.samplePriceMain'),
        priceUnit: t('common.sar'),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: '2',
        name: t('home.sampleServiceName'),
        rating: '4,8',
        distance: t('home.sampleDistance'),
        priceMain: t('home.samplePriceMain'),
        priceUnit: t('common.sar'),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: '3',
        name: t('home.sampleServiceName'),
        rating: '4,8',
        distance: t('home.sampleDistance'),
        priceMain: t('home.samplePriceMain'),
        priceUnit: t('common.sar'),
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=900&q=80',
      },
    ],
    [t],
  );

  const contracts = useMemo(
    () => [
      {
        id: '1',
        name: t('home.contractCompany'),
        desc: t('home.contractDesc'),
        due: t('home.contractDue'),
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: '2',
        name: t('home.contractCompany'),
        desc: t('home.contractDesc'),
        due: t('home.contractDue'),
        image: 'https://images.unsplash.com/photo-1592066575517-58df903152f2?auto=format&fit=crop&w=700&q=80',
      },
    ],
    [t],
  );

  const popularStores = useMemo(
    () => [
      {
        id: '1',
        title: t('home.popularTitle'),
        time: t('home.popularTime'),
        price: t('home.popularPrice'),
        tags: [t('categories.plumbingTag'), t('categories.electricalTag')],
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=700&q=80',
      },
      {
        id: '2',
        title: t('home.popularTitle'),
        time: t('home.popularTime'),
        price: t('home.popularPrice'),
        tags: [t('categories.plumbingTag'), t('categories.electricalTag')],
        image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=700&q=80',
      },
    ],
    [t],
  );

  const bestDeals = useMemo(
    () => [
      { id: '1', name: t('home.dealName'), price: t('home.dealPrice'), image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=80' },
      { id: '2', name: t('home.dealName'), price: t('home.dealPrice'), image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=80' },
    ],
    [t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HomeHeader onPressLocation={() => navigation.navigate('AddAddress')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <HomeSearchBar value={search} onChangeText={setSearch} />
        <HomeBannerCarousel banners={banners} onPressBanner={() => navigation.navigate('Offer')} />
        <SectionHeader title={t('home.serviceCategories')} onSeeAll={() => navigation.navigate('AllCategories')} />
        <ServiceCategoriesGrid categories={categories} />
        <SectionHeader title={t('home.nearbyServices')} />
        <NearbyServicesList
          services={nearbyServices}
          onPressService={(service) => navigation.navigate('NearbyServiceDetails', service)}
        />

        <SectionHeader title={t('home.myContract')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {contracts.map(item => (
            <TouchableOpacity key={item.id} style={styles.contractCard} activeOpacity={0.85}>
              <ImageBackground source={{ uri: item.image }} style={styles.contractImage} imageStyle={styles.imageRounded}>
                <TouchableOpacity style={[styles.heartBtn, rtl ? styles.heartBtnRtl : styles.heartBtnLtr]}>
                  <Ionicons name="heart" size={14} color={Colors.white} />
                </TouchableOpacity>
              </ImageBackground>
              <View style={[styles.cardBody, rtl && styles.cardBodyRtl]}>
                <View style={styles.contractTitleRow}>
                  <Text style={[styles.cardTitle, rtl && styles.cardTitleRtl]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={10} color="#F6B100" />
                    <Text style={styles.ratingText}>4.3</Text>
                  </View>
                </View>
                <Text style={[styles.contractDesc, rtl && styles.cardBodyTextRtl]} numberOfLines={2}>
                  {item.desc}
                </Text>
                <View style={[styles.metaRow, rtl && styles.metaRowRtl]}>
                  <Ionicons name="calendar-outline" size={10} color={Colors.textLight} />
                  <Text style={[styles.metaText, rtl && styles.metaTextRtl]}>{item.due}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader title={t('home.popularStore')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {popularStores.map(item => (
            <TouchableOpacity key={item.id} style={styles.popularCard} activeOpacity={0.85}>
              <ImageBackground source={{ uri: item.image }} style={styles.popularImage} imageStyle={styles.imageRounded}>
                <View style={[styles.popularPriceTag, rtl ? styles.popularPriceTagRtl : styles.popularPriceTagLtr]}>
                  <Text style={styles.popularPriceText}>{item.price}</Text>
                </View>
              </ImageBackground>
              <View style={[styles.cardBody, rtl && styles.cardBodyRtl]}>
                <Text style={[styles.cardTitle, rtl && styles.cardTitleRtl]} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={[styles.metaRow, rtl && styles.metaRowRtl]}>
                  <Ionicons name="time-outline" size={10} color={Colors.textLight} />
                  <Text style={[styles.metaText, rtl && styles.metaTextRtl]}>{item.time}</Text>
                </View>
                <View style={styles.tagRow}>
                  {item.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader title={t('home.bestDeal')} onSeeAll={() => navigation.navigate('AllProducts')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.hList, { paddingBottom: 18 }]}
        >
          {bestDeals.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.dealCard}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  rating: 5,
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.dealImage} />
              <View style={[styles.cardBody, rtl && styles.cardBodyRtl]}>
                <Text style={[styles.cardTitle, rtl && styles.cardTitleRtl]} numberOfLines={1}>{item.name}</Text>
                <View style={[styles.starsRow, rtl && styles.starsRowRtl]}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Ionicons key={star} name="star" size={10} color="#F6B100" />
                  ))}
                </View>
                <View style={styles.dealPriceRow}>
                  <Text style={[styles.cardPrice, rtl && styles.cardPriceRtl]}>{item.price}</Text>
                  <View style={styles.dealCartBtn} pointerEvents="none">
                    <Image
                      source={require('../../assets/shopping-bag.png')}
                      style={styles.dealCartIcon}
                      resizeMode="contain"
                    />
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
  heartBtn: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtnLtr: { end: 10 },
  heartBtnRtl: { start: 10 },
  cardTitle: { fontSize: 12, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark, textAlign: 'left', flex: 1, minWidth: 0 },
  cardTitleRtl: { textAlign: 'right', writingDirection: 'rtl' },
  cardBodyTextRtl: { textAlign: 'right', writingDirection: 'rtl' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  /** في RTL: المحاذاة من يمين البطاقة (بداية السطر) — أيقونة ثم التاريخ */
  metaRowRtl: { flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'stretch', width: '100%' },
  metaText: { fontSize: 10, fontFamily: FontFamily.outfit.regular, color: Colors.textLight },
  metaTextRtl: { textAlign: 'right', writingDirection: 'rtl' },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  starsRowRtl: { alignSelf: 'flex-end' },
  dealPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  cardPrice: { fontSize: 13, fontFamily: FontFamily.outfit.bold, color: Colors.textDark, marginTop: 2 },
  cardPriceRtl: { textAlign: 'right', alignSelf: 'stretch', writingDirection: 'rtl' },
  dealCartBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E8F1E3',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dealCartIcon: {
    width: 18,
    height: 18,
  },
  contractCard: {
    width: 186,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF3',
  },
  contractImage: { width: '100%', height: 82 },
  contractTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    minWidth: 0,
    width: '100%',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
    backgroundColor: '#FFF7DF',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: { fontSize: 9, fontFamily: FontFamily.outfit.semiBold, color: '#D99A00' },
  contractDesc: { fontSize: 10, lineHeight: 14, color: '#7A8193', fontFamily: FontFamily.outfit.regular },
  popularCard: {
    width: 186,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF3',
  },
  popularImage: { width: '100%', height: 82 },
  popularPriceTag: {
    position: 'absolute',
    top: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  popularPriceTagLtr: { end: 8 },
  popularPriceTagRtl: { start: 8 },
  popularPriceText: { fontSize: 9, fontFamily: FontFamily.outfit.bold, color: Colors.textDark },
  tagRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  tag: {
    borderRadius: 7,
    backgroundColor: '#EFF4EE',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: { fontSize: 9, color: '#6A7A65', fontFamily: FontFamily.outfit.medium },
  dealCard: {
    width: 150,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF3',
  },
  dealImage: { width: '100%', height: 78, borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#F3F4F6' },
});
