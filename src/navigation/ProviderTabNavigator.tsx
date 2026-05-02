import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ProviderHomeScreen } from '../screens/provider/ProviderHomeScreen';
import { ProviderPerformanceScreen } from '../screens/provider/ProviderPerformanceScreen';
import { ProviderOrderScreen } from '../screens/provider/ProviderOrderScreen';
import { ProviderProfileScreen } from '../screens/provider/ProviderProfileScreen';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { isRTL } from '../utils/rtl';
import { RootStackParamList } from './AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const Tab = createBottomTabNavigator();

type TabIconProps = {
  focused: boolean;
  icon: ImageSourcePropType;
  label: string;
};

const TabIcon = ({ focused, icon, label }: TabIconProps) => (
  <View style={tabStyles.item}>
    <Image source={icon} style={[tabStyles.icon, focused ? tabStyles.iconActive : tabStyles.iconInactive]} />
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
  </View>
);

const AddButton = () => {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={tabStyles.fabWrapper}
      onPress={() => navigation.navigate('AddNewService')}
      activeOpacity={0.85}
    >
      <View style={tabStyles.fab}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </View>
      <Text style={tabStyles.fabLabel}>{t('providerTabs.add')}</Text>
    </TouchableOpacity>
  );
};

export const ProviderTabNavigator = () => {
  const rtl = isRTL();
  const { t } = useTranslation();

  const tabs = [
    {
      name: 'ProviderHome',
      component: ProviderHomeScreen,
      icon: require('../../assets/home.png'),
      label: t('providerTabs.home'),
    },
    {
      name: 'ProviderPerformance',
      component: ProviderPerformanceScreen,
      icon: require('../../assets/Arrow Going Up Alt.png'),
      label: t('providerTabs.performance'),
    },
    {
      name: 'ProviderAdd',
      component: ProviderHomeScreen,
      label: t('providerTabs.add'),
      isAdd: true,
    },
    {
      name: 'ProviderOrders',
      component: ProviderOrderScreen,
      icon: require('../../assets/car1.png'),
      label: t('providerTabs.order'),
    },
    {
      name: 'ProviderProfile',
      component: ProviderProfileScreen,
      icon: require('../../assets/user.png'),
      label: t('providerTabs.profile'),
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
                  icon={tab.icon}
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
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  iconActive: {
    tintColor: Colors.primary,
  },
  iconInactive: {
    tintColor: '#9AA0AE',
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
