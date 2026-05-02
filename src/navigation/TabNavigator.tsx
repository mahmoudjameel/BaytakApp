import React from 'react';
import { View, StyleSheet, Text, Image, ImageSourcePropType } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { HomeScreen } from '../screens/HomeScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { CartScreen } from '../screens/CartScreen';
import { ContractScreen } from '../screens/ContractScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Colors } from '../theme/colors';
import { FontFamily, FontSize } from '../theme/typography';
import { isRTL } from '../utils/rtl';

const Tab = createBottomTabNavigator();

type TabIconProps = {
  focused: boolean;
  name?: keyof typeof Ionicons.glyphMap;
  source?: ImageSourcePropType;
  label: string;
  useTint?: boolean;
};

const TabIcon = ({ focused, name, source, label, useTint = true }: TabIconProps) => (
  <View style={styles.tabItem}>
    {source ? (
      <Image
        source={source}
        style={[styles.tabImageIcon, useTint && { tintColor: focused ? Colors.primary : Colors.textLight }]}
        resizeMode="contain"
      />
    ) : name ? (
      <Ionicons
        name={focused ? name : (name.replace('-outline', '') + '-outline') as keyof typeof Ionicons.glyphMap}
        size={24}
        color={focused ? Colors.primary : Colors.textLight}
      />
    ) : null}
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

export const TabNavigator = () => {
  const { t } = useTranslation();
  const rtl = isRTL();

  const tabScreens = [
    {
      name: 'Home',
      component: HomeScreen,
      renderIcon: (focused: boolean) => (
        <TabIcon focused={focused} source={require('../../assets/home.png')} label={t('tabs.home')} />
      ),
    },
    {
      name: 'Booking',
      component: BookingScreen,
      renderIcon: (focused: boolean) => (
        <TabIcon focused={focused} name="calendar-outline" label={t('tabs.booking')} />
      ),
    },
    {
      name: 'Cart',
      component: CartScreen,
      renderIcon: (focused: boolean) => (
        <TabIcon
          focused={focused}
          source={require('../../assets/cart.png')}
          label={t('tabs.cart')}
          useTint={false}
        />
      ),
    },
    {
      name: 'Contract',
      component: ContractScreen,
      renderIcon: (focused: boolean) => (
        <TabIcon focused={focused} source={require('../../assets/writing 1.png')} label={t('tabs.contract')} />
      ),
    },
    {
      name: 'MyProfile',
      component: ProfileScreen,
      renderIcon: (focused: boolean) => (
        <TabIcon focused={focused} source={require('../../assets/user.png')} label={t('tabs.profile')} />
      ),
    },
  ] as const;

  const orderedTabs = rtl ? [...tabScreens].reverse() : tabScreens;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      {orderedTabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: ({ focused }) => tab.renderIcon(focused),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabImageIcon: {
    width: 24,
    height: 24,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: FontFamily.outfit.medium,
    color: Colors.textLight,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: FontFamily.outfit.semiBold,
  },
});
