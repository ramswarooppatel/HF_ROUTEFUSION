import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useVoiceFill } from '../hooks/useVoiceFill';

type MarketplaceItem = {
  id: string;
  title: string;
  price: number;
  seller: {
    name: string;
    rating: number;
    location: string;
  };
  image_url: string;
  category: string;
  available: boolean;
  distance: number;
};

export default function MarketplaceScreen() {
  const { t } = useTranslation();
  const { isRecording, startRecording, stopRecording } = useVoiceFill();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery<MarketplaceItem[]>({
    queryKey: ['marketplace-items'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockItems;
    }
  });

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy'];

  const filteredItems = data?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }: { item: MarketplaceItem }) => (
    <TouchableOpacity style={styles.itemCard}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerName}>{item.seller.name}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{item.seller.rating}</Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <Feather name="map-pin" size={14} color="var(--color-fg)" />
          <Text style={styles.location}>{item.distance}km away</Text>
        </View>
      </View>
      {!item.available && (
        <View style={styles.soldOutBadge}>
          <Text style={styles.soldOutText}>Sold Out</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('marketplace.title')}</Text>
        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
          <Feather 
            name="mic" 
            size={24} 
            color={isRecording ? "var(--color-error)" : "var(--color-fg)"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Feather name="search" size={20} color="var(--color-fg)" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('marketplace.search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="var(--color-fg-muted)"
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
          <ActivityIndicator size="large" color="var(--color-accent)" />
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
              colors={["var(--color-accent)"]}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'var(--color-muted)',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: 'var(--color-fg)',
    fontSize: 16,
  },
  categoriesList: {
    maxHeight: 50,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: 'var(--color-muted)',
  },
  categoryButtonActive: {
    backgroundColor: 'var(--color-accent)',
  },
  categoryText: {
    color: 'var(--color-fg)',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'var(--color-muted)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'var(--color-fg)',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'var(--color-accent)',
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 14,
    color: 'var(--color-fg)',
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: 'var(--color-fg)',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    color: 'var(--color-fg-muted)',
  },
  soldOutBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'var(--color-error)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  soldOutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  emptyText: {
    textAlign: 'center',
    color: 'var(--color-fg-muted)',
    marginTop: 32,
  },
};

// Mock data for development
const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Fresh Organic Tomatoes',
    price: 40,
    seller: {
      name: 'Raj Farms',
      rating: 4.5,
      location: 'Ahmedabad',
    },
    image_url: 'https://via.placeholder.com/150',
    category: 'Vegetables',
    available: true,
    distance: 3.2,
  },
  {
    id: '2',
    title: 'Premium Basmati Rice',
    price: 120,
    seller: {
      name: 'Krishna Grains',
      rating: 4.8,
      location: 'Gandhinagar',
    },
    image_url: 'https://via.placeholder.com/150',
    category: 'Grains',
    available: true,
    distance: 5.7,
  },
  // Add more mock items as needed
];