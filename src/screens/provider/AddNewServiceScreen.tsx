import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { backChevronIcon, isRTL } from '../../utils/rtl';
import { ProductsService } from '../../services/products.service';
import { CategoriesService, Category, categoryDisplayName } from '../../services/categories.service';
import { toErrorMessage } from '../../utils/errors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const AddNewServiceScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { t, i18n } = useTranslation();
  const rtl = isRTL();
  const preferAr = i18n.language?.startsWith('ar') ?? true;

  const [serviceTitle, setServiceTitle] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [catModalVisible, setCatModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    CategoriesService.getAll({ limit: 50 })
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, []);

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const handleSubmit = async () => {
    if (!serviceTitle.trim()) {
      Alert.alert(t('common.error'), t('addNewService.titleRequired'));
      return;
    }
    const parsedPrice = parseFloat(price);
    if (!price || isNaN(parsedPrice)) {
      Alert.alert(t('common.error'), t('addNewService.priceRequired'));
      return;
    }
    if (!selectedCategory) {
      Alert.alert(t('common.error'), t('addNewService.categoryRequired'));
      return;
    }

    setSubmitting(true);
    try {
      const files = imageUri
        ? [{ uri: imageUri, name: 'service.jpg', type: 'image/jpeg' }]
        : undefined;
      await ProductsService.create(
        {
          title: serviceTitle.trim(),
          price: parsedPrice,
          categoryId: selectedCategory.id,
        },
        files as any,
      );
      Alert.alert(t('common.success'), t('addNewService.saveSuccess'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: unknown) {
      Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={[styles.header, rtl && styles.headerRtl]}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name={backChevronIcon()} size={22} color="#1B1D36" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('providerHome.addNewService')}</Text>
          <View style={styles.iconBtn} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <InputField
            label={t('addNewService.serviceTitle')}
            placeholder={t('addNewService.serviceTitlePlaceholder')}
            value={serviceTitle}
            onChangeText={setServiceTitle}
            labelStyle={[styles.fieldLabel, rtl && styles.textRtl]}
            inputWrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
            placeholderColor="#A7AEC1"
            containerStyle={styles.fieldContainer}
          />

          <InputField
            label={t('addNewService.priceUponViewing')}
            placeholder={t('addNewService.enterPrice')}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            labelStyle={[styles.fieldLabel, rtl && styles.textRtl]}
            inputWrapperStyle={styles.fieldWrapper}
            inputStyle={styles.fieldInput}
            placeholderColor="#A7AEC1"
            containerStyle={styles.fieldContainer}
          />

          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addNewService.category')}</Text>
          <TouchableOpacity
            style={[styles.categorySelector, styles.fieldContainer]}
            onPress={() => setCatModalVisible(true)}
            activeOpacity={0.8}
          >
            {loadingCats ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <Text style={[styles.categorySelectorText, !selectedCategory && styles.placeholder, rtl && styles.textRtl]}>
                  {selectedCategory
                    ? categoryDisplayName(selectedCategory, preferAr)
                    : t('addNewService.categoryPlaceholder')}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#A7AEC1" />
              </>
            )}
          </TouchableOpacity>

          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('providerTime.title')}</Text>
          <TouchableOpacity
            style={[styles.timeSelector, styles.fieldContainer]}
            onPress={() => navigation.navigate('ProviderTime')}
            activeOpacity={0.8}
          >
            <Ionicons name="time-outline" size={18} color="#A7AEC1" />
            <Text style={styles.timePlaceholder}>{t('providerTime.selectTime')}</Text>
          </TouchableOpacity>

          <Text style={[styles.fieldLabel, rtl && styles.textRtl]}>{t('addNewService.imageUploadIcon')}</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadPreview} />
            ) : (
              <>
                <View style={styles.uploadIconCircle}>
                  <Ionicons name="arrow-up-circle-outline" size={32} color={Colors.primary} />
                </View>
                <Text style={styles.uploadText}>{t('addNewService.imageUpload')}</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          {submitting ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Button title={t('providerHome.addNewService')} onPress={handleSubmit} style={styles.submitBtn} />
          )}
        </View>

        <Modal visible={catModalVisible} transparent animationType="slide" onRequestClose={() => setCatModalVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCatModalVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('addNewService.selectCategory')}</Text>
              <TouchableOpacity onPress={() => setCatModalVisible(false)} hitSlop={12}>
                <Ionicons name="close" size={22} color="#1B1D36" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.modalList} showsVerticalScrollIndicator={false}>
              {categories.map((cat) => {
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => {
                      setSelectedCategory(cat);
                      setCatModalVisible(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                      {categoryDisplayName(cat, preferAr)}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 52, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerRtl: { flexDirection: 'row-reverse' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  scroll: { padding: 20, paddingBottom: 24 },
  fieldContainer: { marginBottom: 18 },
  fieldLabel: { fontSize: 15, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36', marginBottom: 8, textAlign: 'left' },
  fieldWrapper: { height: 52, borderRadius: 10, backgroundColor: '#F5F6FA', borderColor: '#F0F1F5', borderWidth: 1 },
  fieldInput: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#1E2239' },
  categorySelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    height: 52, borderRadius: 10, backgroundColor: '#F5F6FA', borderColor: '#F0F1F5',
    borderWidth: 1, paddingHorizontal: 14,
  },
  categorySelectorText: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#1E2239', flex: 1 },
  placeholder: { color: '#A7AEC1' },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  timeSelector: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 10, backgroundColor: '#F5F6FA', borderColor: '#F0F1F5', borderWidth: 1, paddingHorizontal: 14, gap: 10 },
  timePlaceholder: { fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#A7AEC1' },
  uploadBox: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 12, borderStyle: 'dashed', height: 120, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 18, overflow: 'hidden' },
  uploadPreview: { width: '100%', height: '100%', borderRadius: 10 },
  uploadIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EDF7F6', alignItems: 'center', justifyContent: 'center' },
  uploadText: { fontSize: 13, fontFamily: FontFamily.outfit.regular, color: '#9AA0AE' },
  footer: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 8 },
  submitBtn: { height: 54, borderRadius: 14, backgroundColor: Colors.primary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  modalList: { padding: 16, gap: 4 },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10 },
  modalItemSelected: { backgroundColor: '#EDF7F6' },
  modalItemText: { fontSize: 15, fontFamily: FontFamily.outfit.regular, color: '#1B1D36' },
  modalItemTextSelected: { fontFamily: FontFamily.outfit.semiBold, color: Colors.primary },
});
