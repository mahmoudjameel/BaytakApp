import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';

interface ContractCardProps {
  name: string;
  rating: number;
  description: string;
  dueDate: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconBg?: string;
  status?: 'Active' | 'Pending' | 'Completed';
  horizontal?: boolean;
  onPress?: () => void;
}

const statusColors = {
  Active: { bg: Colors.primaryLight, text: Colors.primary },
  Pending: { bg: '#FFF8E7', text: '#FFB800' },
  Completed: { bg: '#E8F5E9', text: '#34A853' },
};

export const ContractCard: React.FC<ContractCardProps> = ({
  name, rating, description, dueDate, iconName = 'construct-outline',
  iconBg = '#E8F0FE', status, horizontal = false, onPress,
}) => (
  <TouchableOpacity
    style={[styles.card, horizontal && styles.cardHorizontal]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={[styles.imageArea, horizontal && styles.imageAreaHorizontal, { backgroundColor: iconBg }]}>
      <Ionicons name={iconName} size={44} color={Colors.primary} />
      <TouchableOpacity style={styles.heartBtn}>
        <Ionicons name="heart-outline" size={14} color={Colors.textLight} />
      </TouchableOpacity>
    </View>
    <View style={[styles.info, horizontal && styles.infoHorizontal]}>
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FFB800" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <Text style={styles.desc} numberOfLines={2}>{description}</Text>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={12} color={Colors.textLight} />
        <Text style={styles.due}>{dueDate}</Text>
        {status && (
          <View style={[styles.statusBadge, { backgroundColor: statusColors[status].bg }]}>
            <Text style={[styles.statusText, { color: statusColors[status].text }]}>{status}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHorizontal: {
    width: '100%',
    flexDirection: 'row',
  },
  imageArea: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAreaHorizontal: {
    width: 100,
    height: 'auto',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: 12, gap: 6 },
  infoHorizontal: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { flex: 1, fontSize: FontSize.sm, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: { fontSize: 10, fontFamily: FontFamily.outfit.medium, color: '#FFB800' },
  desc: { fontSize: 11, fontFamily: FontFamily.outfit.regular, color: Colors.textGray, lineHeight: 15 },
  due: { fontSize: 10, fontFamily: FontFamily.outfit.regular, color: Colors.textLight },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 'auto' },
  statusText: { fontSize: 10, fontFamily: FontFamily.outfit.semiBold },
});
