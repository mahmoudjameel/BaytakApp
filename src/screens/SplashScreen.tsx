import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const { isAuthenticated, isLoading, user } = useAuth();

  // Refs so timers always read the latest values
  const isAuthRef = useRef(isAuthenticated);
  const userRoleRef = useRef(user?.role);
  const isLoadingRef = useRef(isLoading);
  const navigated = useRef(false);

  useEffect(() => { isAuthRef.current = isAuthenticated; }, [isAuthenticated]);
  useEffect(() => { userRoleRef.current = user?.role; }, [user]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

  const doNavigate = () => {
    if (navigated.current) return;
    navigated.current = true;
    if (isAuthRef.current && userRoleRef.current) {
      navigation.replace(userRoleRef.current === 'PROVIDER' ? 'ProviderMain' : 'Main');
    } else {
      navigation.replace('Onboarding');
    }
  };

  const [animDone, setAnimDone] = useState(false);

  // Splash animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1300,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    const animTimer = setTimeout(() => setAnimDone(true), 2000);
    // Safety valve: always navigate after 5s maximum
    const maxTimer = setTimeout(() => doNavigate(), 5000);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(maxTimer);
    };
  // doNavigate intentionally excluded — uses refs internally
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate as soon as both animation AND auth are done
  useEffect(() => {
    if (animDone && !isLoading) {
      doNavigate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animDone, isLoading]);

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
