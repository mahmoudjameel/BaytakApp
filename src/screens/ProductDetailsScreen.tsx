import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontFamily } from '../theme/typography';
import { Colors } from '../theme/colors';
import { backChevronIcon, isRTL } from '../utils/rtl';
import { ProductsService, ProductReview } from '../services/products.service';
import { toErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
];

type SimilarItem = { id: string; name: string; price: string; image: string; rating: number };

export const ProductDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { name, price, image, rating, productId } = route.params;
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const rtl = isRTL();
  const [mainIndex, setMainIndex] = useState(0);
  const heroRef = useRef<FlatList>(null);

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const gallery = useMemo(() => [image, ...EXTRA_IMAGES].slice(0, 4), [image]);

  const onHeroScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / width);
      if (idx >= 0 && idx < gallery.length) setMainIndex(idx);
    },
    [gallery.length, width],
  );

  useEffect(() => {
    if (!productId) return;
    setLoadingReviews(true);
    ProductsService.getReviews(productId)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setReviews(list);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoadingReviews(false));
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!productId) return;
    setSubmittingReview(true);
    try {
      const created = await ProductsService.createReview(productId, reviewRating, reviewComment.trim() || undefined);
      setReviews((prev) => [created, ...prev]);
      setReviewModal(false);
      setReviewComment('');
      setReviewRating(5);
    } catch (err: unknown) {
      Alert.alert(t('common.error'), toErrorMessage(err, t('common.somethingWentWrong')));
    } finally {
      setSubmittingReview(false);
    }
  };

  const similar: SimilarItem[] = useMemo(
    () => [
      { id: 's1', name: t('home.dealName'), price: t('allProducts.price180'), image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80', rating: 4 },
      { id: 's2', name: t('allProducts.productStove'), price: t('allProducts.price180'), image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80', rating: 4 },
    ],
    [t],
  );

  const gap = 12;
  const pad = 16;
  const simCardW = (width - pad * 2 - gap) / 2;
  const thumbCardWidth = Math.min(width - 40, gallery.length * 52 + (gallery.length - 1) * 8 + 16);

  const renderStars = useCallback(
    (r: number, size: number, interactive = false) =>
      [1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          disabled={!interactive}
          onPress={() => interactive && setReviewRating(i)}
          hitSlop={4}
        >
          <Ionicons name={i <= r ? 'star' : 'star-outline'} size={size} color="#F6B100" />
        </TouchableOpacity>
      )),
    [],
  );

  const renderSimilar = useCallback(
    (item: SimilarItem) => (
      <TouchableOpacity
        key={item.id}
        style={[styles.simCard, { width: simCardW }]}
        activeOpacity={0.85}
        onPress={() => navigation.replace('ProductDetails', { name: item.name, price: item.price, image: item.image, rating: item.rating })}
      >
        <Image source={{ uri: item.image }} style={styles.simImage} />
        <View style={[styles.simBody, rtl && styles.simBodyRtl]}>
          <Text style={[styles.simTitle, rtl && styles.textRtl]} numberOfLines={1}>{item.name}</Text>
          <View style={styles.simStars}>{renderStars(item.rating, 11)}</View>
          <View style={styles.simPriceRow}>
            <Text style={[styles.simPrice, rtl && styles.textRtl]}>{item.price}</Text>
            <View style={styles.simCart} pointerEvents="none">
              <Image source={require('../../assets/shopping-bag.png')} style={styles.simCartIcon} resizeMode="contain" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation, renderStars, rtl, simCardW],
  );

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}>
        <View style={styles.heroWrap}>
          <FlatList
            ref={heroRef}
            data={gallery}
            keyExtractor={(_, i) => `g-${i}`}
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onHeroScroll}
            renderItem={({ item }) => (
              <View style={[styles.heroImageWrap, { width }]}>
                <Image source={{ uri: item }} style={styles.heroImage} resizeMode="contain" />
              </View>
            )}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            onScrollToIndexFailed={({ index }) => { setTimeout(() => heroRef.current?.scrollToIndex({ index, animated: true }), 100); }}
          />
          <SafeAreaView edges={['top']} style={styles.heroSafe}>
            <TouchableOpacity style={[styles.backBtn, rtl && styles.backBtnRtl]} onPress={() => navigation.goBack()} hitSlop={12}>
              <Ionicons name={backChevronIcon()} size={24} color="#1B1D36" />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.thumbDock}>
            <View style={[styles.thumbCard, { width: thumbCardWidth }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
                {gallery.map((uri, i) => (
                  <TouchableOpacity key={`thumb-${i}`} onPress={() => { setMainIndex(i); heroRef.current?.scrollToIndex({ index: i, animated: true }); }} activeOpacity={0.85}>
                    <Image source={{ uri }} style={[styles.thumb, mainIndex === i && styles.thumbActive]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.titlePriceRow}>
            <Text style={[styles.productTitle, rtl && styles.textRtl]} numberOfLines={2}>{name}</Text>
            <Text style={[styles.productPrice, rtl && styles.textRtl]}>{price}</Text>
          </View>
          <View style={styles.ratingSummaryRow}>
            <View style={styles.starRow}>{renderStars(rating, 14)}</View>
            <Text style={[styles.ratingSummaryText, rtl && styles.textRtl]}>{t('productDetail.ratingSummary')}</Text>
          </View>
          <Text style={[styles.description, rtl && styles.textRtl]}>{t('productDetail.description')}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.readMore, rtl && styles.textRtl]}>{t('productDetail.readMore')}</Text>
          </TouchableOpacity>

          <View style={[styles.reviewsHeader, rtl && styles.rowRtl]}>
            <Text style={[styles.reviewsHeading, rtl && styles.textRtl]}>{t('productDetail.reviewsHeading')}</Text>
            {productId != null && (
              <TouchableOpacity style={styles.writeReviewBtn} onPress={() => setReviewModal(true)}>
                <Ionicons name="pencil" size={14} color={Colors.primary} />
                <Text style={styles.writeReviewText}>{t('productDetail.writeReview')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {loadingReviews ? (
            <ActivityIndicator color={Colors.primary} style={{ marginVertical: 16 }} />
          ) : reviews.length === 0 ? (
            <Text style={[styles.noReviews, rtl && styles.textRtl]}>{t('productDetail.noReviews')}</Text>
          ) : (
            reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewItem}>
                <View style={styles.reviewAvatar}>
                  <Ionicons name="person" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.reviewContent}>
                  <View style={styles.reviewTop}>
                    <View style={rtl ? styles.reviewNameBlockRtl : styles.reviewNameBlock}>
                      <Text style={[styles.reviewName, rtl && styles.textRtl]}>{rev.reviewer?.fullName ?? t('productDetail.reviewerName')}</Text>
                      <Text style={[styles.reviewDate, rtl && styles.textRtl]}>{new Date(rev.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.reviewStars}>{renderStars(rev.rating, 12)}</View>
                  </View>
                  {rev.comment ? <Text style={[styles.reviewBody, rtl && styles.textRtl]}>{rev.comment}</Text> : null}
                </View>
              </View>
            ))
          )}

          <Text style={[styles.similarHeading, rtl && styles.textRtl]}>{t('productDetail.similarProducts')}</Text>
          <View style={styles.similarRow}>{similar.map((s) => renderSimilar(s))}</View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { bottom: Math.max(insets.bottom, 10) }]}>
        <View style={styles.bottomBarInner}>
          <View style={styles.barLabelWrap}>
            <Text style={styles.barLabel}>{t('productDetail.addToCart')}</Text>
          </View>
          <View style={styles.barSep} />
          <Text style={[styles.barPrice, rtl && styles.barPriceRtl]}>{price}</Text>
        </View>
      </View>

      <Modal visible={reviewModal} transparent animationType="slide" onRequestClose={() => setReviewModal(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setReviewModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('productDetail.writeReview')}</Text>
            <TouchableOpacity onPress={() => setReviewModal(false)} hitSlop={12}>
              <Ionicons name="close" size={22} color="#1B1D36" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.starPickerRow}>{renderStars(reviewRating, 32, true)}</View>
            <TextInput
              value={reviewComment}
              onChangeText={setReviewComment}
              placeholder={t('productDetail.reviewCommentPlaceholder')}
              placeholderTextColor="#C5C8D1"
              multiline numberOfLines={4}
              style={styles.commentInput}
              textAlignVertical="top"
            />
            {submittingReview ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
            ) : (
              <TouchableOpacity style={styles.submitReviewBtn} onPress={handleSubmitReview} activeOpacity={0.88}>
                <Text style={styles.submitReviewText}>{t('common.submit')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 8 },
  heroWrap: { position: 'relative', backgroundColor: '#FFFFFF' },
  heroImageWrap: { height: 338, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  heroImage: { width: '100%', height: '100%', backgroundColor: '#F3F4F6' },
  heroSafe: { position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: { paddingHorizontal: 16, paddingTop: 10, alignSelf: 'flex-start' },
  backBtnRtl: { alignSelf: 'flex-end' },
  thumbDock: { position: 'absolute', left: 0, right: 0, bottom: -20, alignItems: 'center' },
  thumbCard: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  thumbRow: { flexDirection: 'row', gap: 8, alignItems: 'center', minWidth: '100%', justifyContent: 'center' },
  thumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: '#EEE' },
  thumbActive: { borderWidth: 1.5, borderColor: Colors.primary },
  section: { paddingHorizontal: 16, paddingTop: 36 },
  titlePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, width: '100%' },
  productTitle: { flex: 1, fontSize: 20, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark, textAlign: 'left' },
  productPrice: { fontSize: 18, fontFamily: FontFamily.outfit.bold, color: Colors.textDark, flexShrink: 0 },
  ratingSummaryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8, width: '100%' },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingSummaryText: { fontSize: 14, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  description: { marginTop: 12, fontSize: 13, lineHeight: 20, fontFamily: FontFamily.outfit.regular, color: Colors.textGray, textAlign: 'left' },
  readMore: { marginTop: 6, fontSize: 13, fontFamily: FontFamily.outfit.semiBold, color: Colors.primary, textAlign: 'left' },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  rowRtl: { flexDirection: 'row-reverse' },
  reviewsHeading: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark, textAlign: 'left' },
  writeReviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EDF7F6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  writeReviewText: { fontSize: 13, fontFamily: FontFamily.outfit.medium, color: Colors.primary },
  noReviews: { fontSize: 13, color: Colors.textGray, fontFamily: FontFamily.outfit.regular, marginTop: 10, textAlign: 'left' },
  reviewItem: { flexDirection: 'row', marginTop: 14, gap: 10, alignItems: 'flex-start', width: '100%' },
  reviewAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reviewContent: { flex: 1, minWidth: 0 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' },
  reviewNameBlock: { alignItems: 'flex-start', flex: 1, minWidth: 0, marginEnd: 8 },
  reviewNameBlockRtl: { alignItems: 'flex-end' },
  reviewName: { fontSize: 14, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  reviewDate: { fontSize: 11, fontFamily: FontFamily.outfit.regular, color: Colors.textLight, marginTop: 2 },
  reviewStars: { flexDirection: 'row', gap: 1, flexShrink: 0 },
  reviewBody: { marginTop: 6, fontSize: 12, lineHeight: 18, fontFamily: FontFamily.outfit.regular, color: Colors.textGray, textAlign: 'left' },
  similarHeading: { marginTop: 20, fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark, textAlign: 'left' },
  similarRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 12, gap: 12, width: '100%' },
  simCard: { borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EDEFF3', overflow: 'hidden', marginBottom: 4 },
  simImage: { width: '100%', aspectRatio: 1, backgroundColor: '#F3F4F6' },
  simBody: { padding: 10, gap: 4 },
  simBodyRtl: { alignItems: 'stretch' },
  simTitle: { fontSize: 12, fontFamily: FontFamily.outfit.semiBold, color: Colors.textDark },
  simStars: { flexDirection: 'row', gap: 2 },
  simPriceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, width: '100%' },
  simPrice: { fontSize: 13, fontFamily: FontFamily.outfit.bold, color: Colors.textDark, flex: 1, minWidth: 0 },
  simCart: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  simCartIcon: { width: 20, height: 20 },
  textRtl: { textAlign: 'right', writingDirection: 'rtl' },
  bottomBar: { position: 'absolute', left: 16, right: 16, backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14 },
  bottomBarInner: { flexDirection: 'row', alignItems: 'center', minHeight: 48, width: '100%' },
  barLabelWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  barLabel: { fontSize: 17, fontFamily: FontFamily.outfit.semiBold, color: '#FFFFFF' },
  barSep: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.45)', marginHorizontal: 12 },
  barPrice: { fontSize: 17, fontFamily: FontFamily.outfit.bold, color: '#FFFFFF', minWidth: 72, textAlign: 'right' },
  barPriceRtl: { textAlign: 'left' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalTitle: { fontSize: 16, fontFamily: FontFamily.outfit.semiBold, color: '#1B1D36' },
  modalBody: { padding: 16, paddingBottom: 28 },
  starPickerRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 16 },
  commentInput: { borderWidth: 1, borderColor: '#E8EAF0', borderRadius: 12, padding: 12, fontSize: 14, fontFamily: FontFamily.outfit.regular, color: '#1E2239', minHeight: 100, backgroundColor: '#F8F9FB' },
  submitReviewBtn: { marginTop: 16, height: 50, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  submitReviewText: { color: '#FFFFFF', fontSize: 16, fontFamily: FontFamily.outfit.semiBold },
});
