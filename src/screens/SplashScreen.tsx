import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding' as any);
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.loaderWrap}>
        <Animated.View style={[styles.loaderArc, { transform: [{ rotate: spin }] }]} />
        <View style={styles.loaderCore} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loaderWrap: {
    width: 62,
    height: 62,
    marginBottom: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderArc: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 9,
    borderColor: 'rgba(255,255,255,0.42)',
    borderTopColor: 'rgba(255,255,255,0.08)',
    borderRightColor: 'rgba(255,255,255,0.08)',
  },
  loaderCore: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: Colors.primary,
  },
});
