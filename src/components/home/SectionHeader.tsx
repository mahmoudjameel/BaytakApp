import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '../../theme/typography';
import { Colors } from '../../theme/colors';
import { isRTL } from '../../utils/rtl';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll, seeAllLabel }) => {
  const { t } = useTranslation();
  const seeAll = seeAllLabel ?? t('common.seeAll');
  const rtl = isRTL();

  const seeAllBtn = (
    <TouchableOpacity
      style={styles.seeAllBtn}
      onPress={() => onSeeAll?.()}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={[styles.seeAll, rtl && styles.seeAllRtl]}>{seeAll}</Text>
    </TouchableOpacity>
  );

  const titleBlock = (
    <View style={styles.titleWrap}>
      <Text style={[styles.sectionTitle, rtl && styles.sectionTitleRtl]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );

  /**
   * الصف داخل تطبيق RTL ينعكس فيُضغط Text+flex أحياناً فيختفي العنوان.
   * نفرض direction: ltr على الحاوية ونرتب العناصر يدوياً: عربي = عرض الكل | العنوان، إنجليزي = العنوان | عرض الكل.
   */
  return (
    <View style={styles.sectionHeader}>
      {rtl ? (
        <>
          {seeAllBtn}
          {titleBlock}
        </>
      ) : (
        <>
          {titleBlock}
          {seeAllBtn}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    alignSelf: 'stretch',
    width: '100%',
    direction: 'ltr',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.textDark,
    textAlign: 'left',
  },
  sectionTitleRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  seeAllBtn: {
    flexShrink: 0,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.medium,
    color: Colors.primary,
    textAlign: 'right',
  },
  seeAllRtl: {
    textAlign: 'left',
  },
});
