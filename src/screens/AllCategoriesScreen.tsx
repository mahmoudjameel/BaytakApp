import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon, isRTL } from '../utils/rtl';

type Props = NativeStackScreenProps<RootStackParamList, 'AllCategories'>;

const categoryDefs = [
  { id: '1', nameKey: 'categories.cleaning', icon: require('../../assets/Group (1).png') },
  { id: '2', nameKey: 'categories.painting', icon: require('../../assets/Vector.png') },
  { id: '3', nameKey: 'categories.beauty', icon: require('../../assets/Frame.png') },
  { id: '4', nameKey: 'categories.appliance', icon: require('../../assets/Vector-2.png') },
  { id: '5', nameKey: 'categories.acRepair', icon: require('../../assets/Vector-2.png') },
  { id: '6', nameKey: 'categories.plumbing', icon: require('../../assets/Vector-1.png') },
  { id: '7', nameKey: 'categories.electronics', icon: require('../../assets/Vector-1.png') },
  { id: '8', nameKey: 'categories.shifting', icon: require('../../assets/Frame 1171279254.png') },
  { id: '9', nameKey: 'categories.mensSalon', icon: require('../../assets/Frame 1171279258.png') },
  { id: '10', nameKey: 'categories.appliance', icon: require('../../assets/Vector-2.png') },
  { id: '11', nameKey: 'categories.windowCleaner', icon: require('../../assets/Group (1).png') },
  { id: '12', nameKey: 'categories.carpetCleaning', icon: require('../../assets/Group (1).png') },
  { id: '13', nameKey: 'categories.roofRepair', icon: require('../../assets/Vector.png') },
  { id: '14', nameKey: 'categories.kitchenRemodeling', icon: require('../../assets/Vector-2.png') },
  { id: '15', nameKey: 'categories.bathroomRemodeling', icon: require('../../assets/Vector-2.png') },
  { id: '16', nameKey: 'categories.refrigeratorRepair', icon: require('../../assets/pest-control 1.png') },
  { id: '17', nameKey: 'categories.dishwasherRepair', icon: require('../../assets/Vector-2.png') },
  { id: '18', nameKey: 'categories.furnitureAssembly', icon: require('../../assets/sofa.png') },
  { id: '19', nameKey: 'categories.computerRepair', icon: require('../../assets/Vector-1.png') },
  { id: '20', nameKey: 'categories.eventPlanning', icon: require('../../assets/Frame.png') },
];

export const AllCategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const rtl = isRTL();

  const allCategories = useMemo(
    () => categoryDefs.map((c) => ({ ...c, name: t(c.nameKey) })),
    [t],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('common.allCategories')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {allCategories.map((item) => (
            <View key={item.id} style={styles.itemWrap}>
              <View style={styles.iconCircle}>
                <Image source={item.icon} style={styles.icon} resizeMode="contain" />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
  },
  rightPlaceholder: {
    width: 36,
    height: 36,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  itemWrap: {
    width: '23%',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#F5F6F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: Colors.primary,
  },
  itemName: {
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
    color: '#1B1D36',
    fontFamily: FontFamily.outfit.medium,
  },
});
