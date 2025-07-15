import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  TextInput
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

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
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
    </TouchableOpacity>
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
    backgroundColor: 'var(--color-bg)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'var(--color-fg)',
  },
  addButton: {
    backgroundColor: 'var(--color-accent)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'var(--color-muted)',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    color: 'var(--color-fg)',
    fontSize: 16,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'var(--color-muted)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'var(--color-fg)',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: 'var(--color-fg)',
    opacity: 0.7,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'var(--color-accent)',
    marginBottom: 4,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    marginLeft: 4,
    fontSize: 14,
    color: 'var(--color-fg)',
    opacity: 0.8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'var(--color-error)',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: 'var(--color-accent)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
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