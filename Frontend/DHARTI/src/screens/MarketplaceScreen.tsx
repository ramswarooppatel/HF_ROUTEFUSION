import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useVoiceFill } from '../hooks/useVoiceFill';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

type Product = {
  id: string;
  name: string;
  price: number;
  user: number;
  description: string;
  stock_qty: number;
  image_url: string;
  category: string;
  remarks: string;
};

export default function MarketplaceScreen() {
  const { t } = useTranslation();
  const { isRecording, startRecording, stopRecording } = useVoiceFill();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch products from API
  const { data, isLoading, isError, refetch } = useQuery<Product[]>({
    queryKey: ['marketplace-products'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/products/`);
      return res.data;
    }
  });

  // Simulate purchase (create transaction)
  const purchaseMutation = useMutation({
    mutationFn: async (product: Product) => {
      // TODO: Replace with actual user id
      const userId = 1;
      return axios.post(`${API_BASE}/transactions/`, {
        user: userId,
        product: product.id,
        payment_link: 'https://payment.example.com',
        reference_no: `TXN${Date.now()}`,
        amount: product.price,
        status: 'pending'
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Purchase initiated!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to purchase');
    }
  });

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy'];

  const filteredItems = data?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' ||
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add fade animation
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const renderItem = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View
      style={[
        styles.itemCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}
    >
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <Text style={styles.sellerName}>Seller ID: {item.user}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.stockText}>
          {item.stock_qty > 0 ? `${item.stock_qty} in stock` : 'Sold Out'}
        </Text>
        <TouchableOpacity
          style={[styles.buyButton, item.stock_qty === 0 && { backgroundColor: '#ccc' }]}
          disabled={item.stock_qty === 0 || purchaseMutation.isLoading}
          onPress={() => purchaseMutation.mutate(item)}
        >
          <Text style={styles.buyButtonText}>
            {item.stock_qty === 0 ? 'Sold Out' : 'Buy Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#F8FAFD',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1A1F36',
      letterSpacing: 0.5,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      margin: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E8ECF4',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: '#1A1F36',
    },
    categoriesList: {
      maxHeight: 60,
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    categoryButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginRight: 12,
      borderRadius: 24,
      backgroundColor: '#F0F3FF',
      borderWidth: 1,
      borderColor: '#E8ECF4',
      minWidth: 100,
      alignItems: 'center',
    },
    categoryButtonActive: {
      backgroundColor: '#4361EE',
      borderColor: '#4361EE',
      transform: [{ scale: 1.05 }],
    },
    categoryText: {
      color: '#4F566B',
      fontSize: 15,
      fontWeight: '500',
    },
    categoryTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    listContainer: {
      padding: 16,
    },
    itemCard: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E8ECF4',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    itemImage: {
      width: 120,
      height: 120,
      borderRadius: 12,
      margin: 8,
    },
    itemInfo: {
      flex: 1,
      padding: 16,
    },
    itemTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1A1F36',
      marginBottom: 8,
    },
    itemPrice: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4361EE',
      marginBottom: 12,
    },
    sellerName: {
      fontSize: 14,
      color: '#4F566B',
      fontWeight: '600',
      marginBottom: 4,
    },
    itemCategory: {
      fontSize: 14,
      color: '#8792A2',
      marginBottom: 4,
    },
    stockText: {
      fontSize: 14,
      color: '#FF5A5F',
      marginBottom: 8,
    },
    buyButton: {
      backgroundColor: '#4361EE',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    buyButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    voiceButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#4361EE',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#4361EE',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    voiceButtonActive: {
      backgroundColor: '#FF5A5F',
      transform: [{ scale: 1.05 }],
    },
    errorText: {
      color: '#FF5A5F',
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 16,
    },
    emptyText: {
      color: '#8792A2',
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 32,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8FAFD',
    },
    retryButton: {
      backgroundColor: '#4361EE',
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 12,
      shadowColor: '#4361EE',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    retryText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('marketplace.title')}</Text>
        <TouchableOpacity 
          style={[styles.voiceButton, isRecording && styles.voiceButtonActive]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Feather 
            name="mic" 
            size={24} 
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="#4F566B" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('marketplace.search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8792A2"
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === item && styles.categoryTextActive
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4361EE" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{t('marketplace.error_loading')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              colors={["#4361EE"]}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('marketplace.no_results')}</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1F36',
    letterSpacing: 0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8ECF4',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1F36',
  },
  categoriesList: {
    maxHeight: 60,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 24,
    backgroundColor: '#F0F3FF',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    minWidth: 100,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#4361EE',
    borderColor: '#4361EE',
    transform: [{ scale: 1.05 }],
  },
  categoryText: {
    color: '#4F566B',
    fontSize: 15,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    margin: 8,
  },
  itemInfo: {
    flex: 1,
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1F36',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4361EE',
    marginBottom: 12,
  },
  sellerName: {
    fontSize: 14,
    color: '#4F566B',
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#8792A2',
    marginBottom: 4,
  },
  stockText: {
    fontSize: 14,
    color: '#FF5A5F',
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#4361EE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4361EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  voiceButtonActive: {
    backgroundColor: '#FF5A5F',
    transform: [{ scale: 1.05 }],
  },
  errorText: {
    color: '#FF5A5F',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#8792A2',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFD',
  },
  retryButton: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
};