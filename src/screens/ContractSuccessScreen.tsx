import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ContractSuccess'>;

export const ContractSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.centerContent}>
        <View style={styles.outerRing}>
          <View style={styles.midRing}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={34} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <Text style={styles.title}>{t('contractSuccess.title')}</Text>
        <Text style={styles.description}>{t('contractSuccess.description')}</Text>
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.btnText}>{t('contractSuccess.backHome')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.btnText}>{t('contractSuccess.viewDetails')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F6' },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  outerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E9F4F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  midRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#D8EEE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#15BA83',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 8,
    fontSize: 42 / 2,
    color: '#1B1D36',
    fontFamily: FontFamily.outfit.semiBold,
  },
  description: {
    marginTop: 10,
    fontSize: 34 / 2,
    lineHeight: 27,
    color: '#6A7082',
    fontFamily: FontFamily.outfit.regular,
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 62,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    height: 62,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 34 / 2,
    fontFamily: FontFamily.outfit.semiBold,
  },
});
