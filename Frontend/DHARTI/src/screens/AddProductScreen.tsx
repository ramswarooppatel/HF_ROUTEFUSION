import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';
import * as Speech from 'expo-speech';

export default function AddProductScreen({ route }) {
  const { prefillData } = route.params || {};
  const { isListening, startListening } = useVoiceNavigation();

  useEffect(() => {
    if (prefillData) {
      Speech.speak('I have created a new product. Would you like to add a photo?', {
        language: 'en-IN',
        rate: 0.9,
        onDone: () => {
          Speech.speak('Say "add photo" to take a picture, or "skip" to continue without photo', {
            language: 'en-IN',
            rate: 0.9
          });
        }
      });
    }
  }, [prefillData]);

  // ... rest of the component implementation
}