import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock_qty: number;
  image_url: string;
  category: string;
  user: number;
  remarks: string;
}

class ProductService {
  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    try {
      const response = await axios.post(`${API_BASE}/products/`, productData);
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  async findProductByName(name: string): Promise<Product | null> {
    try {
      const response = await axios.get(`${API_BASE}/products/`);
      const products: Product[] = response.data;
      
      return products.find(p => 
        p.name.toLowerCase().includes(name.toLowerCase())
      ) || null;
    } catch (error) {
      console.error('Find product error:', error);
      return null;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${API_BASE}/products/`);
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.put(`${API_BASE}/products/${id}/`, productData);
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE}/products/${id}/`);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();