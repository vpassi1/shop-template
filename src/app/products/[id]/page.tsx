import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';
import type { Product } from '@/types/shop';

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image || '/images/default-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded bg-gray-100">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            
            {product.category && (
              <p className="text-sm text-blue-600 mb-4">
                📂 {product.category.name}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            {product.sale_price && product.sale_price < product.price ? (
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.sale_price)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  -{formatDiscount(product.price, product.sale_price)}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Tình trạng:</span>
              {product.stock > 0 ? (
                <span className="text-green-600 font-semibold">
                  Còn {product.stock} sản phẩm
                </span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Hết hàng
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Đã bán:</span>
              <span className="font-semibold">{product.sold || 0}</span>
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Loại hàng:</h3>
              <div className="grid gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`border rounded-lg p-4 ${
                      variant.stock > 0 
                        ? 'border-gray-200 hover:border-blue-300 cursor-pointer' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {variant.name}
                        </h4>
                        {variant.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {variant.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(variant.price)}
                        </div>
                        <div className={`text-sm ${
                          variant.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {variant.stock > 0 ? `Còn ${variant.stock}` : 'Hết hàng'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="font-semibold">{product.rating || 0}</span>
              <span className="text-gray-600">/ 5</span>
            </div>
            <span className="text-gray-600">
              ({product.stats?.review_count || 0} đánh giá)
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Mô tả sản phẩm:</h3>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t">
            <button 
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                product.stock > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Mua ngay' : 'Hết hàng'}
            </button>
            
            <button className="w-full py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">
                      {review.user?.full_name || review.user?.username || 'Khách hàng'}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}