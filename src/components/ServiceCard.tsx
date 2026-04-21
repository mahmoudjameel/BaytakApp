import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';

interface ServiceCardProps {
  name: string;
  rating: number;
  distance: string;
  price: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  onPress?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  name, rating, distance, price, iconName, iconBg = Colors.primaryLight, onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.imageArea, { backgroundColor: iconBg }]}>
      <Ionicons name={iconName} size={48} color={Colors.primary} />
      <TouchableOpacity style={styles.heartBtn}>
        <Ionicons name="heart-outline" size={16} color={Colors.error} />
      </TouchableOpacity>
    </View>
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <View style={styles.ratingRow}>
        {[1,2,3,4,5].map(i => (
          <Ionicons key={i} name={i <= Math.floor(rating) ? 'star' : 'star-outline'} size={10} color="#FFB800" />
        ))}
        <Text style={styles.ratingNum}>{rating}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="location-outline" size={11} color={Colors.textLight} />
        <Text style={styles.distance}>{distance}</Text>
      </View>
      <Text style={styles.price}>{price} SAR</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 160,
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
    width: 160,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: 10, gap: 4 },
  name: { fontSize: FontSize.sm, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingNum: { fontSize: 10, fontFamily: FontFamily.outfit.medium, color: Colors.textDark, marginLeft: 3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  distance: { fontSize: 10, fontFamily: FontFamily.outfit.regular, color: Colors.textLight },
  price: { fontSize: FontSize.sm, fontFamily: FontFamily.outfit.bold, color: Colors.textDark },
});
