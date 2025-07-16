import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const API_BASE = 'http://69.62.81.187:8001/api';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Start recording
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      console.log('Preparing to record...');
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      console.log('Recording started');
    } catch (e) { /* handle error */ }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      console.log('Recording stopped, file saved at:', uri);
      
      // Send file as multipart/form-data
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/x-wav', // or 'audio/wav'
        name: 'voice.wav',
      });
      formData.append('language_code', 'en-IN');
      console.log('Sending file to server...');
      const re=await axios.post('http://69.62.81.187:9000/stt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
        console.log(re);

    } catch (e) { /* handle error */ }
  };

  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const scaleAnim = new Animated.Value(1);
  
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsRes, catalogsRes] = await Promise.all([
          axios.get(`${API_BASE}/products/`),
          axios.get(`${API_BASE}/catalogs/`)
        ]);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setCatalogs(Array.isArray(catalogsRes.data) ? catalogsRes.data : []);
      } catch (err) {
        setProducts([]); // fallback to empty array on error
        setCatalogs([]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const TipCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <View style={styles.tipCard}>
      <Feather name={icon} size={24} color="var(--color-accent)" />
      <Text style={styles.tipTitle}>{title}</Text>
      <Text style={styles.tipDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome to VaaniKart</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Feather name="plus-circle" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add New Product</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Catalog')}
        >
          <Feather name="box" size={24} color="#fff" />
          <Text style={styles.buttonText}>My Catalog</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Marketplace')}
        >
          <Feather name="shopping-bag" size={24} color="#fff" />
          <Text style={styles.buttonText}>Open Marketplace</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.voiceButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Feather name={isRecording ? "square" : "mic"} size={32} color="#fff" />
        <Text style={styles.voiceText}>
          {isRecording ? "Stop Recording" : "Tap to Speak"}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4361EE" style={{ marginVertical: 24 }} />
      ) : (
        <View style={{ marginVertical: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Your Products: {products.length}</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Your Catalogs: {catalogs.length}</Text>
          {/* Optionally, show a preview list */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Array.isArray(products) && products.slice(0, 3).map((p: any) => (
              <View key={p.id} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12, marginRight: 12, minWidth: 120, elevation: 2 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{p.name}</Text>
                <Text style={{ color: '#4F566B', fontSize: 14 }}>{p.category}</Text>
                <Text style={{ color: '#4361EE', fontWeight: '600' }}>₹{p.price}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tipsContainer}
      >
        <TipCard 
          icon="volume-2" 
          title="Voice Commands" 
          description="Say 'Add Product' to quickly create listings"
        />
        <TipCard 
          icon="trending-up" 
          title="Track Sales" 
          description="Monitor your business growth"
        />
        <TipCard 
          icon="users" 
          title="Connect" 
          description="Reach more customers in your area"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: 'bold',
    color: '#1A1F36',
    marginBottom: 32,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonContainer: {
    gap: 16,
    marginHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361EE',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  voiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
    padding: 28,
    backgroundColor: '#FF5A5F',
    borderRadius: 40,
    alignSelf: 'center',
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  voiceText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    paddingVertical: 20,
    gap: 16,
    marginTop: 16,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    width: Dimensions.get('window').width * 0.75,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1F36',
    marginVertical: 8,
  },
  tipDescription: {
    color: '#4F566B',
    fontSize: 14,
    lineHeight: 20,
  },
  iconContainer: {
    backgroundColor: '#F0F3FF',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  }
};