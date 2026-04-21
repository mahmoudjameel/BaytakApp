import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { FontFamily } from '../../theme/typography';
import { isRTL } from '../../utils/rtl';

interface CategoryItem {
  id: string;
  name: string;
  iconImage: ImageSourcePropType;
  color: string;
}

interface ServiceCategoriesGridProps {
  categories: CategoryItem[];
}

export const ServiceCategoriesGrid: React.FC<ServiceCategoriesGridProps> = ({ categories }) => {
  const { width } = useWindowDimensions();
  const horizontalPadding = 20;
  const gap = 10;
  const cardWidth = Math.max(72, Math.min(92, (width - (horizontalPadding * 2) - (gap * 3)) / 4));
  const cardHeight = Math.max(78, Math.min(104, cardWidth * 0.99));
  const iconSize = Math.max(24, Math.min(33, cardWidth * 0.42));
  const rtl = isRTL();

  return (
    <View style={[styles.categoriesGrid, rtl && styles.categoriesGridRtl]}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.categoryItem, { backgroundColor: cat.color, width: cardWidth, height: cardHeight }]}
          activeOpacity={0.8}
        >
          <View style={styles.categoryIcon}>
            <Image source={cat.iconImage} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
          </View>
          <Text style={[styles.categoryName, rtl && styles.categoryNameRtl]} numberOfLines={2}>
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 10,
  },
  /** صف الفئات يبدأ من اليمين */
  categoriesGridRtl: { flexDirection: 'row-reverse' },
  categoryItem: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  categoryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: FontFamily.poppins.regular,
    color: '#111827',
    textAlign: 'center',
    textTransform: 'none',
    marginTop: 0,
  },
  categoryNameRtl: {
    writingDirection: 'rtl',
  },
});
