import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const { isAuthenticated, isLoading, user } = useAuth();
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const timer = setTimeout(() => setAnimDone(true), 2000);
    return () => clearTimeout(timer);
  }, [spinValue]);

  useEffect(() => {
    if (!animDone || isLoading) return;

    if (isAuthenticated && user) {
      navigation.replace(user.role === 'PROVIDER' ? 'ProviderMain' : 'Main');
    } else {
      navigation.replace('Onboarding');
    }
  }, [animDone, isLoading, isAuthenticated, user, navigation]);

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
