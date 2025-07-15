import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';

export const startMobileVoiceRecognition = async (language: string): Promise<void> => {
  try {
    await Voice.start(language);
  } catch (e) {
    console.error(e);
  }
};

export const stopMobileVoiceRecognition = async (): Promise<void> => {
  try {
    await Voice.stop();
  } catch (e) {
    console.error(e);
  }
};

// Add event listeners in your component:
Voice.onSpeechResults = (e: SpeechResultsEvent) => {
  if (e.value) {
    // Process the recognized text
    console.log(e.value[0]);
  }
};