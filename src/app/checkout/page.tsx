'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  product_id: number;
  variant_id?: number;
  quantity: number;
  price: number;
  name: string;
  variant_name?: string;
  image?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setLoading(false);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleClearCart = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
          <p className="text-gray-600">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <button
            onClick={handleContinueShopping}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm trong giỏ hàng</h2>
          
          {cartItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 flex items-center space-x-4">
              <img
                src={item.image || '/images/default-product.jpg'}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                {item.variant_name && (
                  <p className="text-sm text-gray-600">Loại: {item.variant_name}</p>
                )}
                <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatPrice(item.price)}</div>
                <div className="text-sm text-gray-600">
                  Tổng: {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Đặt hàng ngay
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="w-full border border-gray-300 py-3 px-6 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
            
            <button
              onClick={handleClearCart}
              className="w-full text-red-600 py-2 px-4 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Xóa giỏ hàng
            </button>
          </div>

          {/* Customer Info Form */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập họ và tên"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập email (tùy chọn)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú thêm (tùy chọn)"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}