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
      style={styles.settingItem}
      onPress={item.onPress}
      accessibilityLabel={item.title}
      accessibilityRole={item.type === 'toggle' ? 'switch' : 'button'}
    >
      <View style={styles.settingItemLeft}>
        <Feather name={item.icon} size={22} color="var(--color-fg)" />
        <Text style={styles.settingItemText}>{item.title}</Text>
      </View>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: 'var(--color-muted)', true: 'var(--color-accent)' }}
          thumbColor={Platform.OS === 'ios' ? '#fff' : 'var(--color-fg)'}
        />
      )}
      {item.type === 'button' && (
        <Feather name="chevron-right" size={22} color="var(--color-fg)" />
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
    backgroundColor: 'var(--color-bg)',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-muted)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'var(--color-fg)',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'var(--color-fg-muted)',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: 'var(--color-muted)',
    borderRadius: 12,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'var(--color-bg)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    color: 'var(--color-fg)',
    marginLeft: 12,
  },
};