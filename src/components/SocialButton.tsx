import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { isRTL } from '../utils/rtl';

interface SocialButtonProps {
  title: string;
  icon: 'logo-google' | 'logo-apple';
  onPress: () => void;
  style?: ViewStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ title, icon, onPress, style }) => {
  const rtl = isRTL();

  return (
    <TouchableOpacity
      style={[styles.container, rtl && styles.containerRtl, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={22} color={Colors.textDark} />
      <Text style={[styles.text, rtl && styles.textRtl]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E9EF',
    height: 54,
    paddingHorizontal: 24,
    gap: 12,
  },
  containerRtl: {
    flexDirection: 'row-reverse',
  },
  text: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.outfit.medium,
    color: Colors.textDark,
    textAlign: 'center',
  },
  textRtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});