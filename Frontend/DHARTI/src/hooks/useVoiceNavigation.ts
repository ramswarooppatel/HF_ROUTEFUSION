import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { recognizeSpeech, commandMappings } from '../utils/voiceHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useVoiceNavigation = () => {
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const processCommand = async (transcribedText: string) => {
    const currentLang = i18n.language as keyof typeof commandMappings;
    const commands = commandMappings[currentLang];
    const normalizedText = transcribedText.toLowerCase().trim();

    // Check each command category
    for (const [action, phrases] of Object.entries(commands)) {
      if (phrases.some(phrase => normalizedText.includes(phrase.toLowerCase()))) {
        switch (action) {
          case 'home':
            navigation.navigate('Home');
            Speech.speak(t('voice.navigating_home'));
            return;
          case 'catalog':
            navigation.navigate('Catalog');
            Speech.speak(t('voice.navigating_catalog'));
            return;
          case 'marketplace':
            navigation.navigate('Marketplace');
            Speech.speak(t('voice.navigating_marketplace'));
            return;
          case 'settings':
            navigation.navigate('Settings');
            Speech.speak(t('voice.navigating_settings'));
            return;
          case 'addProduct':
            navigation.navigate('AddProduct');
            Speech.speak(t('voice.navigating_add_product'));
            return;
        }
      }
    }

    Speech.speak(t('voice.command_not_recognized'));
  };

  const toggleVoiceListener = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      const voiceEnabled = await AsyncStorage.getItem('voiceNavigationEnabled');
      if (voiceEnabled !== 'true') {
        Speech.speak(t('voice.navigation_disabled'));
        return;
      }

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Speech.speak(t('voice.permission_denied'));
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      
      setRecording(newRecording);
      setIsListening(true);
      Speech.speak(t('voice.listening'));

    } catch (error) {
      console.error('Failed to start recording:', error);
      Speech.speak(t('voice.recording_failed'));
    }
  };

  const stopListening = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsListening(false);
      setRecording(null);

      if (uri) {
        const transcribedText = await recognizeSpeech(uri, i18n.language);
        await processCommand(transcribedText);
      }

    } catch (error) {
      console.error('Failed to stop recording:', error);
      Speech.speak(t('voice.processing_failed'));
    }
  };

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  return {
    isListening,
    toggleVoiceListener,
    processCommand
  };
};