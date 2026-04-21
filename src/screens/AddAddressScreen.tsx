import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  Image,
  DimensionValue,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'AddAddress'>;

type CategoryKey = 'electricity' | 'plumbing' | 'joinery' | 'cleaning';

interface MarkerItem {
  id: string;
  titleKey: string;
  price: string;
  left: DimensionValue;
  top: DimensionValue;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface ServiceItem {
  id: string;
  nameKey: string;
  rating: string;
  distanceKey: string;
  descriptionKey: string;
  image: string;
}

const categoryChips: { key: CategoryKey; color: string }[] = [
  { key: 'electricity', color: '#F7D68A' },
  { key: 'plumbing', color: '#BFE6BF' },
  { key: 'joinery', color: '#9DA7E0' },
  { key: 'cleaning', color: '#7FB8F2' },
];

const MAP_PLACEHOLDER =
  'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80';

const categoryData: Record<CategoryKey, { markers: MarkerItem[]; services: ServiceItem[] }> = {
  electricity: {
    markers: [
      { id: 'e1', titleKey: 'addAddress.electricityMarker', price: '$40/hr', left: '14%', top: '34%', icon: 'flash', color: '#2B83E4' },
      { id: 'e2', titleKey: 'addAddress.handymanMarker', price: '$50/hr', left: '32%', top: '66%', icon: 'home', color: '#F0A734' },
      { id: 'e3', titleKey: 'addAddress.wiringMarker', price: '$35/hr', left: '70%', top: '50%', icon: 'build', color: '#615893' },
    ],
    services: [
      {
        id: 'es1',
        nameKey: 'addAddress.electricServiceName',
        rating: '4,7',
        distanceKey: 'addAddress.distance20',
        descriptionKey: 'addAddress.electricDesc',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },
  plumbing: {
    markers: [
      { id: 'p1', titleKey: 'addAddress.plumbingMarker', price: '$50/hr', left: '6%', top: '40%', icon: 'water', color: '#28B574' },
      { id: 'p2', titleKey: 'addAddress.pipeFixMarker', price: '$30/hr', left: '78%', top: '36%', icon: 'construct', color: '#2B83E4' },
      { id: 'p3', titleKey: 'addAddress.drainMarker', price: '$25/hr', left: '46%', top: '62%', icon: 'hammer', color: '#615893' },
    ],
    services: [
      {
        id: 'ps1',
        nameKey: 'addAddress.plumbServiceName',
        rating: '4,8',
        distanceKey: 'addAddress.distance13',
        descriptionKey: 'addAddress.plumbDesc',
        image: 'https://images.unsplash.com/photo-1607400201889-565b1ee75c35?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },
  joinery: {
    markers: [
      { id: 'j1', titleKey: 'addAddress.joineryMarker', price: '$45/hr', left: '28%', top: '30%', icon: 'hammer', color: '#615893' },
      { id: 'j2', titleKey: 'addAddress.sofaMarker', price: '$55/hr', left: '64%', top: '64%', icon: 'bed', color: '#2B83E4' },
      { id: 'j3', titleKey: 'addAddress.cabinetMarker', price: '$50/hr', left: '10%', top: '66%', icon: 'grid', color: '#F0A734' },
    ],
    services: [
      {
        id: 'js1',
        nameKey: 'addAddress.joineryServiceName',
        rating: '4,9',
        distanceKey: 'addAddress.distance24',
        descriptionKey: 'addAddress.joineryDesc',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },
  cleaning: {
    markers: [
      { id: 'c1', titleKey: 'addAddress.cleaningMarker', price: '$20/hr', left: '42%', top: '24%', icon: 'sparkles', color: '#615893' },
      { id: 'c2', titleKey: 'addAddress.plumbingMarker', price: '$50/hr', left: '6%', top: '40%', icon: 'water', color: '#28B574' },
      { id: 'c3', titleKey: 'addAddress.cleaningMarker', price: '$25/hr', left: '46%', top: '54%', icon: 'person', color: '#28B574' },
      { id: 'c4', titleKey: 'addAddress.handymanMarker', price: '$50/hr', left: '28%', top: '74%', icon: 'home', color: '#F0A734' },
      { id: 'c5', titleKey: 'addAddress.tutoringMarker', price: '$60m', left: '60%', top: '82%', icon: 'school', color: '#615893' },
    ],
    services: [
      {
        id: 'cs1',
        nameKey: 'home.sampleServiceName',
        rating: '4,8',
        distanceKey: 'addAddress.distance15',
        descriptionKey: 'addAddress.cleaningDesc',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=320&q=80',
      },
    ],
  },
};

export const AddAddressScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('cleaning');
  const currentData = useMemo(() => categoryData[selectedCategory], [selectedCategory]);
  const featuredService = currentData.services[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={backChevronIcon()} size={22} color="#1E2239" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('common.addNewAddress')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={23} color="#A5ACC2" />
        <TextInput
          placeholder={t('common.findServicesNearYou')}
          placeholderTextColor="#A5ACC2"
          style={styles.searchInput}
        />
        <Ionicons name="options-outline" size={24} color="#A5ACC2" />
      </View>

      <View style={styles.mapWrap}>
        <ImageBackground source={{ uri: MAP_PLACEHOLDER }} style={styles.map} resizeMode="cover">
          <View style={styles.radiusCircle} />
          {currentData.markers.map((marker) => (
            <View key={marker.id} style={[styles.markerWrap, { left: marker.left, top: marker.top }]}>
              <View style={[styles.markerIconCircle, { backgroundColor: marker.color }]}>
                <Ionicons name={marker.icon} size={14} color="#FFFFFF" />
              </View>
              <View style={styles.markerLabel}>
                <Text style={styles.markerTitle}>{t(marker.titleKey as 'addAddress.electricityMarker')}</Text>
                <Text style={styles.markerPrice}>{marker.price}</Text>
              </View>
            </View>
          ))}
          <View style={styles.pinCenter}>
            <View style={styles.pinOuter}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&q=80',
                }}
                style={styles.pinAvatar}
              />
            </View>
            <View style={styles.pinDot} />
          </View>
        </ImageBackground>
      </View>

      <View style={styles.bottomPanel}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categoryChips.map((chip) => (
            <TouchableOpacity
              key={chip.key}
              activeOpacity={0.85}
              onPress={() => setSelectedCategory(chip.key)}
              style={[
                styles.chip,
                { backgroundColor: chip.color },
                selectedCategory === chip.key && styles.chipActive,
              ]}
            >
              <Text style={[styles.chipText, selectedCategory === chip.key && styles.chipTextActive]}>
                {t(`categories.${chip.key}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.serviceCard}>
          <Image
            source={{
              uri: featuredService.image,
            }}
            style={styles.serviceImage}
          />
          <View style={styles.serviceBody}>
            <View style={styles.serviceTitleRow}>
              <Text style={styles.serviceName} numberOfLines={1}>
                {t(featuredService.nameKey as 'home.sampleServiceName')}
              </Text>
              <View style={styles.ratingWrap}>
                <Ionicons name="star" size={13} color="#F6C225" />
                <Text style={styles.ratingText}>{featuredService.rating}</Text>
              </View>
            </View>
            <View style={styles.distanceRow}>
              <Ionicons name="location" size={12} color="#C6CAD7" />
              <Text style={styles.distanceText}>{t(featuredService.distanceKey as 'addAddress.distance15')}</Text>
            </View>
            <Text style={styles.descText} numberOfLines={2}>
              {t(featuredService.descriptionKey as 'addAddress.cleaningDesc')}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.browseBtn} activeOpacity={0.9}>
          <Text style={styles.browseBtnText}>{t('common.browse')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontSize: 31 / 2,
    color: '#1E2239',
    fontFamily: FontFamily.outfit.semiBold,
  },
  headerSpacer: { width: 34 },
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F3F4F8',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#1E2239',
    fontSize: 14,
    fontFamily: FontFamily.poppins.regular,
    textAlign: 'auto',
  },
  mapWrap: { flex: 1, overflow: 'hidden' },
  map: { flex: 1 },
  radiusCircle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(96, 174, 130, 0.16)',
    left: '50%',
    top: '52%',
    marginLeft: -130,
    marginTop: -130,
  },
  markerWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerLabel: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    minWidth: 72,
  },
  markerTitle: {
    fontSize: 15,
    lineHeight: 17,
    color: '#1E2239',
    fontFamily: FontFamily.outfit.medium,
  },
  markerPrice: {
    fontSize: 16,
    lineHeight: 18,
    color: '#3A4257',
    fontFamily: FontFamily.outfit.regular,
  },
  pinCenter: {
    position: 'absolute',
    left: '50%',
    top: '54%',
    marginLeft: -21,
    alignItems: 'center',
  },
  pinOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinAvatar: { width: 34, height: 34, borderRadius: 17 },
  pinDot: {
    marginTop: 92,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#4AB67B',
  },
  bottomPanel: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 14,
    backgroundColor: 'rgba(130, 188, 246, 0.35)',
  },
  chipsRow: { gap: 8, paddingBottom: 8 },
  chip: {
    minWidth: 86,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  chipActive: {
    borderWidth: 1.2,
    borderColor: '#7FA7D7',
  },
  chipText: { color: '#0E2042', fontSize: 12, fontFamily: FontFamily.outfit.medium },
  chipTextActive: { fontFamily: FontFamily.outfit.semiBold },
  serviceCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5BA0A5',
    backgroundColor: '#F8FBFD',
    padding: 6,
    flexDirection: 'row',
    gap: 9,
  },
  serviceImage: { width: 108, height: 88, borderRadius: 10 },
  serviceBody: { flex: 1, paddingVertical: 2 },
  serviceTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceName: { color: '#1E2239', fontSize: 14, fontFamily: FontFamily.poppins.semiBold, flex: 1 },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 2, marginStart: 6 },
  ratingText: { color: '#8C90A0', fontSize: 12, fontFamily: FontFamily.poppins.regular },
  distanceRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  distanceText: { color: '#A6AAB8', fontSize: 11, fontFamily: FontFamily.poppins.regular },
  descText: { color: '#454A5C', fontSize: 13, lineHeight: 17, fontFamily: FontFamily.poppins.regular, marginTop: 4 },
  browseBtn: {
    marginTop: 10,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  browseBtnText: { color: '#FFFFFF', fontSize: 28 / 2, fontFamily: FontFamily.poppins.semiBold },
});
