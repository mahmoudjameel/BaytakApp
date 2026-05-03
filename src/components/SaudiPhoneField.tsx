import React from 'react';
import { View, Text, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
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
      <Text style={[styles.label, labelStyle, rtl ? styles.labelRtl : styles.labelLtr]}>{label}</Text>

      <View style={[styles.card, wrapperStyle]}>
        <View style={styles.prefixBlock}>
          <Text style={styles.prefixText} accessibilityRole="text">
            +966
          </Text>
        </View>

        <View style={styles.inputBlock}>
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
          />
        </View>
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

  /** صندوق واحد: في RTL يظهر الجزء الأول (المقدمة) يمينًا تلقائيًا */
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E8EF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  prefixBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
    minWidth: 76,
    backgroundColor: Colors.primaryLight,
    borderEndWidth: StyleSheet.hairlineWidth,
    borderEndColor: '#C5DDD4',
  },
  prefixText: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.primary,
    letterSpacing: 0.3,
    writingDirection: 'ltr',
  },

  inputBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F8FAFB',
  },
  input: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.medium,
    color: '#1E2239',
    paddingVertical: 8,
    margin: 0,
    direction: 'ltr',
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
