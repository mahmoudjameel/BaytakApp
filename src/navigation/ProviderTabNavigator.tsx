import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProviderHomeScreen } from '../screens/provider/ProviderHomeScreen';
import { ProviderPerformanceScreen } from '../screens/provider/ProviderPerformanceScreen';
import { ProviderOrderScreen } from '../screens/provider/ProviderOrderScreen';
import { ProviderWalletScreen } from '../screens/provider/ProviderWalletScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { isRTL } from '../utils/rtl';
import { RootStackParamList } from './AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const Tab = createBottomTabNavigator();

type TabIconProps = {
  focused: boolean;
  iconName: keyof typeof Ionicons.glyphMap;
  focusedIcon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const TabIcon = ({ focused, iconName, focusedIcon, label }: TabIconProps) => (
  <View style={tabStyles.item}>
    <Ionicons
      name={focused ? focusedIcon : iconName}
      size={22}
      color={focused ? Colors.primary : '#9AA0AE'}
    />
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
  </View>
);

const AddButton = () => {
  const navigation = useNavigation<Nav>();
  return (
    <TouchableOpacity
      style={tabStyles.fabWrapper}
      onPress={() => navigation.navigate('AddNewService')}
      activeOpacity={0.85}
    >
      <View style={tabStyles.fab}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </View>
      <Text style={tabStyles.fabLabel}>Add</Text>
    </TouchableOpacity>
  );
};

export const ProviderTabNavigator = () => {
  const rtl = isRTL();

  const tabs = [
    {
      name: 'ProviderHome',
      component: ProviderHomeScreen,
      icon: 'home-outline' as const,
      focusedIcon: 'home' as const,
      label: 'Home',
    },
    {
      name: 'ProviderPerformance',
      component: ProviderPerformanceScreen,
      icon: 'trending-up-outline' as const,
      focusedIcon: 'trending-up' as const,
      label: 'Performance',
    },
    {
      name: 'ProviderAdd',
      component: ProviderHomeScreen,
      icon: 'add' as const,
      focusedIcon: 'add' as const,
      label: 'Add',
      isAdd: true,
    },
    {
      name: 'ProviderOrders',
      component: ProviderOrderScreen,
      icon: 'cart-outline' as const,
      focusedIcon: 'cart' as const,
      label: 'order',
    },
    {
      name: 'ProviderWallet',
      component: ProviderWalletScreen,
      icon: 'wallet-outline' as const,
      focusedIcon: 'wallet' as const,
      label: 'Walet',
    },
  ] as const;

  const orderedTabs = rtl ? [...tabs].reverse() : tabs;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabStyles.tabBar,
      }}
    >
      {orderedTabs.map((tab) => {
        if (tab.name === 'ProviderAdd') {
          return (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              component={tab.component}
              options={{
                tabBarButton: () => <AddButton />,
              }}
            />
          );
        }

        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  focused={focused}
                  iconName={tab.icon}
                  focusedIcon={tab.focusedIcon}
                  label={tab.label}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
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
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: FontFamily.outfit.medium,
    color: '#9AA0AE',
  },
  labelActive: {
    color: Colors.primary,
    fontFamily: FontFamily.outfit.semiBold,
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    gap: 4,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabLabel: {
    fontSize: 10,
    fontFamily: FontFamily.outfit.medium,
    color: '#9AA0AE',
  },
});
