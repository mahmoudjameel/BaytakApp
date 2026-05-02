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
import { FavouritesScreen } from '../screens/FavouritesScreen';
import { InvoiceScreen } from '../screens/InvoiceScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { CartAddAddressScreen } from '../screens/CartAddAddressScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { AddPaymentScreen } from '../screens/AddPaymentScreen';
import { ContractSuccessScreen } from '../screens/ContractSuccessScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { TabNavigator } from './TabNavigator';
import { ProviderTabNavigator } from './ProviderTabNavigator';

import { ProviderSelectServicesScreen } from '../screens/provider/ProviderSelectServicesScreen';
import { ProviderAccountSuccessScreen } from '../screens/provider/ProviderAccountSuccessScreen';
import { ProviderPerformanceScreen } from '../screens/provider/ProviderPerformanceScreen';
import { ProviderOrderScreen } from '../screens/provider/ProviderOrderScreen';
import { ProviderTimeScreen } from '../screens/provider/ProviderTimeScreen';
import { ProviderWalletScreen } from '../screens/provider/ProviderWalletScreen';
import { AddNewServiceScreen } from '../screens/provider/AddNewServiceScreen';
import { TeamsScreen } from '../screens/provider/TeamsScreen';
import { ProviderProfileScreen } from '../screens/provider/ProviderProfileScreen';

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
  Favourites: undefined;
  Invoice: undefined;
  Wallet: undefined;
  CartAddAddress: undefined;
  Checkout: undefined;
  AddPayment: undefined;
  ContractSuccess: undefined;
  HelpCenter: undefined;
  Notifications: undefined;
  LanguageSettings: undefined;
  Main: undefined;
  ProviderSelectServices: { accountType?: 'provider' | 'company' } | undefined;
  ProviderAccountSuccess: undefined;
  ProviderMain: undefined;
  ProviderPerformance: undefined;
  ProviderOrders: undefined;
  ProviderTime: undefined;
  ProviderWallet: undefined;
  AddNewService: undefined;
  Teams: undefined;
  ProviderProfile: undefined;
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
        <Stack.Screen name="Favourites" component={FavouritesScreen} />
        <Stack.Screen name="Invoice" component={InvoiceScreen} />
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="CartAddAddress" component={CartAddAddressScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
        <Stack.Screen name="ContractSuccess" component={ContractSuccessScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="LanguageSettings" component={LanguageScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />

        <Stack.Screen name="ProviderSelectServices" component={ProviderSelectServicesScreen} />
        <Stack.Screen name="ProviderAccountSuccess" component={ProviderAccountSuccessScreen} />
        <Stack.Screen name="ProviderMain" component={ProviderTabNavigator} />
        <Stack.Screen name="ProviderPerformance" component={ProviderPerformanceScreen} />
        <Stack.Screen name="ProviderOrders" component={ProviderOrderScreen} />
        <Stack.Screen name="ProviderTime" component={ProviderTimeScreen} />
        <Stack.Screen name="ProviderWallet" component={ProviderWalletScreen} />
        <Stack.Screen name="AddNewService" component={AddNewServiceScreen} />
        <Stack.Screen name="Teams" component={TeamsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
