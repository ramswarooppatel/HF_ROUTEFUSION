import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, Animated, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';
import { requestPermissionsAsync } from 'expo-av'; // For audio recordingexpo install expo-av
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { isListening, toggleVoiceListener } = useVoiceNavigation();
  
  // Add scale animation for voice button
  const scaleAnim = new Animated.Value(1);
  
  const animateVoiceButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8ECF4',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#4361EE',
        tabBarInactiveTintColor: '#4F566B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : styles.iconContainer}>
              <Feather name="home" size={24} color={color} />
            </View>
          ),
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
            <Animated.View
              style={[
                styles.voiceButtonContainer,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  animateVoiceButton();
                  toggleVoiceListener();
                }}
                style={[
                  styles.voiceButton,
                  isListening && styles.voiceButtonActive
                ]}
              >
                <Feather name="mic" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
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

const styles = {
  iconContainer: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  activeIconContainer: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F0F3FF',
    marginBottom: 4,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  voiceButtonContainer: {
    top: Platform.OS === 'ios' ? -30 : -25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
  },
  voiceButton: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: '#4361EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  voiceButtonActive: {
    backgroundColor: '#FF5A5F',
    shadowColor: '#FF5A5F',
    transform: [{ scale: 1.15 }],
  }
};