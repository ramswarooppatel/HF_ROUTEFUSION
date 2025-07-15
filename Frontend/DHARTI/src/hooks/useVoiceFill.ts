import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
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
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Speech.speak(t('voice.permission_denied'));
        return;
      }

      // Configure audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      
      setRecording(newRecording);
      setIsRecording(true);
      Speech.speak(t('voice.recording_started'));

    } catch (error) {
      console.error('Failed to start recording:', error);
      Speech.speak(t('voice.recording_failed'));
      setIsRecording(false);
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