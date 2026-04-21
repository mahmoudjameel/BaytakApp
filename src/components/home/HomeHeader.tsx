import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '../../theme/typography';
import { Colors } from '../../theme/colors';

interface HomeHeaderProps {
  onPressLocation?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onPressLocation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.locationRow} activeOpacity={0.8} onPress={onPressLocation}>
        <Ionicons name="location-sharp" size={15} color={Colors.primary} />
        <Text style={styles.locationText}>{t('home.location')}</Text>
        <Ionicons name="chevron-down" size={13} color={Colors.textDark} />
      </TouchableOpacity>

      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="chatbubble-outline" size={17} color="#1E1F3A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={17} color="#1E1F3A" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 6,
    minHeight: 34,
    backgroundColor: '#FFFFFF',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    lineHeight: 16,
    fontFamily: FontFamily.poppins.semiBold,
    color: '#1C1E39',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    end: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
});
