import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type SlideDef = {
  id: string;
  image: number;
};

const slideDefs: SlideDef[] = [
  { id: '1', image: require('../../assets/images/onboarding1.png') },
  { id: '2', image: require('../../assets/images/onboarding2.png') },
  { id: '3', image: require('../../assets/images/onboarding3.png') },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideDef>>(null);

  const slides = useMemo(
    () =>
      slideDefs.map((s, i) => ({
        ...s,
        title:
          i === 0
            ? t('onboarding.slide1Title')
            : i === 1
              ? t('onboarding.slide2Title')
              : t('onboarding.slide3Title'),
        description:
          i === 0
            ? t('onboarding.slide1Description')
            : i === 1
              ? t('onboarding.slide2Description')
              : t('onboarding.slide3Description'),
      })),
    [t],
  );

  const onScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    setCurrentIndex(clamped);
  }, [slides.length]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    } else {
      navigation.replace('ChooseAccount' as any);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.imageArea}>
        {/**
         * حاوية LTR إجبارية: في وضع RTL يعكس FlatList الأفقي اتجاه الـ scroll وoffset فيختلط الفهرس مع «التالي».
         */}
        <View style={styles.carouselLtr}>
          <FlatList
            ref={flatListRef}
            data={slides}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onMomentumScrollEnd={onScrollEnd}
            onScrollToIndexFailed={({ index }) => {
              setTimeout(() => {
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }, 100);
            }}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image source={item.image} style={styles.slideImage} resizeMode="cover" />
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>{slides[currentIndex].title}</Text>
        <Text style={styles.description}>{slides[currentIndex].description}</Text>

        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>

        <Button
          title={currentIndex === slides.length - 1 ? t('onboarding.getStarted') : t('common.next')}
          onPress={handleNext}
          style={styles.nextBtn}
          textStyle={styles.nextBtnText}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.loginText}>{t('onboarding.alreadyHaveAccount')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageArea: {
    height: height * 0.47,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: '#167B78',
  },
  carouselLtr: {
    flex: 1,
    width: '100%',
    direction: 'ltr',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  slideImage: {
    width: width * 0.9,
    height: height * 0.53,
    borderRadius: 22,
    transform: [{ translateY: -58 }],
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  title: {
    fontSize: 17,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.textDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: FontFamily.outfit.regular,
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 10,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    height: 9,
    borderRadius: 5,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 9,
    backgroundColor: Colors.border,
  },
  nextBtn: {
    marginBottom: 14,
    height: 58,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  nextBtnText: {
    fontSize: FontSize.xl,
    fontFamily: FontFamily.outfit.medium,
    color: Colors.white,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 15,
    fontFamily: FontFamily.outfit.semiBold,
    color: Colors.primary,
  },
});
