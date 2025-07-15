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
  Dimensions
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

  const renderItem = ({ item, index }: { item: MarketplaceItem; index: number }) => (
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
      shadowColor: '#000',
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
      shadowColor: '#000',
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
      shadowColor: '#000',
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
    sellerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F7F9FC',
      padding: 8,
      borderRadius: 8,
      marginBottom: 8,
    },
    sellerName: {
      fontSize: 14,
      color: '#4F566B',
      fontWeight: '600',
      marginRight: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF9E6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    rating: {
      marginLeft: 4,
      fontSize: 14,
      color: '#B7995C',
      fontWeight: '600',
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0F3FF',
      padding: 8,
      borderRadius: 8,
    },
    location: {
      marginLeft: 8,
      fontSize: 14,
      color: '#4361EE',
      fontWeight: '500',
    },
    soldOutBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: '#FF5A5F',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      shadowColor: '#FF5A5F',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    soldOutText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
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
    }
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
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  sellerName: {
    fontSize: 14,
    color: '#4F566B',
    fontWeight: '600',
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#B7995C',
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3FF',
    padding: 8,
    borderRadius: 8,
  },
  location: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4361EE',
    fontWeight: '500',
  },
  soldOutBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  soldOutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  }
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