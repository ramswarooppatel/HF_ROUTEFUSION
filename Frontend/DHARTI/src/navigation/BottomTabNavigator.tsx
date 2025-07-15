import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { isListening, toggleVoiceListener } = useVoiceNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'var(--color-bg)',
          borderTopColor: 'var(--color-border)',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: 'var(--color-accent)',
        tabBarInactiveTintColor: 'var(--color-fg)',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="box" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="VoiceCommand"
        component={View}
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              onPress={toggleVoiceListener}
              style={{
                top: -20,
                justifyContent: 'center',
                alignItems: 'center',
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: isListening ? 'var(--color-error)' : 'var(--color-accent)',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              }}
            >
              <Feather name="mic" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}