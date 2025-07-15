import axios from 'axios';
import { Audio } from 'expo-audio';
import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import Groq from 'groq-sdk';

const TTS_STT_API_BASE = 'http://localhost:8001'; // Your TTS/STT API
const MCP_API_BASE = 'http://localhost:8005'; // Your MCP server

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY || 'your-groq-api-key-here',
  dangerouslyAllowBrowser: true // Required for frontend usage
});

export interface VoiceIntent {
  action: 'navigate' | 'add_product' | 'share_product' | 'get_info' | 'unknown';
  parameters: Record<string, any>;
  confidence: number;
  response_message?: string;
}

export interface VoiceProcessingResult {
  text: string;
  language: string;
  intent: VoiceIntent;
}

class VoiceProcessingService {
  // Convert audio to text
  async speechToText(audioBase64: string, languageCode: string): Promise<string> {
    try {
      const response = await axios.post(`${TTS_STT_API_BASE}/stt`, {
        audio_base64: audioBase64,
        language_code: languageCode
      });
      return response.data.text;
    } catch (error) {
      console.error('STT Error:', error);
      throw new Error('Speech recognition failed');
    }
  }

  // Convert text to speech
  async textToSpeech(text: string, languageCode: string): Promise<string> {
    try {
      const response = await axios.post(`${TTS_STT_API_BASE}/tts`, {
        text: text,
        language_code: languageCode
      });
      return response.data.audio_base64;
    } catch (error) {
      console.error('TTS Error:', error);
      throw new Error('Text to speech failed');
    }
  }

  // Process voice command using Groq for intent detection
  async processVoiceCommand(text: string): Promise<VoiceProcessingResult> {
    try {
      const intent = await this.detectIntentWithGroq(text);
      
      return {
        text,
        language: this.detectLanguage(text),
        intent
      };
    } catch (error) {
      console.error('Voice processing error:', error);
      return {
        text,
        language: 'en-IN',
        intent: { action: 'unknown', parameters: {}, confidence: 0 }
      };
    }
  }

  // Use Groq to detect intent and extract parameters
  private async detectIntentWithGroq(text: string): Promise<VoiceIntent> {
    try {
      const systemPrompt = `You are RFAI (Route Fusion AI), an intelligent assistant for a digital product catalog system.
Your job is to analyze voice commands and extract intent with parameters.

IMPORTANT: Always respond with ONLY a valid JSON object in this exact format:
{
  "action": "navigate|add_product|share_product|get_info|unknown",
  "parameters": {...},
  "confidence": 0.0-1.0,
  "response_message": "user-friendly response"
}

INTENT CLASSIFICATION RULES:

1. NAVIGATION COMMANDS:
   - "go to catalog", "open catalog", "कैटलॉग खोलो", "మా ఉత్పత్తులు చూపించు"
   -> {"action": "navigate", "parameters": {"screen": "Catalog"}, "confidence": 0.9}
   
   - "go to marketplace", "open market", "बाज़ार खोलो", "మార్కెట్ తెరువు"
   -> {"action": "navigate", "parameters": {"screen": "Marketplace"}, "confidence": 0.9}
   
   - "go home", "home page", "होम जाओ", "ముఖ్య పేజీకి వెళ్లు"
   -> {"action": "navigate", "parameters": {"screen": "Home"}, "confidence": 0.9}

2. ADD PRODUCT COMMANDS:
   - "add 1kg tomatoes for 35 rupees", "1 किलो टमाटर 35 रुपये में जोड़ें"
   -> {"action": "add_product", "parameters": {"name": "tomatoes", "quantity": 1, "unit": "kg", "price": 35}}
   
   - "create product rice 50kg 2500 rupees", "चावल 50 किलो 2500 रुपये"
   -> {"action": "add_product", "parameters": {"name": "rice", "quantity": 50, "unit": "kg", "price": 2500}}

3. SHARE PRODUCT COMMANDS:
   - "share tomatoes", "share this product wheat", "टमाटर को share करें"
   -> {"action": "share_product", "parameters": {"productName": "tomatoes"}}

4. INFORMATION REQUESTS:
   - "show my products", "what's in stock", "मेरे प्रोडक्ट्स दिखाओ"
   -> {"action": "get_info", "parameters": {"type": "products"}}

5. UNKNOWN/UNCLEAR:
   - If intent is unclear or missing information
   -> {"action": "unknown", "parameters": {}, "confidence": 0.1}

LANGUAGE SUPPORT: English, Hindi, Tamil, Telugu, Gujarati
EXTRACT ALL RELEVANT PARAMETERS: product names, quantities, units, prices, etc.
SET CONFIDENCE: 0.9 for clear commands, 0.7 for partial info, 0.3 for unclear`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this voice command and extract intent: "${text}"` }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from Groq');
      }

      const parsedIntent = JSON.parse(response);
      
      // Validate the response structure
      if (!parsedIntent.action || !parsedIntent.parameters || parsedIntent.confidence === undefined) {
        throw new Error('Invalid intent structure from Groq');
      }

      return {
        action: parsedIntent.action,
        parameters: parsedIntent.parameters,
        confidence: parsedIntent.confidence,
        response_message: parsedIntent.response_message
      };

    } catch (error) {
      console.error('Groq intent detection error:', error);
      
      // Fallback to rule-based intent detection
      return this.fallbackIntentDetection(text);
    }
  }

  // Fallback rule-based intent detection
  private fallbackIntentDetection(text: string): VoiceIntent {
    const lowerText = text.toLowerCase();
    
    // Navigation intents
    if (lowerText.includes('catalog') || lowerText.includes('कैटलॉग') || lowerText.includes('ఉత్పత్తులు')) {
      return { action: 'navigate', parameters: { screen: 'Catalog' }, confidence: 0.7 };
    }
    
    if (lowerText.includes('marketplace') || lowerText.includes('market') || lowerText.includes('बाज़ार') || lowerText.includes('మార్కెట్')) {
      return { action: 'navigate', parameters: { screen: 'Marketplace' }, confidence: 0.7 };
    }
    
    if (lowerText.includes('home') || lowerText.includes('होम') || lowerText.includes('ముఖ్య')) {
      return { action: 'navigate', parameters: { screen: 'Home' }, confidence: 0.7 };
    }

    // Product addition intents - Enhanced patterns
    const addProductPatterns = [
      // English patterns
      /add (\d+(?:\.\d+)?)\s*(kg|kgs|kilos?|grams?|pieces?|liters?|litres?)\s+(.+?)\s+(?:for|at|price)\s+(\d+)\s*rupees?/i,
      /create (?:product\s+)?(.+?)\s+(\d+(?:\.\d+)?)\s*(kg|kgs|kilos?|grams?|pieces?|liters?)\s+(?:for|at|price)\s+(\d+)\s*rupees?/i,
      /(\d+(?:\.\d+)?)\s*(kg|kgs|kilos?|grams?|pieces?|liters?)\s+(.+?)\s+(\d+)\s*rupees?/i,
      
      // Hindi patterns
      /(\d+(?:\.\d+)?)\s*(किलो|ग्राम|टुकड़े|लीटर|केजी)\s+(.+?)\s+(\d+)\s*रुपये?/i,
      /(.+?)\s+(\d+(?:\.\d+)?)\s*(किलो|ग्राम|टुकड़े|लीटर|केजी)\s+(\d+)\s*रुपये?/i,
      
      // Telugu patterns
      /(\d+(?:\.\d+)?)\s*(కిలో|గ్రాములు|ముక్కలు|లీటర్లు)\s+(.+?)\s+(\d+)\s*రూపాయలు?/i,
      
      // Gujarati patterns
      /(\d+(?:\.\d+)?)\s*(કિલો|ગ્રામ|ટુકડા|લીટર)\s+(.+?)\s+(\d+)\s*રૂપિયા?/i
    ];

    for (const pattern of addProductPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Handle different match group patterns
        let quantity, unit, name, price;
        
        if (match.length === 5) {
          [, quantity, unit, name, price] = match;
        } else if (match.length === 6) {
          [, name, quantity, unit, price] = match;
        }
        
        return {
          action: 'add_product',
          parameters: {
            quantity: parseFloat(quantity),
            unit: unit.toLowerCase(),
            name: name.trim(),
            price: parseInt(price)
          },
          confidence: 0.8
        };
      }
    }

    // Share product intents
    const sharePatterns = [
      /share\s+(?:this\s+)?(?:product\s+)?(.+)/i,
      /(.+?)\s+को\s+share\s+करें/i,
      /share\s+करें\s+(.+)/i,
      /(.+?)\s+ను\s+పంచుకోండి/i
    ];

    for (const pattern of sharePatterns) {
      const match = text.match(pattern);
      if (match && (lowerText.includes('share') || lowerText.includes('शेयर') || lowerText.includes('పంచుకో'))) {
        return {
          action: 'share_product',
          parameters: { productName: match[1].trim() },
          confidence: 0.7
        };
      }
    }

    // Information requests
    if (lowerText.includes('show') || lowerText.includes('list') || lowerText.includes('दिखाओ') || lowerText.includes('చూపించు')) {
      return {
        action: 'get_info',
        parameters: { type: 'products' },
        confidence: 0.6
      };
    }

    return { action: 'unknown', parameters: {}, confidence: 0.1 };
  }

  private detectLanguage(text: string): string {
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'; // Hindi
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN'; // Telugu
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN'; // Gujarati
    return 'en-IN'; // Default to English
  }

  // Play audio from base64
  async playAudioFromBase64(audioBase64: string): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/wav;base64,${audioBase64}` },
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }

  // Execute MCP actions for complex operations
  async executeWithMCP(intent: VoiceIntent, originalText: string): Promise<any> {
    try {
      const response = await axios.post(`${MCP_API_BASE}/process`, {
        prompt: originalText,
        intent: intent
      });
      return response.data;
    } catch (error) {
      console.error('MCP execution error:', error);
      throw error;
    }
  }
}

export const voiceProcessingService = new VoiceProcessingService();