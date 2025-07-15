import { useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { processVoiceCommand } from '../services/voiceProcessing';

export const useVoiceNavigation = () => {
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const processCommand = useCallback(async (text: string) => {
    try {
      const result = await processVoiceCommand(text);
      
      if (result.intent?.action === 'create_product') {
        await handleProductCreation(result.intent);
      } else if (result.intent?.action === 'navigate') {
        navigation.navigate(result.intent.parameters.screen);
        speakWithIndianAccent(
          `Going to ${result.intent.parameters.screen}`,
          result.language
        );
      } else {
        speakWithIndianAccent(
          "I didn't understand that command. Please try again.",
          'en-IN'
        );
      }
    } catch (error) {
      console.error('Error processing command:', error);
      Speech.speak(t('voice.processing_failed'));
    }
  }, [navigation, handleProductCreation]);

  const speakWithIndianAccent = useCallback((text: string, language: string) => {
    Speech.speak(text, {
      language,
      rate: 0.9,
      pitch: 1.0,
      voice: language.startsWith('en') ? 'en-IN' : language
    });
  }, []);

  const handleProductCreation = useCallback(async (intent: any) => {
    const { parameters } = intent;
    const newProduct = {
      name: parameters.item,
      price: parameters.price,
      quantity: parameters.quantity,
      unit: parameters.unit
    };
    
    speakWithIndianAccent(
      `Creating product: ${parameters.quantity} ${parameters.unit} ${parameters.item} for ${parameters.price} rupees`,
      'en-IN'
    );
    
    navigation.navigate('AddProduct', { prefillData: newProduct });
  }, [navigation]);

  const toggleVoiceListener = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening, stopListening, startListening]);

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
    startListening,
    stopListening,
    processCommand,
    toggleVoiceListener
  };
};