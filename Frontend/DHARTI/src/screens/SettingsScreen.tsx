import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingSection = {
  id: string;
  title: string;
  items: SettingItem[];
};

type SettingItem = {
  id: string;
  title: string;
  type: 'toggle' | 'button' | 'language';
  value?: boolean;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
};

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      await AsyncStorage.setItem('@app_language', langCode);
      Speech.speak(t('settings.language_changed'));
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  const handleThemeToggle = async (isDark: boolean) => {
    setDarkMode(isDark);
    // TODO: Implement theme switching logic
    Speech.speak(isDark ? t('settings.dark_mode_on') : t('settings.dark_mode_off'));
  };

  const handleAccessibilityToggle = (isHighContrast: boolean) => {
    setHighContrast(isHighContrast);
    // TODO: Implement high contrast mode
    Speech.speak(isHighContrast ? t('settings.high_contrast_on') : t('settings.high_contrast_off'));
  };

  const handleVoiceToggle = (enabled: boolean) => {
    setVoiceEnabled(enabled);
    if (enabled) {
      Speech.speak(t('settings.voice_enabled'));
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout_title'),
      t('settings.logout_message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            Speech.speak(t('settings.logout_success'));
          },
        },
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      id: 'accessibility',
      title: t('settings.accessibility'),
      items: [
        {
          id: 'voice',
          title: t('settings.voice_feedback'),
          type: 'toggle',
          value: voiceEnabled,
          icon: 'mic',
          onPress: () => handleVoiceToggle(!voiceEnabled),
        },
        {
          id: 'contrast',
          title: t('settings.high_contrast'),
          type: 'toggle',
          value: highContrast,
          icon: 'eye',
          onPress: () => handleAccessibilityToggle(!highContrast),
        },
      ],
    },
    {
      id: 'appearance',
      title: t('settings.appearance'),
      items: [
        {
          id: 'theme',
          title: t('settings.dark_mode'),
          type: 'toggle',
          value: darkMode,
          icon: 'moon',
          onPress: () => handleThemeToggle(!darkMode),
        },
        {
          id: 'language',
          title: t('settings.language'),
          type: 'language',
          icon: 'globe',
        },
      ],
    },
    {
      id: 'account',
      title: t('settings.account'),
      items: [
        {
          id: 'profile',
          title: t('settings.edit_profile'),
          type: 'button',
          icon: 'user',
          onPress: () => {/* TODO: Navigate to profile */},
        },
        {
          id: 'logout',
          title: t('settings.logout'),
          type: 'button',
          icon: 'log-out',
          onPress: handleLogout,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.settingItem,
        item.id === 'logout' && styles.logoutItem
      ]}
      onPress={item.onPress}
      accessibilityLabel={item.title}
      accessibilityRole={item.type === 'toggle' ? 'switch' : 'button'}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <Feather 
            name={item.icon} 
            size={20} 
            color={item.id === 'logout' ? '#FF5A5F' : '#4361EE'} 
          />
        </View>
        <Text style={[
          styles.settingItemText,
          item.id === 'logout' && styles.logoutText
        ]}>
          {item.title}
        </Text>
      </View>
      
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{
            false: '#E8ECF4',
            true: '#4361EE'
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E8ECF4"
        />
      )}
      
      {item.type === 'button' && (
        <View style={styles.chevronIcon}>
          <Feather 
            name="chevron-right" 
            size={20} 
            color="#4F566B" 
          />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {settingSections.map(section => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFD',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1F36',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingTop: 12,
  },
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F566B',
    marginLeft: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3FF',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItemText: {
    fontSize: 16,
    color: '#1A1F36',
    marginLeft: 16,
    fontWeight: '500',
    flex: 1,
  },
  switchContainer: {
    backgroundColor: '#E8ECF4',
    padding: 2,
    borderRadius: 16,
    width: 52,
    height: 32,
  },
  switchActive: {
    backgroundColor: '#4361EE',
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chevronIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF5A5F',
  }
};