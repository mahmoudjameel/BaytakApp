import './src/i18n/i18n';
import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { bootstrapLanguage } from './src/i18n/bootstrap';
import { LanguageProvider } from './src/context/LanguageContext';
import { DirectionalRoot } from './src/components/DirectionalRoot';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

export default function App() {
  const [langReady, setLangReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    bootstrapLanguage().then(() => setLangReady(true));
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' && (fontsLoaded || fontError) && langReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, langReady]);

  if (Platform.OS !== 'web' && ((!fontsLoaded && !fontError) || !langReady)) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <SafeAreaProvider>
        <LanguageProvider>
          <DirectionalRoot>
            <AppNavigator />
          </DirectionalRoot>
        </LanguageProvider>
      </SafeAreaProvider>
    </View>
  );
}
