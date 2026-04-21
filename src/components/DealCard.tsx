import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';

interface DealCardProps {
  name: string;
  rating: number;
  price: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  onPress?: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  name, rating, price, iconName = 'cube-outline', iconBg = '#F5F5F5', onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
    <View style={[styles.imageArea, { backgroundColor: iconBg }]}>
      <Ionicons name={iconName} size={48} color={Colors.textGray} />
    </View>
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <View style={styles.ratingRow}>
        {[1,2,3,4,5].map(i => (
          <Ionicons key={i} name={i <= Math.floor(rating) ? 'star' : 'star-outline'} size={11} color="#FFB800" />
        ))}
      </View>
      <Text style={styles.price}>{price}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 150,
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
  info: { padding: 10, gap: 4 },
  name: { fontSize: FontSize.sm, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  price: { fontSize: FontSize.sm, fontFamily: FontFamily.outfit.bold, color: Colors.primary },
});
