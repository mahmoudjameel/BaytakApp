import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { isRTL } from '../../utils/rtl';
import {
  CategoriesService,
  Category,
  categoryDisplayName,
  getSelectableServiceItems,
} from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { TokenStorage } from '../../services/api';
import { categoryLoadErrorMessage, toErrorMessage } from '../../utils/errors';
import { devLog } from '../../utils/devLog';

type Props = NativeStackScreenProps<RootStackParamList, 'ProviderSelectServices'>;

const StepIndicator = ({ current, total, rtl }: { current: number; total: number; rtl: boolean }) => (
  <View style={[stepStyles.row, rtl && stepStyles.rowRtl]}>
    {Array.from({ length: total }).map((_, i) => (
      <View key={i} style={[stepStyles.bar, i < current ? stepStyles.barActive : stepStyles.barInactive]} />
    ))}
  </View>
);

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, marginBottom: 24 },
  rowRtl: { flexDirection: 'row-reverse' },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  barActive: { backgroundColor: Colors.primary },
  barInactive: { backgroundColor: '#E0E0E0' },
});

const FALLBACK_ICONS = [
  require('../../../assets/shopping-bag.png'),
  require('../../../assets/Vector-1.png'),
  require('../../../assets/Vector-2.png'),
  require('../../../assets/menu 1.png'),
];

export const ProviderSelectServicesScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t, i18n } = useTranslation();
  const rtl = isRTL();
  const preferAr = (i18n.language ?? '').startsWith('ar');
  const [selected, setSelected] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  /** تصنيف مفتوح لعرض العناصر الداخلية (أكورديون) */
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const registrationData = route.params?.registrationData;

  /** أثناء تسجيل مزوّد جديد لا يُستخدم توكن قديم من جلسة سابقة — نعتمد على GET /categories العام فقط. */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res =
        registrationData != null
          ? await CategoriesService.getAllPublic({ limit: 50 })
          : (await TokenStorage.getAccess())
            ? await CategoriesService.getAll({ limit: 50 })
            : await CategoriesService.getAllPublic({ limit: 50 });
      setCategories(res.data ?? []);
    } catch (e) {
      setCategories([]);
      setLoadError(categoryLoadErrorMessage(e, t, t('providerSelectServices.loadFailed')));
    } finally {
      setLoading(false);
    }
  }, [registrationData, t]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const toggleService = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const toggleCategoryExpanded = (categoryId: number) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleContinue = async () => {
    if (selected.length === 0) {
      Alert.alert(t('common.error'), t('providerSelectServices.selectAtLeastOne'));
      return;
    }

    setSaving(true);
    try {
      if (registrationData) {
        const cityId = registrationData.cityId;
        const payload = registrationData.accountType === 'INDIVIDUAL'
          ? {
              role: 'PROVIDER' as const,
              accountType: 'INDIVIDUAL' as const,
              fullName: registrationData.fullName ?? '',
              email: registrationData.email,
              phone: registrationData.phone,
              password: registrationData.password,
              nationalAddress: registrationData.nationalAddress ?? '',
              categoryIds: selected,
              ...(cityId != null ? { cityId } : {}),
            }
          : {
              role: 'PROVIDER' as const,
              accountType: 'COMPANY' as const,
              email: registrationData.email,
              phone: registrationData.phone,
              password: registrationData.password,
              commercialRegistrationNumber: registrationData.commercialRegistrationNumber ?? '',
              taxIdNumber: registrationData.taxIdNumber ?? '',
              commercialName: registrationData.commercialName ?? '',
              nationalAddress: registrationData.nationalAddress ?? '',
              categoryIds: selected,
              ...(cityId != null ? { cityId } : {}),
            };

        devLog('providerRegister.beforeApi', {
          categoryIds: selected,
          accountType: registrationData.accountType,
          email: registrationData.email,
          phone: registrationData.phone,
          fullName: registrationData.fullName,
          commercialName: registrationData.commercialName,
        });
        await AuthService.register(payload);

        await AuthService.signIn(registrationData.email, registrationData.password);
        devLog('providerRegister.afterSignIn', { note: 'تحقق من لوجات profile.getProfile و auth.context.loadUser' });
      } else {
        const savedToken = await TokenStorage.getAccess();
        if (savedToken) {
          await ProfileService.updateProviderProfile({ categoryIds: selected });
        }
      }

      navigation.navigate('ProviderAccountSuccess');
    } catch (err: unknown) {
      Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StepIndicator current={3} total={3} rtl={rtl} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, rtl && styles.textRtl]}>{t('auth.createAccountTitle')}</Text>
        <Text style={[styles.subtitle, rtl && styles.textRtl]}>{t('auth.createAccountSubtitle')}</Text>
        <Text style={[styles.sectionTitle, rtl && styles.textRtl]}>{t('providerSelectServices.chooseService')}</Text>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : loadError ? (
          <View style={styles.errorBox}>
            <Text style={[styles.errorText, rtl && styles.textRtl]}>{loadError}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => void fetchCategories()}>
              <Text style={styles.retryBtnText}>{t('providerSelectServices.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : categories.length === 0 ? (
          <Text style={[styles.emptyHint, rtl && styles.textRtl]}>{t('providerSelectServices.emptyList')}</Text>
        ) : (
          <View style={styles.sections}>
            {categories.map((parent, pIdx) => {
              const items = getSelectableServiceItems(parent);
              const expanded = expandedCategoryId === parent.id;
              const parentTitle = categoryDisplayName(parent, preferAr);
              const parentIcon = FALLBACK_ICONS[pIdx % FALLBACK_ICONS.length];
              const selectedInSection = items.filter((it) => selected.includes(it.id)).length;

              return (
                <View key={parent.id} style={styles.sectionCard}>
                  <TouchableOpacity
                    style={[styles.categoryHeader, expanded && styles.categoryHeaderExpanded]}
                    onPress={() => toggleCategoryExpanded(parent.id)}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    accessibilityLabel={parentTitle}
                  >
                    <View style={[styles.categoryHeaderRow, rtl && styles.categoryHeaderRowRtl]}>
                      <View style={[styles.categoryHeaderIconWrap, expanded && styles.categoryHeaderIconWrapActive]}>
                        {parent.image ? (
                          <Image source={{ uri: parent.image }} style={styles.categoryHeaderIcon} resizeMode="contain" />
                        ) : (
                          <Image source={parentIcon} style={styles.categoryHeaderIcon} resizeMode="contain" />
                        )}
                      </View>
                      <View style={styles.categoryHeaderTextBlock}>
                        <Text style={[styles.categoryHeaderTitle, rtl && styles.textRtl]} numberOfLines={2}>
                          {parentTitle}
                        </Text>
                        <Text style={[styles.categoryHeaderMeta, rtl && styles.textRtl]}>
                          {t('providerSelectServices.itemsCount', { count: items.length })}
                          {selectedInSection > 0 ? ` · ${t('providerSelectServices.selectedCount', { count: selectedInSection })}` : ''}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-down"
                        size={22}
                        color="#1E2239"
                        style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
                      />
                    </View>
                  </TouchableOpacity>

                  {expanded ? (
                    <View style={styles.expandedPanel}>
                      <Text style={[styles.expandedHint, rtl && styles.textRtl]}>
                        {t('providerSelectServices.tapToSelectServices')}
                      </Text>
                      <View style={styles.subGrid}>
                        {items.map((sub, sIdx) => {
                          const isActive = selected.includes(sub.id);
                          const icon = FALLBACK_ICONS[(pIdx * 4 + sIdx) % FALLBACK_ICONS.length];
                          const label = categoryDisplayName(sub, preferAr);
                          return (
                            <TouchableOpacity
                              key={`${parent.id}-${sub.id}`}
                              style={[styles.serviceCard, isActive && styles.serviceCardActive]}
                              onPress={() => toggleService(sub.id)}
                              activeOpacity={0.8}
                            >
                              {sub.image ? (
                                <Image source={{ uri: sub.image }} style={styles.serviceIcon} resizeMode="contain" />
                              ) : (
                                <Image source={icon} style={styles.serviceIcon} resizeMode="contain" />
                              )}
                              <Text style={[styles.serviceLabel, isActive && styles.serviceLabelActive, rtl && styles.textRtl]} numberOfLines={2}>
                                {label}
                              </Text>
                              {isActive ? (
                                <View style={[styles.selectedBadge, rtl ? styles.selectedBadgeRtl : styles.selectedBadgeLtr]}>
                                  <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                                </View>
                              ) : null}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {saving ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <Button title={t('auth.createAccountButton')} onPress={handleContinue} style={styles.btn} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontSize: 26, fontFamily: FontFamily.outfit.bold, color: '#1E2239', marginBottom: 6, textAlign: 'left' },
  subtitle: { fontSize: 13, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1', marginBottom: 24, textAlign: 'left' },
  sectionTitle: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#1E2239', marginBottom: 16, textAlign: 'left' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  sections: { gap: 12 },
  sectionCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EAEF',
    overflow: 'hidden',
    shadowColor: '#1E2239',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FBFBFD',
  },
  categoryHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAEF',
    backgroundColor: '#F5F7FA',
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryHeaderRowRtl: { flexDirection: 'row-reverse' },
  categoryHeaderIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8EAEF',
  },
  categoryHeaderIconWrapActive: {
    borderColor: Colors.primary,
    backgroundColor: '#E8F5F4',
  },
  categoryHeaderIcon: { width: 28, height: 28 },
  categoryHeaderTextBlock: { flex: 1, minWidth: 0 },
  categoryHeaderTitle: {
    fontSize: 16,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1E2239',
    textAlign: 'left',
  },
  categoryHeaderMeta: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: FontFamily.outfit.regular,
    color: '#A7AEC1',
    textAlign: 'left',
  },
  expandedPanel: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  expandedHint: {
    fontSize: 12,
    fontFamily: FontFamily.outfit.medium,
    color: '#666876',
    marginBottom: 12,
    textAlign: 'left',
  },
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-start' },
  serviceCard: {
    width: '31%',
    flexGrow: 1,
    maxWidth: 118,
    minHeight: 108,
    borderRadius: 14,
    backgroundColor: '#F5F6FA',
    borderWidth: 1.5,
    borderColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 6,
    position: 'relative',
  },
  serviceCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FAF9',
  },
  selectedBadge: { position: 'absolute', top: 6 },
  selectedBadgeLtr: { right: 6 },
  selectedBadgeRtl: { left: 6 },
  serviceIcon: { width: 40, height: 40 },
  serviceLabel: { fontSize: 12, fontFamily: FontFamily.outfit.medium, color: '#1E2239', textAlign: 'center' },
  serviceLabelActive: { color: Colors.primary, fontFamily: FontFamily.outfit.semiBold },
  footer: { paddingHorizontal: 24, paddingBottom: 12, paddingTop: 8, backgroundColor: '#FFFFFF' },
  btn: { height: 54, borderRadius: 14, backgroundColor: Colors.primary },
  errorBox: { marginTop: 24, padding: 16, borderRadius: 12, backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: '#FDE2E2' },
  errorText: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#B42318', textAlign: 'left' },
  retryBtn: { marginTop: 14, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, backgroundColor: Colors.primary },
  retryBtnText: { fontSize: 14, fontFamily: FontFamily.outfit.semiBold, color: '#FFFFFF' },
  emptyHint: { marginTop: 24, fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1', textAlign: 'left' },
});
