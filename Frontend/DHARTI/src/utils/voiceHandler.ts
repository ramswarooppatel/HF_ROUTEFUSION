import { LanguageCode } from '../types/common';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export const recognizeSpeech = async (audioUri: string, language: LanguageCode): Promise<string> => {
  if (Platform.OS === 'web') {
    return webSpeechRecognition(language);
  } else {
    return expoSpeechRecognition(language);
  }
};

const webSpeechRecognition = (language: LanguageCode): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window)) {
      reject('Speech recognition not supported');
      return;
    }

    // @ts-ignore - WebkitSpeechRecognition is not in the types
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLangCode(language);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      reject(event.error);
    };

    recognition.start();
  });
};

const expoSpeechRecognition = async (language: LanguageCode): Promise<string> => {
  // For now, we'll use text-to-speech to provide feedback
  // since Expo doesn't have built-in speech recognition
  Speech.speak('Voice recognition is in progress', {
    language: getLangCode(language)
  });
  
  // Return a dummy response for demo
  return 'Voice recognition is not yet implemented for mobile';
};

const getLangCode = (language: LanguageCode): string => {
  const langMap: Record<LanguageCode, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    gu: 'gu-IN'
  };
  return langMap[language] || 'en-US';
};

export const commandMappings = {
  en: {
    home: ['go to home', 'home', 'go home'],
    catalog: ['open catalog', 'catalog', 'my products'],
    marketplace: ['open marketplace', 'marketplace', 'shop'],
    settings: ['go to settings', 'settings', 'options'],
    addProduct: ['add product', 'new product', 'create product']
  },
  hi: {
    home: ['होम पे जाओ', 'होम', 'घर'],
    catalog: ['कैटलॉग खोलो', 'कैटलॉग', 'मेरे प्रोडक्ट्स'],
    marketplace: ['मार्केटप्लेस खोलो', 'बाज़ार', 'दुकान'],
    settings: ['सेटिंग्स', 'विकल्प'],
    addProduct: ['प्रोडक्ट जोड़ें', 'नया प्रोडक्ट', 'उत्पाद जोड़ें']
  },
  ta: {
    home: ['முகப்புக்குச் செல்', 'முகப்பு', 'வீடு'],
    catalog: ['காட்டலாக் திற', 'காட்டலாக்', 'என் பொருட்கள்'],
    marketplace: ['சந்தை திற', 'கடை', 'அங்காடி'],
    settings: ['அமைப்புகள்', 'விருப்பங்கள்'],
    addProduct: ['பொருள் சேர்', 'புதிய பொருள்']
  }
};