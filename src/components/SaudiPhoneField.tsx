import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { FontFamily } from '../theme/typography';
import { sanitizeSaudiLocalDigits } from '../utils/saudiPhone';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (localDigits: string) => void;
  rtl: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  placeholderColor?: string;
};

export const SaudiPhoneField: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChangeText,
  rtl,
  containerStyle,
  labelStyle,
  wrapperStyle,
  inputStyle,
  placeholderColor = '#A7AEC1',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          styles.label,
          labelStyle,
          rtl ? styles.labelRtl : styles.labelLtr,
        ]}
      >
        {label}
      </Text>

      <View style={[styles.row, wrapperStyle]}>
        <View style={styles.prefix}>
          <Text style={styles.flag}>🇸🇦</Text>
          <Text style={styles.code}>+966</Text>
        </View>

        <View style={styles.divider} />

        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={(t) => onChangeText(sanitizeSaudiLocalDigits(t))}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType="phone-pad"
          autoCorrect={false}
          autoComplete="tel-national"
          textContentType="telephoneNumber"
          textAlign="left"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 8,
    width: '100%',
  },
  labelLtr: { textAlign: 'left', writingDirection: 'ltr' },
  labelRtl: { textAlign: 'right', writingDirection: 'rtl' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F1F5',
    backgroundColor: '#F5F6FA',
    overflow: 'hidden',
    paddingHorizontal: 14,
  },

  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
  },
  flag: {
    fontSize: 18,
    lineHeight: 22,
  },
  code: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    letterSpacing: 0.2,
    writingDirection: 'ltr',
  },

  divider: {
    width: 1,
    height: 22,
    backgroundColor: '#D8DCE6',
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#1E2239',
    paddingVertical: 0,
    writingDirection: 'ltr',
    textAlign: 'left',
  },
});
