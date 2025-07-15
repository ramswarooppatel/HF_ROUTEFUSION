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
    backgroundColor: 'var(--color-bg)',
    padding: 16
  },
  languageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24
  },
  langButton: {
    padding: 8,
    margin: 4,
    borderRadius: 8,
    backgroundColor: 'var(--color-muted)'
  },
  langButtonActive: {
    backgroundColor: 'var(--color-accent)'
  },
  langButtonText: {
    color: 'var(--color-fg)',
    fontSize: 14
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  title: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    color: 'var(--color-fg)',
    marginBottom: 32,
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: 'var(--color-muted)',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: 'var(--color-fg)'
  },
  loginButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: 'var(--color-accent)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8  // Adjusted margin for better spacing between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorText: {
    color: 'var(--color-error)',
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
    paddingLeft: 16
  },
  voiceButton: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'var(--color-accent)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  voiceButtonText: {
    fontSize: 24
  }
};