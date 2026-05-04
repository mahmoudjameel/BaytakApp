import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { isRTL } from '../utils/rtl';
import {
  CitiesService,
  type City,
  filterSaudiCitiesForQuery,
  formatSaudiCityNationalLine,
} from '../services/cities.service';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  /** جلب المدن فقط عند فتح نافذة التعديل لتفادي طلب غير لازم */
  active?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export const NationalAddressAutocomplete: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChangeText,
  disabled,
  active = true,
  containerStyle,
}) => {
  const { i18n, t } = useTranslation();
  const rtl = isRTL();
  const langAr = i18n.language?.startsWith('ar') ?? false;
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBlurTimer = useCallback(() => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
  }, []);

  useEffect(() => () => clearBlurTimer(), [clearBlurTimer]);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    void CitiesService.getAll()
      .then((list) => {
        if (!cancelled) setCities(list);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  const suggestions = useMemo(
    () => filterSaudiCitiesForQuery(cities, value, 20),
    [cities, value],
  );

  const showSuggestions =
    focused && !disabled && value.trim().length >= 1 && suggestions.length > 0 && !loading;

  const lineForCity = useCallback((c: City) => formatSaudiCityNationalLine(c, langAr), [langAr]);

  const secondaryLine = useCallback(
    (c: City) => (langAr ? (c.nameEn?.trim() || null) : (c.nameAr?.trim() || null)),
    [langAr],
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, rtl && styles.labelRtl]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          rtl && styles.inputWrapperRtl,
          disabled && styles.inputDisabled,
        ]}
      >
        <Ionicons name="location-outline" size={20} color={Colors.textLight} style={styles.leadingIcon} />
        <TextInput
          style={[styles.input, rtl && styles.inputRtl]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLight}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          onFocus={() => {
            clearBlurTimer();
            setFocused(true);
          }}
          onBlur={() => {
            clearBlurTimer();
            blurTimer.current = setTimeout(() => setFocused(false), 220);
          }}
          textAlign={rtl ? 'right' : 'left'}
        />
        {loading ? <ActivityIndicator color={Colors.primary} size="small" /> : null}
      </View>
      {loadError ? (
        <Text style={[styles.hint, rtl && styles.hintRtl]}>{t('providerProfile.addressCitiesLoadError')}</Text>
      ) : (
        <Text style={[styles.hint, rtl && styles.hintRtl]}>{t('providerProfile.nationalAddressHint')}</Text>
      )}
      {showSuggestions ? (
        <View style={styles.suggestionsWrap}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.suggestionsScroll}
            showsVerticalScrollIndicator
          >
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.suggestionRow, rtl && styles.suggestionRowRtl]}
                activeOpacity={0.7}
                onPress={() => {
                  clearBlurTimer();
                  onChangeText(lineForCity(item));
                  setFocused(false);
                }}
              >
                <Text style={[styles.suggestionMain, rtl && styles.suggestionMainRtl]} numberOfLines={2}>
                  {lineForCity(item)}
                </Text>
                {secondaryLine(item) ? (
                  <Text style={[styles.suggestionSub, rtl && styles.suggestionSubRtl]} numberOfLines={1}>
                    {secondaryLine(item)}
                  </Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, alignSelf: 'stretch', width: '100%' },
  label: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.textDark,
    marginBottom: 8,
    width: '100%',
    textAlign: 'left',
  },
  labelRtl: { textAlign: 'right', writingDirection: 'rtl' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputFill,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputWrapperRtl: { flexDirection: 'row-reverse' },
  inputDisabled: { opacity: 0.55 },
  leadingIcon: { marginEnd: 8 },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.outfit.regular,
    color: Colors.textDark,
    paddingVertical: 10,
  },
  inputRtl: { writingDirection: 'rtl' },
  hint: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    textAlign: 'left',
  },
  hintRtl: { textAlign: 'right', writingDirection: 'rtl' },
  suggestionsWrap: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionsScroll: { maxHeight: 200 },
  suggestionRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF0F5',
  },
  suggestionRowRtl: { alignItems: 'flex-end' },
  suggestionMain: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.medium,
    color: '#1B1D36',
    textAlign: 'left',
  },
  suggestionMainRtl: { textAlign: 'right', writingDirection: 'rtl' },
  suggestionSub: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#9AA0AE',
    textAlign: 'left',
  },
  suggestionSubRtl: { textAlign: 'right', writingDirection: 'rtl' },
});
