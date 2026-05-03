import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import type { City } from '../services/cities.service';
import { isRTL } from '../utils/rtl';

type Props = {
  label: string;
  placeholder: string;
  cities: City[];
  selectedId: number | null;
  onSelect: (city: City) => void;
  loading?: boolean;
  disabled?: boolean;
};

export const CityPicker: React.FC<Props> = ({
  label,
  placeholder,
  cities,
  selectedId,
  onSelect,
  loading,
  disabled,
}) => {
  const { i18n, t } = useTranslation();
  const rtl = isRTL();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => cities.find((c) => c.id === selectedId), [cities, selectedId]);

  const displayName = (c: City) => {
    const ar = i18n.language?.startsWith('ar');
    return ar ? c.nameAr : c.nameEn;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.nameEn.toLowerCase().includes(q) ||
        c.nameAr.includes(query.trim()) ||
        (c.region?.toLowerCase().includes(q) ?? false),
    );
  }, [cities, query]);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, rtl && styles.labelRtl]}>{label}</Text>
      <TouchableOpacity
        style={[styles.field, disabled && styles.fieldDisabled]}
        onPress={() => !disabled && !loading && setOpen(true)}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : (
          <>
            <Text
              style={[styles.fieldText, !selected && styles.placeholder, rtl && styles.fieldTextRtl]}
              numberOfLines={1}
            >
              {selected ? displayName(selected) : placeholder}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A7AEC1" />
          </>
        )}
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setOpen(false)} />
          <View style={[styles.sheet, rtl && styles.sheetRtl]}>
            <View style={[styles.sheetHeader, rtl && styles.rowReverse]}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={12}>
                <Ionicons name="close" size={26} color="#1E2239" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.search, rtl && styles.searchRtl]}
              placeholder={placeholder}
              placeholderTextColor="#A7AEC1"
              value={query}
              onChangeText={setQuery}
            />
            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.row, selectedId === item.id && styles.rowActive]}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <Text style={[styles.rowText, rtl && styles.rowTextRtl]}>{displayName(item)}</Text>
                  {item.region ? (
                    <Text style={styles.region}>{item.region}</Text>
                  ) : null}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>{filtered.length === 0 ? t('common.noResults') : ''}</Text>
              }
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: FontFamily.outfit.semiBold,
    color: '#1B1D36',
    marginBottom: 8,
    width: '100%',
    textAlign: 'left',
  },
  labelRtl: { textAlign: 'right', writingDirection: 'rtl' },
  field: {
    minHeight: 52,
    borderRadius: 10,
    backgroundColor: '#F5F6FA',
    borderColor: '#F0F1F5',
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldDisabled: { opacity: 0.6 },
  fieldText: { flex: 1, fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#1E2239' },
  fieldTextRtl: { textAlign: 'right', writingDirection: 'rtl' },
  placeholder: { color: '#A7AEC1' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    maxHeight: '72%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  sheetRtl: {},
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F5',
  },
  rowReverse: { flexDirection: 'row-reverse' },
  sheetTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1E2239' },
  search: {
    marginTop: 10,
    marginBottom: 8,
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F5F6FA',
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: '#1E2239',
  },
  searchRtl: { textAlign: 'right', writingDirection: 'rtl' },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEF0F5',
  },
  rowActive: { backgroundColor: '#F0FAF8' },
  rowText: { fontSize: 15, fontFamily: FontFamily.outfit.medium, color: '#1E2239' },
  rowTextRtl: { textAlign: 'right', writingDirection: 'rtl' },
  region: { fontSize: 12, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1', marginTop: 2 },
  empty: { textAlign: 'center', padding: 24, color: '#A7AEC1' },
});
