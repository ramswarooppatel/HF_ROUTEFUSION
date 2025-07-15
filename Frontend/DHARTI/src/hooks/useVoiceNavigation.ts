import { useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-audio';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { voiceProcessingService, VoiceProcessingResult } from '../services/voiceProcessingService';
import { productService } from '../services/productService';
import { shareService } from '../services/shareService';

export const useVoiceNavigation = () => {
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastIntent, setLastIntent] = useState<any>(null);
  const navigation = useNavigation();
  const { i18n } = useTranslation();

  const processCommand = useCallback(async (audioBase64: string) => {
    setIsProcessing(true);
    try {
      // Convert speech to text
      const text = await voiceProcessingService.speechToText(audioBase64, i18n.language);
      console.log('Recognized text:', text);

      // Process command with Groq for intent detection
      const result: VoiceProcessingResult = await voiceProcessingService.processVoiceCommand(text);
      console.log('Detected intent:', result.intent);
      
      setLastIntent(result.intent);
      
      // Execute action based on intent
      await executeIntent(result);
      
    } catch (error) {
      console.error('Voice processing error:', error);
      await speakResponse('Sorry, I couldn\'t understand that. Please try again.', i18n.language);
    } finally {
      setIsProcessing(false);
    }
  }, [i18n.language]);

  const executeIntent = async (result: VoiceProcessingResult) => {
    const { intent } = result;

    // Use Groq response message if available
    const responseMessage = intent.response_message;

    switch (intent.action) {
      case 'navigate':
        await handleNavigation(intent.parameters.screen, responseMessage);
        break;
      
      case 'add_product':
        await handleProductAddition(intent.parameters, responseMessage);
        break;
      
      case 'share_product':
        await handleProductSharing(intent.parameters.productName, responseMessage);
        break;
      
      case 'get_info':
        await handleInfoRequest(intent.parameters.type, responseMessage);
        break;
      
      default:
        const fallbackMessage = responseMessage || 'I didn\'t understand that command. Please try again.';
        await speakResponse(fallbackMessage, result.language);
    }
  };

  const handleNavigation = async (screen: string, responseMessage?: string) => {
    try {
      navigation.navigate(screen as never);
      const message = responseMessage || `Navigating to ${screen}`;
      await speakResponse(message, i18n.language);
    } catch (error) {
      await speakResponse('Navigation failed', i18n.language);
    }
  };

  const handleProductAddition = async (params: any, responseMessage?: string) => {
    try {
      const { quantity, unit, name, price } = params;
      
      // Validate required parameters
      if (!name || !quantity || !price) {
        await speakResponse(
          'I need more information. Please tell me the product name, quantity, and price.',
          i18n.language
        );
        return;
      }
      
      // Add product via API
      const newProduct = await productService.createProduct({
        name,
        price,
        stock_qty: quantity,
        category: 'General', // Default category
        description: `${quantity} ${unit} of ${name}`,
        user: 1, // Default user ID
        image_url: '',
        remarks: `Added via voice command`
      });

      const message = responseMessage || 
        `Successfully added ${quantity} ${unit} ${name} for ${price} rupees to your catalog`;
      
      await speakResponse(message, i18n.language);
      
      // Navigate to catalog to show the added product
      navigation.navigate('Catalog' as never);
      
    } catch (error) {
      console.error('Product addition error:', error);
      await speakResponse('Failed to add product. Please try again.', i18n.language);
    }
  };

  const handleProductSharing = async (productName: string, responseMessage?: string) => {
    try {
      if (!productName) {
        await speakResponse('Please specify which product you want to share.', i18n.language);
        return;
      }

      // Find product by name
      const product = await productService.findProductByName(productName);
      
      if (!product) {
        await speakResponse(`Product "${productName}" not found in your catalog`, i18n.language);
        return;
      }

      // Generate QR code and product card
      const shareData = await shareService.generateProductShare(product);
      
      // Show sharing options
      Alert.alert(
        'Share Product',
        `Share ${product.name}?`,
        [
          { text: 'WhatsApp', onPress: () => shareService.shareToWhatsApp(shareData) },
          { text: 'Amazon', onPress: () => shareService.publishToAmazon(product) },
          { text: 'Blinkit', onPress: () => shareService.publishToBlinkit(product) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );

      const message = responseMessage || 
        `Sharing options for ${product.name} are now available`;
      
      await speakResponse(message, i18n.language);
      
    } catch (error) {
      console.error('Product sharing error:', error);
      await speakResponse('Failed to share product', i18n.language);
    }
  };

  const handleInfoRequest = async (type: string, responseMessage?: string) => {
    try {
      switch (type) {
        case 'products':
          navigation.navigate('Catalog' as never);
          const message = responseMessage || 'Showing your product catalog';
          await speakResponse(message, i18n.language);
          break;
        
        case 'stock':
          // Navigate to a stock view or show stock info
          const stockMessage = responseMessage || 'Checking your stock levels';
          await speakResponse(stockMessage, i18n.language);
          break;
        
        default:
          await speakResponse('What would you like to know about?', i18n.language);
      }
    } catch (error) {
      console.error('Info request error:', error);
      await speakResponse('Failed to get information', i18n.language);
    }
  };

  const speakResponse = async (text: string, languageCode: string) => {
    try {
      const audioBase64 = await voiceProcessingService.textToSpeech(text, languageCode);
      await voiceProcessingService.playAudioFromBase64(audioBase64);
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const startListening = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone permission');
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
      
      await speakResponse('Listening...', i18n.language);

    } catch (error) {
      console.error('Failed to start recording:', error);
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
        // Convert audio file to base64
        const response = await fetch(uri);
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          processCommand(base64);
        };
        
        reader.readAsDataURL(blob);
      }

    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const toggleVoiceListener = useCallback(async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  }, [isListening]);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  return {
    isListening,
    isProcessing,
    lastIntent,
    startListening,
    stopListening,
    toggleVoiceListener,
    processCommand
  };
};