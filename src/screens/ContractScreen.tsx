import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FontFamily } from '../theme/typography';
import { backArrowIcon, isRTL } from '../utils/rtl';

type ContractTab = 'active' | 'pendingApproval' | 'completed';

const tabs: ContractTab[] = ['active', 'pendingApproval', 'completed'];

export const ContractScreen = () => {
  const { t } = useTranslation();
  const rtl = isRTL();
  const [activeTab, setActiveTab] = useState<ContractTab>('active');
  const [search, setSearch] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [location, setLocation] = useState(t('contractFilter.defaultLocation'));
  const [selectedCategory, setSelectedCategory] = useState('all');

  const contracts = useMemo(
    () => [
      {
        id: '1',
        name: t('contract.serviceName'),
        rating: '4,8',
        provider: t('contract.provider'),
        desc: t('contract.description'),
        status: 'active' as ContractTab,
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: '2',
        name: t('contract.serviceName'),
        rating: '4,8',
        provider: t('contract.provider'),
        desc: t('contract.description'),
        status: 'active' as ContractTab,
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: '3',
        name: t('contract.serviceName'),
        rating: '4,8',
        provider: t('contract.provider'),
        desc: t('contract.description'),
        status: 'pendingApproval' as ContractTab,
        image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=900&q=80',
      },
      {
        id: '4',
        name: t('contract.serviceName'),
        rating: '4,8',
        provider: t('contract.provider'),
        desc: t('contract.description'),
        status: 'active' as ContractTab,
        image: 'https://images.unsplash.com/photo-1616627452098-f828b4e67665?auto=format&fit=crop&w=900&q=80',
      },
    ],
    [t],
  );

  const filtered = contracts.filter(
    (item) =>
      item.status === activeTab &&
      (item.name.toLowerCase().includes(search.toLowerCase()) || item.provider.toLowerCase().includes(search.toLowerCase())),
  );

  const tabLabel = (tab: ContractTab) => {
    if (tab === 'active') return t('common.active');
    if (tab === 'pendingApproval') return t('common.pendingApproval');
    return t('common.completed');
  };

  const statusBadgeText = (status: ContractTab) => {
    if (status === 'pendingApproval') return t('common.pending');
    if (status === 'active') return t('common.active');
    return t('common.completed');
  };
  const visibleTabs = rtl ? [...tabs].reverse() : tabs;
  const filterCategories = [
    { key: 'all', label: t('contractFilter.allService') },
    { key: 'assembly', label: t('contractFilter.assembly') },
    { key: 'electronics', label: t('contractFilter.electronics') },
    { key: 'waxing', label: t('contractFilter.waxing') },
  ];
  const visibleFilterCategories = rtl ? [...filterCategories].reverse() : filterCategories;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, rtl && styles.headerRtl]}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name={backArrowIcon()} size={23} color="#1B1D36" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('contract.title')}</Text>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={20} color="#1B1D36" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={23} color="#A5ACC2" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('common.searchContract')}
          placeholderTextColor="#A5ACC2"
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={() => setShowFilterModal(true)} hitSlop={10}>
          <Ionicons name="options-outline" size={22} color="#A5ACC2" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsRow}>
        {visibleTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.9}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]} numberOfLines={1}>
              {tabLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardBody}>
              <View style={[styles.titleRow, rtl && styles.titleRowRtl]}>
                <Text style={[styles.nameText, rtl && styles.textRtl]}>{item.name}</Text>
                <View style={[styles.ratingWrap, rtl && styles.ratingWrapRtl]}>
                  <Ionicons name="star" size={13} color="#F6C225" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={[styles.providerText, rtl && styles.textRtl]}>{item.provider}</Text>
              <View style={[styles.statusRow, rtl && styles.statusRowRtl]}>
                <Text style={[styles.descText, rtl && styles.textRtl]}>{item.desc}</Text>
                <View style={[styles.statusBadge, item.status !== 'active' && styles.pendingBadge]}>
                  <Text style={[styles.statusText, item.status !== 'active' && styles.pendingText]}>
                    {statusBadgeText(item.status)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setShowFilterModal(false)} />
          <View style={styles.filterSheet}>
            <Text style={[styles.filterLabel, rtl && styles.textRtl]}>{t('contractFilter.locations')}</Text>
            <View style={styles.locationBox}>
              <TextInput
                value={location}
                onChangeText={setLocation}
                style={[styles.locationInput, rtl && styles.textRtl]}
                placeholder={t('contractFilter.defaultLocation')}
                placeholderTextColor="#A5ACC2"
              />
              <Ionicons name="location-outline" size={21} color="#157E7A" />
            </View>

            <Text style={[styles.filterLabel, rtl && styles.textRtl]}>{t('contractFilter.categories')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {visibleFilterCategories.map((category) => {
                const active = selectedCategory === category.key;
                return (
                  <TouchableOpacity
                    key={category.key}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory(category.key)}
                  >
                    <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[styles.priceRow, rtl && styles.priceRowRtl]}>
              <Text style={styles.priceTitle}>{t('contractFilter.priceRange')}</Text>
              <Text style={styles.priceValue}>$40 - $120</Text>
            </View>

            <View style={styles.sliderArea}>
              <View style={styles.sliderGhostBars}>
                {[30, 42, 50, 62, 72, 84, 95, 78].map((h, idx) => (
                  <View key={idx} style={[styles.sliderGhostBar, { height: h }]} />
                ))}
              </View>
              <View style={styles.sliderTrackBase} />
              <View style={[styles.sliderTrackActive, rtl && styles.sliderTrackActiveRtl]} />
              <View style={[styles.sliderKnobLeft, rtl && styles.sliderKnobLeftRtl]} />
              <View style={[styles.sliderKnobRight, rtl && styles.sliderKnobRightRtl]}>
                <Ionicons name={rtl ? 'chevron-back' : 'chevron-forward'} size={16} color="#FFFFFF" />
              </View>
            </View>

            <TouchableOpacity style={styles.applyFilterBtn} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyFilterText}>{t('contractFilter.applyFilter')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerRtl: {
    flexDirection: 'row-reverse',
  },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EAF0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  searchWrap: {
    marginHorizontal: 16,
    marginTop: 6,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F3F4F8',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#1E2239',
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    textAlign: 'auto',
  },
  tabsRow: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#F1F2F6',
    borderRadius: 12,
    padding: 5,
    flexDirection: 'row',
    gap: 5,
  },
  tabsRowRtl: {
    flexDirection: 'row-reverse',
  },
  tabBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBtnActive: { backgroundColor: '#157E7A' },
  tabText: { fontSize: 11, color: '#B2B6C0', fontFamily: FontFamily.outfit.medium },
  tabTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24, gap: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  cardImage: { width: '100%', height: 118 },
  cardBody: { padding: 10, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRowRtl: { flexDirection: 'row-reverse' },
  nameText: { flex: 1, fontSize: 15, color: '#1B1D36', fontFamily: FontFamily.outfit.semiBold },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 3, marginStart: 8 },
  ratingWrapRtl: { flexDirection: 'row-reverse', marginStart: 0, marginEnd: 8 },
  ratingText: { fontSize: 15, color: '#8E95A6', fontFamily: FontFamily.outfit.regular },
  providerText: { fontSize: 14, color: '#1B1D36', fontFamily: FontFamily.outfit.medium },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  statusRowRtl: { flexDirection: 'row-reverse' },
  descText: { flex: 1, fontSize: 13, lineHeight: 17, color: '#5A6072', fontFamily: FontFamily.outfit.regular },
  statusBadge: {
    minWidth: 64,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#45A767',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pendingBadge: { backgroundColor: '#F4EFD8' },
  statusText: { color: '#FFFFFF', fontSize: 12, fontFamily: FontFamily.outfit.medium },
  pendingText: { color: '#1B1D36' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  filterSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
    gap: 10,
  },
  filterLabel: {
    fontSize: 34 / 2,
    color: '#1B1D36',
    fontFamily: FontFamily.outfit.semiBold,
  },
  locationBox: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F6F7FA',
    borderWidth: 1,
    borderColor: '#ECEEF3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E2239',
    fontFamily: FontFamily.outfit.regular,
    textAlign: 'auto',
  },
  categoryRow: {
    gap: 10,
    paddingBottom: 4,
  },
  categoryChip: {
    height: 42,
    borderRadius: 20,
    paddingHorizontal: 18,
    backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#DFF4E8',
  },
  categoryChipText: {
    fontSize: 16,
    color: '#303649',
    fontFamily: FontFamily.outfit.medium,
  },
  categoryChipTextActive: {
    color: '#157E7A',
  },
  priceRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRowRtl: { flexDirection: 'row-reverse' },
  priceTitle: {
    fontSize: 36 / 2,
    color: '#1B1D36',
    fontFamily: FontFamily.outfit.semiBold,
  },
  priceValue: {
    fontSize: 19,
    color: '#157E7A',
    fontFamily: FontFamily.outfit.semiBold,
  },
  sliderArea: {
    height: 92,
    justifyContent: 'center',
  },
  sliderGhostBars: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  sliderGhostBar: {
    width: 20,
    borderRadius: 6,
    backgroundColor: '#EFF1F4',
  },
  sliderTrackBase: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#E2E4E9',
    marginHorizontal: 4,
  },
  sliderTrackActive: {
    position: 'absolute',
    left: '18%',
    right: '42%',
    height: 7,
    borderRadius: 4,
    backgroundColor: '#157E7A',
  },
  sliderTrackActiveRtl: {
    left: '42%',
    right: '18%',
  },
  sliderKnobLeft: {
    position: 'absolute',
    left: '15%',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#157E7A',
  },
  sliderKnobLeftRtl: {
    left: undefined,
    right: '15%',
  },
  sliderKnobRight: {
    position: 'absolute',
    right: '39%',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#157E7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderKnobRightRtl: {
    right: undefined,
    left: '39%',
  },
  applyFilterBtn: {
    marginTop: 4,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#157E7A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyFilterText: {
    color: '#FFFFFF',
    fontSize: 35 / 2,
    fontFamily: FontFamily.outfit.semiBold,
  },
});
