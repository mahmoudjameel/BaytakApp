import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '../theme/typography';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../utils/rtl';

type AccountType = 'provider' | 'company' | 'individual';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChooseAccount'>;
};

const accountDefs: { type: AccountType; icon: ImageSourcePropType }[] = [
  { type: 'provider', icon: require('../../assets/Frame.png') },
  { type: 'company', icon: require('../../assets/Frame 1171279254.png') },
  { type: 'individual', icon: require('../../assets/Frame 1171279258.png') },
];

export const ChooseAccountScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [selected, setSelected] = useState<AccountType | null>('provider');

  const accounts = useMemo(
    () =>
      accountDefs.map((acc) => ({
        ...acc,
        label:
          acc.type === 'provider'
            ? t('chooseAccount.serviceProvider')
            : acc.type === 'company'
              ? t('chooseAccount.company')
              : t('chooseAccount.individual'),
        description: t('chooseAccount.cardDescription'),
      })),
    [t],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.topBar, rtl && styles.topBarRtl]}>
        <TouchableOpacity
          style={styles.backHit}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Login'))}
          hitSlop={12}
        >
          <Ionicons name={backChevronIcon()} size={24} color="#1B1D36" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, rtl && styles.textRtl]}>{t('chooseAccount.title')}</Text>
        <Text style={[styles.subtitle, rtl && styles.textRtl]}>{t('chooseAccount.subtitle')}</Text>

        {accounts.map((acc) => (
          <TouchableOpacity
            key={acc.type}
            style={[styles.card, selected === acc.type && styles.cardSelected]}
            onPress={() => setSelected(acc.type)}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIcon, selected === acc.type && styles.cardIconSelected]}>
              <Image source={acc.icon} style={styles.iconImage} resizeMode="contain" />
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardLabel, selected === acc.type && styles.cardLabelSelected, rtl && styles.textRtl]}>
                {acc.label}
              </Text>
              <Text style={[styles.cardDesc, selected === acc.type && styles.cardDescSelected, rtl && styles.textRtl]}>
                {acc.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={t('chooseAccount.chooseButton')}
          onPress={() => selected && navigation.navigate('CreateAccount', { accountType: selected })}
          disabled={!selected}
          style={styles.submitButton}
          textStyle={styles.submitButtonText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  topBar: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  topBarRtl: {
    alignItems: 'flex-start',
  },
  backHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 8,
    width: '100%',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FontFamily.outfit.regular,
    color: '#8B92A8',
    marginBottom: 22,
    lineHeight: 20,
    width: '100%',
    textAlign: 'left',
  },
  textRtl: {
    textAlign: 'right',
    writingDirection: 'rtl',
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E8EAEF',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    gap: 14,
  },
  cardSelected: {
    borderColor: '#1F8482',
    backgroundColor: '#1F8482',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconSelected: {
    backgroundColor: '#FFFFFF',
  },
  iconImage: { width: 28, height: 28 },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardLabel: {
    fontSize: 17,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#0D0F20',
    marginBottom: 6,
  },
  cardLabelSelected: {
    color: '#FFFFFF',
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#5A6178',
    lineHeight: 18,
  },
  cardDescSelected: {
    color: 'rgba(255,255,255,0.92)',
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: '#F8F8F8',
  },
  submitButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1F8482',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#FFFFFF',
  },
});
