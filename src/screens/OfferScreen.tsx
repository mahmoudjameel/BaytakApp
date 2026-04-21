import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { backChevronIcon } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'Offer'>;

const offers = [
  {
    id: '1',
    image: require('../../assets/offer/Frame 1171279031.png'),
  },
  {
    id: '2',
    image: require('../../assets/offer/Frame 1171279034.png'),
  },
  {
    id: '3',
    image: require('../../assets/offer/Frame 1171279035.png'),
  },
  {
    id: '4',
    image: require('../../assets/offer/Frame 1171279036.png'),
  },
  {
    id: '5',
    image: require('../../assets/offer/Frame 1171279037.png'),
  },
  {
    id: '6',
    image: require('../../assets/offer/Frame 1171279038.png'),
  },
];

export const OfferScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={backChevronIcon()} size={22} color="#1E2239" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('common.offer')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {offers.map((item) => (
          <Image key={item.id} source={item.image} style={styles.offerImage} resizeMode="cover" />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: '#1E2239', fontFamily: FontFamily.outfit.semiBold },
  headerSpacer: { width: 34 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 10 },
  offerImage: { width: '100%', height: 130, borderRadius: 14 },
});
