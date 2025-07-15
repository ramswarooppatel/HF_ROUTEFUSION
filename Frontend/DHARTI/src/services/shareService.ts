import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import QRCode from 'qrcode';
import { Product } from './productService';
import { Alert } from 'react-native';

export interface ShareData {
  qrCodeUri: string;
  productCardUri: string;
  shareText: string;
}

class ShareService {
  async generateProductShare(product: Product): Promise<ShareData> {
    try {
      // Generate QR code for product
      const productUrl = `https://dharti.app/product/${product.id}`;
      const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Save QR code to file system
      const qrCodeUri = `${FileSystem.documentDirectory}qr_${product.id}.png`;
      await FileSystem.writeAsStringAsync(
        qrCodeUri, 
        qrCodeDataUrl.split(',')[1], 
        { encoding: FileSystem.EncodingType.Base64 }
      );

      // Generate product card (you can enhance this with a proper image generator)
      const productCardUri = await this.generateProductCard(product);

      const shareText = `Check out my product: ${product.name}\nPrice: ₹${product.price}\nStock: ${product.stock_qty} available\n\nView more: ${productUrl}`;

      return {
        qrCodeUri,
        productCardUri,
        shareText
      };
    } catch (error) {
      console.error('Generate share data error:', error);
      throw error;
    }
  }

  private async generateProductCard(product: Product): Promise<string> {
    // For now, return the QR code URI. In a real implementation, 
    // you'd generate a proper product card with product image, details, etc.
    const cardUri = `${FileSystem.documentDirectory}card_${product.id}.png`;
    
    // This is a placeholder - you'd use a proper image generation library
    // or send the product data to an image generation API
    
    return cardUri;
  }

  async shareToWhatsApp(shareData: ShareData): Promise<void> {
    try {
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareData.shareText)}`;
      
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to general sharing
        await Sharing.shareAsync(shareData.qrCodeUri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Product'
        });
      }
    } catch (error) {
      console.error('WhatsApp share error:', error);
      Alert.alert('Error', 'Failed to share to WhatsApp');
    }
  }

  async publishToAmazon(product: Product): Promise<void> {
    // Dummy implementation for Amazon publishing
    Alert.alert(
      'Publish to Amazon',
      `Publishing "${product.name}" to Amazon...\n\nThis is a demo implementation. In a real app, this would integrate with Amazon's Seller API.`,
      [
        {
          text: 'Simulate Success',
          onPress: () => {
            Alert.alert('Success', `${product.name} has been published to Amazon!`);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  }

  async publishToBlinkit(product: Product): Promise<void> {
    // Dummy implementation for Blinkit publishing
    Alert.alert(
      'Publish to Blinkit',
      `Publishing "${product.name}" to Blinkit...\n\nThis is a demo implementation. In a real app, this would integrate with Blinkit's merchant API.`,
      [
        {
          text: 'Simulate Success',
          onPress: () => {
            Alert.alert('Success', `${product.name} has been published to Blinkit!`);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  }
}

export const shareService = new ShareService();