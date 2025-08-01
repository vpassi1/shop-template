import Link from 'next/link';
import type { Product } from '@/types/shop';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDiscount = (originalPrice: number, salePrice: number) => {
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    return discount;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <img
            src={product.image || '/images/default-product.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          
          {/* Discount Badge */}
          {product.sale_price && product.sale_price < product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              -{formatDiscount(product.price, product.sale_price)}%
            </div>
          )}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {product.sale_price && product.sale_price < product.price ? (
                <>
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Còn lại</div>
              <div className="font-semibold text-gray-900">
                {product.stock > 0 ? product.stock : 0}
              </div>
            </div>
          </div>

          {/* Product Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>⭐ {product.rating || 0}/5</span>
            <span>🛒 {product.sold || 0} đã bán</span>
          </div>

          {/* Category */}
          {product.category && (
            <div className="mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Action Button */}
          <button 
            className={`w-full py-2 px-4 rounded font-medium transition-colors ${
              product.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Xem chi tiết' : 'Hết hàng'}
          </button>
        </div>
      </Link>
    </div>
  );
}