import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '../../theme/typography';
import { isRTL } from '../../utils/rtl';

export interface NearbyService {
  id: string;
  name: string;
  rating: string;
  distance: string;
  priceMain: string;
  priceUnit: string;
  image: string;
}

interface NearbyServicesListProps {
  services: NearbyService[];
  onPressService?: (service: NearbyService) => void;
}

export const NearbyServicesList: React.FC<NearbyServicesListProps> = ({ services, onPressService }) => {
  const { width } = useWindowDimensions();
  const scale = Math.max(0.9, Math.min(1.05, width / 390));
  /** عرض أوضح للنص العربي */
  const cardWidth = Math.max(158, Math.min(178, width * 0.44));
  const imageWidth = cardWidth - 2;
  const imageHeight = Math.round(cardWidth * 1.05);
  const rtl = isRTL();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.nearbyList}
    >
      {services.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.serviceCard, { width: cardWidth }]}
          activeOpacity={0.85}
          onPress={() => onPressService?.(item)}
        >
          <ImageBackground
            source={{ uri: item.image }}
            style={[styles.serviceImage, { width: imageWidth, height: imageHeight }]}
            imageStyle={styles.imageRounded}
          >
            <TouchableOpacity style={[styles.heartBtn, rtl ? styles.heartBtnRtl : styles.heartBtnLtr]}>
              <Ionicons name="heart" size={Math.round(26 * scale)} color="#F40000" />
            </TouchableOpacity>
          </ImageBackground>

          <View style={[styles.nearbyBody, rtl && styles.nearbyBodyRtl]}>
            {/* صف العنوان + التقييم: في العربية الاسم يبدأ من اليمين والتقييم يسار النص */}
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  { fontSize: Math.round(14 * scale), lineHeight: Math.round(18 * scale) },
                  rtl && styles.titleRtl,
                ]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <View style={styles.ratingWrap}>
                <Ionicons name="star" size={Math.round(14 * scale)} color="#F6C225" />
                <Text style={[styles.ratingText, { fontSize: Math.round(11 * scale) }]}>{item.rating}</Text>
              </View>
            </View>

            {/* LTR: مسافة يسار، سعر يمين | RTL: سعر يمين الشاشة، مسافة يسار */}
            <View style={styles.bottomRow}>
              {rtl ? (
                <>
                  <Text style={[styles.price, { fontSize: Math.round(15 * scale) }, styles.textRtl]}>
                    {item.priceMain}{' '}
                    <Text style={[styles.priceUnit, { fontSize: Math.round(13 * scale) }]}>{item.priceUnit}</Text>
                  </Text>
                  <View style={styles.distWrap}>
                    <Ionicons name="location" size={Math.round(11 * scale)} color="#D2D3D9" />
                    <Text style={[styles.distText, { fontSize: Math.round(10 * scale) }, styles.textRtl]}>
                      {item.distance}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.distWrap}>
                    <Ionicons name="location" size={Math.round(11 * scale)} color="#D2D3D9" />
                    <Text style={[styles.distText, { fontSize: Math.round(10 * scale) }]}>{item.distance}</Text>
                  </View>
                  <Text style={[styles.price, { fontSize: Math.round(15 * scale) }]}>
                    {item.priceMain}{' '}
                    <Text style={[styles.priceUnit, { fontSize: Math.round(13 * scale) }]}>{item.priceUnit}</Text>
                  </Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  nearbyList: { paddingHorizontal: 16, gap: 12, paddingBottom: 2 },
  serviceCard: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDEFF3',
  },
  imageRounded: { borderRadius: 10 },
  serviceImage: { alignSelf: 'center' },
  heartBtn: { position: 'absolute', top: 10, alignItems: 'center', justifyContent: 'center' },
  heartBtnLtr: { end: 10 },
  heartBtnRtl: { start: 10 },
  nearbyBody: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 8,
  },
  nearbyBodyRtl: {
    alignItems: 'stretch',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontFamily: FontFamily.poppins.semiBold,
    color: '#1D2037',
    textAlign: 'left',
  },
  titleRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingTop: 2,
    flexShrink: 0,
  },
  ratingText: { color: '#989BA8', fontFamily: FontFamily.poppins.regular },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    width: '100%',
  },
  price: {
    fontFamily: FontFamily.poppins.semiBold,
    color: '#30205A',
    flexShrink: 0,
  },
  priceUnit: { fontFamily: FontFamily.poppins.regular, color: '#30205A' },
  distWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0,
    justifyContent: 'flex-start',
  },
  distText: {
    color: '#9AA0AE',
    fontFamily: FontFamily.poppins.regular,
    flexShrink: 1,
  },
  textRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
