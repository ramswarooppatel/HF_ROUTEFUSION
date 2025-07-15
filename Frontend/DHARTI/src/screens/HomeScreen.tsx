import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const TipCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <View style={styles.tipCard}>
      <Feather name={icon} size={24} color="var(--color-accent)" />
      <Text style={styles.tipTitle}>{title}</Text>
      <Text style={styles.tipDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome to VocalKart</Text>
      
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

      <TouchableOpacity style={styles.voiceButton}>
        <Feather name="mic" size={32} color="#fff" />
        <Text style={styles.voiceText}>Tap to Speak</Text>
      </TouchableOpacity>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tipsContainer}
      >
        <TipCard 
          icon="voice" 
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
    backgroundColor: 'var(--color-bg)',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'var(--color-fg)',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'var(--color-accent)',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
    padding: 24,
    backgroundColor: 'var(--color-accent)',
    borderRadius: 32,
    alignSelf: 'center',
  },
  voiceText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
  tipsContainer: {
    paddingVertical: 16,
    gap: 16,
  },
  tipCard: {
    backgroundColor: 'var(--color-muted)',
    padding: 16,
    borderRadius: 12,
    width: 200,
    marginRight: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'var(--color-fg)',
    marginVertical: 8,
  },
  tipDescription: {
    color: 'var(--color-fg)',
    opacity: 0.8,
  },
};