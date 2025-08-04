import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';
import type { Product } from '@/types/shop';
import ProductDetails from '@/components/ProductDetails';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product;
  
  try {
    product = await getProduct(params.id);
  } catch (error) {
    notFound();
  }

  return <ProductDetails product={product} />;
}