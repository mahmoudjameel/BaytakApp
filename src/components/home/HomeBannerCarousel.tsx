import React, { useRef, useState } from 'react';
import { FlatList, Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Colors } from '../../theme/colors';

interface BannerItem {
  id: string;
  image: ImageSourcePropType;
}

interface HomeBannerCarouselProps {
  banners: BannerItem[];
  onPressBanner?: (banner: BannerItem) => void;
}

export const HomeBannerCarousel: React.FC<HomeBannerCarouselProps> = ({ banners, onPressBanner }) => {
  const { width } = useWindowDimensions();
  const bannerWidth = width - 40;
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerRef = useRef<FlatList<BannerItem> | null>(null);

  return (
    <>
      <FlatList
        ref={bannerRef}
        data={banners}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={bannerWidth}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
          setActiveBanner(index);
        }}
        contentContainerStyle={styles.bannerListContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.banner, { width: bannerWidth }]}
            activeOpacity={0.92}
            onPress={() => onPressBanner?.(item)}
          >
            <Image source={item.image} style={styles.bannerFullImage} resizeMode="cover" />
          </TouchableOpacity>
        )}
      />

      <View style={styles.bannerDotsWrap}>
        <View style={styles.bannerDots}>
          {banners.map((banner, index) => (
            <TouchableOpacity
              key={banner.id}
              onPress={() => {
                bannerRef.current?.scrollToIndex({ index, animated: true });
                setActiveBanner(index);
              }}
              style={[styles.dot, index === activeBanner && styles.dotActive]}
              activeOpacity={0.9}
            />
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bannerListContent: { paddingHorizontal: 16 },
  banner: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    minHeight: 161,
    overflow: 'hidden',
  },
  bannerFullImage: { width: '100%', height: 161 },
  bannerDotsWrap: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  bannerDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EDEFF3',
    paddingVertical: 8,
    paddingHorizontal: 13,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#DDE1EA' },
  dotActive: { width: 20, borderRadius: 6, backgroundColor: Colors.primary },
});

