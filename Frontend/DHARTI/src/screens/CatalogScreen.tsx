import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  TextInput,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  stock_qty: number;
  image_url: string;
  category: string;
};

export default function CatalogScreen() {
  const { t } = useTranslation();
  const { isListening, toggleVoiceListener } = useVoiceNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Animation setup
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Fetch products query
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockProducts;
    }
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View
      style={[
        styles.productCard,
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
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <View style={styles.stockContainer}>
          <Feather 
            name={item.stock_qty > 0 ? "check-circle" : "alert-circle"} 
            size={16} 
            color={item.stock_qty > 0 ? "var(--color-success)" : "var(--color-error)"} 
          />
          <Text style={styles.stockText}>
            {item.stock_qty > 0 ? `${item.stock_qty} in stock` : 'Out of stock'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="var(--color-accent)" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load products</Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Catalog</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="var(--color-fg)" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="var(--color-fg)"
        />
        <TouchableOpacity onPress={toggleVoiceListener}>
          <Feather 
            name="mic" 
            size={20} 
            color={isListening ? "var(--color-error)" : "var(--color-fg)"} 
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFD',
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: 'bold',
    color: '#1A1F36',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: '#4361EE',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8ECF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    color: '#1A1F36',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  productList: {
    padding: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    margin: 8,
  },
  productInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1F36',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  productCategory: {
    fontSize: 14,
    color: '#4F566B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4361EE',
    marginBottom: 8,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: 8,
    borderRadius: 8,
  },
  stockText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4F566B',
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFD',
  },
  errorText: {
    color: '#FF5A5F',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '500',
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

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Rice',
    price: 85,
    description: 'Premium quality organic rice',
    stock_qty: 150,
    image_url: 'https://via.placeholder.com/150',
    category: 'Grains'
  },
  {
    id: '2',
    name: 'Fresh Tomatoes',
    price: 40,
    description: 'Farm fresh tomatoes',
    stock_qty: 75,
    image_url: 'https://via.placeholder.com/150',
    category: 'Vegetables'
  },
  // Add more mock products as needed
];