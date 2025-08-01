import type { Shop, Product } from '@/types/shop';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://chommo.store/api';
const SHOP_ID = process.env.NEXT_PUBLIC_SHOP_ID;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function apiRequest<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || result.message || 'API request failed');
    }

    return result.data as T;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function getShopInfo(): Promise<Shop> {
  if (!SHOP_ID) {
    throw new Error('SHOP_ID not configured');
  }
  
  return apiRequest<Shop>(`/shop/info.php?shop_id=${SHOP_ID}`);
}

export async function getShopProducts(page: number = 1, limit: number = 12): Promise<Product[]> {
  if (!SHOP_ID) {
    throw new Error('SHOP_ID not configured');
  }
  
  return apiRequest<Product[]>(`/shop/products.php?shop_id=${SHOP_ID}&page=${page}&limit=${limit}`);
}

export async function getProduct(productId: string): Promise<Product> {
  return apiRequest<Product>(`/shop/product.php?id=${productId}`);
}

export async function searchProducts(query: string, page: number = 1): Promise<Product[]> {
  if (!SHOP_ID) {
    throw new Error('SHOP_ID not configured');
  }
  
  return apiRequest<Product[]>(`/shop/search.php?shop_id=${SHOP_ID}&q=${encodeURIComponent(query)}&page=${page}`);
}