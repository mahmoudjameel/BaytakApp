import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ChooseAccountScreen } from '../screens/ChooseAccountScreen';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';
import { VerificationScreen } from '../screens/VerificationScreen';
import { AllCategoriesScreen } from '../screens/AllCategoriesScreen';
import { AllProductsScreen } from '../screens/AllProductsScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { NearbyServiceDetailsScreen } from '../screens/NearbyServiceDetailsScreen';
import { AddAddressScreen } from '../screens/AddAddressScreen';
import { MakeAppointmentScreen } from '../screens/MakeAppointmentScreen';
import { OfferScreen } from '../screens/OfferScreen';
import { TabNavigator } from './TabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  ChooseAccount: undefined;
  CreateAccount: {
    accountType?: 'provider' | 'company' | 'individual';
  } | undefined;
  Verification: undefined;
  AllCategories: undefined;
  AllProducts: undefined;
  ProductDetails: {
    name: string;
    price: string;
    image: string;
    rating: number;
  };
  AddAddress: undefined;
  Offer: undefined;
  MakeAppointment: {
    serviceName: string;
    serviceImage: string;
  };
  NearbyServiceDetails: {
    name: string;
    rating: string;
    distance: string;
    priceMain: string;
    priceUnit: string;
    image: string;
  };
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChooseAccount" component={ChooseAccountScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="AllCategories" component={AllCategoriesScreen} />
        <Stack.Screen name="AllProducts" component={AllProductsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
        <Stack.Screen name="Offer" component={OfferScreen} />
        <Stack.Screen name="MakeAppointment" component={MakeAppointmentScreen} />
        <Stack.Screen name="NearbyServiceDetails" component={NearbyServiceDetailsScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
