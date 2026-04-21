import React, { useState, type ComponentProps } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface InputFieldProps extends TextInputProps {
  label: string;
  placeholder?: string;
  /** أيقونة بداية الحقل — مع اتجاه LTR داخل الحقل كما في Figma */
  leadingIcon?: IoniconName;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  placeholderColor?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  leadingIcon,
  isPassword,
  containerStyle,
  labelStyle,
  inputWrapperStyle,
  inputStyle,
  placeholderColor,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { i18n } = useTranslation();
  const rtl = i18n.language?.startsWith('ar') ?? false;
  const hasChrome = !!(leadingIcon || isPassword);

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
      <View
        style={[
          styles.inputWrapper,
          inputWrapperStyle,
          error ? styles.inputError : null,
          hasChrome && (rtl ? styles.inputWrapperRtlChrome : styles.inputWrapperLtrChrome),
        ]}
      >
        {leadingIcon ? (
          <Ionicons name={leadingIcon} size={20} color={Colors.textLight} style={styles.leadingIcon} />
        ) : null}
        <TextInput
          style={[styles.input, inputStyle, { textAlign: rtl ? 'right' : 'left' }, rtl && styles.inputRtl]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor ?? Colors.textLight}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.textDark,
    marginBottom: 8,
    width: '100%',
    alignSelf: 'stretch',
  },
  /** محاذاة صريحة — `direction` على الجذر لا يكفي لعناوين الحقول */
  labelLtr: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  labelRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputFill,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    height: 48,
  },
  inputWrapperLtrChrome: {
    direction: 'ltr',
  },
  inputWrapperRtlChrome: {
    direction: 'rtl',
  },
  leadingIcon: {
    marginEnd: 8,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.outfit.regular,
    color: Colors.textDark,
  },
  inputRtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontFamily: FontFamily.outfit.regular,
    marginTop: 4,
  },
});
