'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product, ProductVariant } from '@/types/shop';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product.sale_price && product.sale_price < product.price ? product.sale_price : product.price;
  };

  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return product.stock;
  };

  const getMaxQuantity = () => {
    const stock = getCurrentStock();
    return stock; // Giới hạn theo số lượng tồn kho thực tế
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity khi chọn variant mới
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxQty = getMaxQuantity();
    if (newQuantity >= 1 && newQuantity <= maxQty) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (getCurrentStock() === 0) return;
    
    setIsAddingToCart(true);
    
    try {
      // Tạo item để thêm vào giỏ hàng
      const cartItem = {
        product_id: product.id,
        variant_id: selectedVariant?.id || null,
        quantity: quantity,
        price: getCurrentPrice(),
        name: product.name,
        variant_name: selectedVariant?.name || null,
        image: product.image
      };

      // Lấy giỏ hàng hiện tại từ localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItemIndex = existingCart.findIndex((item: any) => 
        item.product_id === cartItem.product_id && 
        item.variant_id === cartItem.variant_id
      );

      if (existingItemIndex >= 0) {
        // Cập nhật số lượng nếu sản phẩm đã có
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Thêm sản phẩm mới
        existingCart.push(cartItem);
      }

      // Lưu vào localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Hiển thị thông báo thành công
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (getCurrentStock() === 0) return;
    
    // Thêm vào giỏ hàng trước
    await handleAddToCart();
    
    // Chuyển đến trang thanh toán
    router.push('/checkout');
  };

  const currentStock = getCurrentStock();
  const maxQuantity = getMaxQuantity();

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
            {selectedVariant ? (
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(selectedVariant.price)}
              </div>
            ) : product.sale_price && product.sale_price < product.price ? (
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
              {currentStock > 0 ? (
                <span className="text-green-600 font-semibold">
                  Còn {currentStock} sản phẩm
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

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Chọn loại hàng:</h3>
              <div className="grid gap-3">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() => variant.stock > 0 && handleVariantSelect(variant)}
                    className={`border rounded-lg p-4 transition-all cursor-pointer ${
                      selectedVariant?.id === variant.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : variant.stock > 0 
                          ? 'border-gray-200 hover:border-blue-300' 
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedVariant?.id === variant.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedVariant?.id === variant.id && (
                              <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900">
                            {variant.name}
                          </h4>
                        </div>
                        {variant.description && (
                          <p className="text-sm text-gray-600 mt-1 ml-6">
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

          {/* Quantity Selection */}
          {currentStock > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Số lượng:</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 h-10 border border-gray-300 rounded-lg text-center"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxQuantity}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-sm text-gray-600">
                  (Tối đa {maxQuantity} sản phẩm)
                </span>
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
              onClick={handleBuyNow}
              disabled={currentStock === 0 || isAddingToCart}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                currentStock > 0 && !isAddingToCart
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAddingToCart ? 'Đang xử lý...' : currentStock > 0 ? 'Mua ngay' : 'Hết hàng'}
            </button>
            
            <button 
              onClick={handleAddToCart}
              disabled={currentStock === 0 || isAddingToCart}
              className={`w-full py-3 px-6 border rounded-lg font-medium transition-colors ${
                currentStock > 0 && !isAddingToCart
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  : 'border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
            </button>
          </div>

          {/* Total Price Display */}
          {quantity > 1 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tổng tiền ({quantity} sản phẩm):</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(getCurrentPrice() * quantity)}
                </span>
              </div>
            </div>
          )}
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