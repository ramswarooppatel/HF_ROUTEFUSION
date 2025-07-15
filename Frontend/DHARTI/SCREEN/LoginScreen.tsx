import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useVoiceFill } from '../src/hooks/useVoiceFill';
import { switchLanguage } from '../src/utils/languageUtils'; // Add this import
import * as Speech from 'expo-speech';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

type LoginForm = {
  identifier: string;
  password: string;
};

// Modified LoginScreen component definition and navigation setup
export default function LoginScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isRecording, startRecording, stopRecording } = useVoiceFill();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { identifier: '', password: '' }
  });

  // Bypass login with simulated API call
  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return data; // Always succeed
    },
    onSuccess: (data) => {
      Speech.speak(t('login.success'));
      // navigation.navigate('Home'); // Navigate to Home on success
    }
  });

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'ta', label: 'தமிழ்' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.languageSelector}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langButton,
              selectedLanguage === lang.code && styles.langButtonActive
            ]}
            onPress={() => {
              setSelectedLanguage(lang.code);
              switchLanguage(lang.code as 'en' | 'hi' | 'gu' | 'te' | 'ta');
            }}
          >
            <Text style={styles.langButtonText}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('login.title')}</Text>

        <Controller
          control={control}
          name="identifier"
          rules={{ required: t('login.error_required') }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={t('login.placeholder_identifier')}
              value={value}
              onChangeText={onChange}
              accessibilityLabel={t('login.input_identifier_label')}
              placeholderTextColor="#666"
            />
          )}
        />
        {errors.identifier && (
          <Text style={styles.errorText}>{errors.identifier.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{
            required: t('login.error_required'),
            minLength: {
              value: 4,
              message: t('login.error_short_password')
            }
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={t('login.placeholder_password')}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              accessibilityLabel={t('login.input_password_label')}
              placeholderTextColor="#666"
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSubmit((data) => loginMutation.mutate(data))}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('login.button')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, { marginTop: 16 }]}
          onPress={() => navigation.navigate('MainApp')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voiceButton}
          onPress={isRecording ? stopRecording : startRecording}
          accessibilityLabel={t('login.voice_mic_label')}
        >
          <Text style={styles.voiceButtonText}>
            {isRecording ? '🎤' : '🎙️'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Light background for better readability
    padding: 20
  },
  languageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  langButton: {
    padding: 12,
    margin: 6,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6'
  },
  langButtonActive: {
    backgroundColor: '#4361ee', // Vibrant blue for active state
    borderColor: '#4361ee'
  },
  langButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600'
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8
  },
  title: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    color: '#212529',
    marginBottom: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    maxWidth: 340,
    height: 56,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#212529',
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  loginButton: {
    width: '100%',
    maxWidth: 340,
    height: 56,
    backgroundColor: '#4361ee', // Vibrant blue
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  errorText: {
    color: '#dc3545', // Bootstrap red for errors
    fontSize: 14,
    marginBottom: 12,
    alignSelf: 'flex-start',
    paddingLeft: 16,
    fontWeight: '500'
  },
  voiceButton: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4361ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#4361ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    transform: [{ scale: 1.1 }]
  },
  voiceButtonText: {
    fontSize: 28
  }
};