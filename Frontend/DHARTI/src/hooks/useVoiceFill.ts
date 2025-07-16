import { useState, useEffect } from 'react';
import { Audio } from 'expo-av'; // Updated import
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';

export const useVoiceFill = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Cleanup recording on unmount
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
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
      await newRecording.prepareToRecordAsync({
        android: {
          audioEncoder: Audio.AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          audioQuality: Audio.RECORDING_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      Speech.speak(t('voice.recording_failed'));
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      
      // Get recording URI
      const uri = recording.getURI();
      setRecording(null);

      // Here you would typically:
      // 1. Send audio to speech-to-text service
      // 2. Update form fields with transcribed text
      // For now, we'll just provide feedback
      Speech.speak(t('voice.recording_stopped'));

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Speech.speak(t('voice.recording_failed'));
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
};