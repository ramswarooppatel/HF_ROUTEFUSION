import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './src/i18n/i18n';
import LoginScreen from './SCREEN/LoginScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function App() {
  const handleLogin = (data: { identifier: string; password: string }) => {
    console.log('Login success:', data);
    // Handle post-login navigation/state here
    //CRAZYY SHIT
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <LoginScreen onLogin={handleLogin} />
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
