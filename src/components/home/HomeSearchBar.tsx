import React from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '../../theme/typography';
import { isRTL } from '../../utils/rtl';

interface HomeSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export const HomeSearchBar: React.FC<HomeSearchBarProps> = ({ value, onChangeText }) => {
  const { t } = useTranslation();
  const rtl = isRTL();

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Image source={require('../../../assets/search-normal.png')} style={styles.searchIconImage} resizeMode="contain" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor="#AEB2C2"
          style={[styles.searchInput, rtl && styles.searchInputRtl]}
          textAlign={rtl ? 'right' : 'left'}
        />
        <Image source={require('../../../assets/setting-4.png')} style={[styles.filterIconImage, rtl && styles.filterIconRtl]} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 4,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: FontFamily.poppins.regular,
    color: '#1C1E39',
    paddingVertical: 0,
    writingDirection: 'ltr',
  },
  searchInputRtl: {
    writingDirection: 'rtl',
  },
  searchIconImage: {
    width: 24,
    height: 24,
  },
  filterIconImage: {
    width: 24,
    height: 24,
    marginStart: 6,
  },
  filterIconRtl: {
    marginStart: 0,
    marginEnd: 6,
  },
});
