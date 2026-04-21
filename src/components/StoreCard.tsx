import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';

interface StoreCardProps {
  title: string;
  deliveryTime: string;
  price: string;
  tags: string[];
  iconName?: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  onPress?: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  title, deliveryTime, price, tags, iconName = 'storefront-outline', iconBg = '#EAF4FB', onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.imageArea, { backgroundColor: iconBg }]}>
      <Ionicons name={iconName} size={44} color="#4C8EB5" />
      <View style={styles.priceTag}>
        <Text style={styles.priceTagText}>{price}</Text>
      </View>
    </View>
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.row}>
        <Ionicons name="time-outline" size={12} color={Colors.textLight} />
        <Text style={styles.time}>{deliveryTime}</Text>
      </View>
      <View style={styles.tagRow}>
        {tags.map((tag, i) => (
          <View key={i} style={styles.tag}>
            <Ionicons name="construct-outline" size={9} color={Colors.primary} />
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  imageArea: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceTagText: {
    fontSize: 10,
    fontFamily: FontFamily.outfit.bold,
    color: Colors.textDark,
  },
  info: { padding: 10, gap: 5 },
  title: { fontSize: FontSize.sm, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  time: { fontSize: 10, fontFamily: FontFamily.outfit.regular, color: Colors.textLight },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: { fontSize: 9, fontFamily: FontFamily.outfit.medium, color: Colors.primary },
});
