export interface Shop {
  id: number;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  rating: number;
  total_reviews: number;
  total_products: number;
  total_orders: number;
  created_at: string;
  owner: {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
  };
  categories: Category[];
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  image?: string;
  images?: string[];
  stock: number;
  rating?: number;
  sold?: number;
  category?: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
  stats?: {
    review_count: number;
    average_rating: number;
  };
  shop?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: number;
  product_id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  status: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user?: {
    username: string;
    full_name: string;
  };
  created_at: string;
}

export interface Order {
  id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}