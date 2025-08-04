'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });
  
  const { user, refreshUser } = useAuth();

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

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const processPayment = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const totalAmount = getTotalPrice();
    
    if (user.balance < totalAmount) {
      alert(`Số dư không đủ! Bạn cần ${formatPrice(totalAmount - user.balance)} nữa để thanh toán.`);
      return;
    }

    setProcessing(true);

    try {
      // Lấy subdomain hiện tại
      const subdomain = window.location.hostname.split('.')[0];
      
      const response = await fetch('https://chommo.store/api/payment/process-payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('chommo_token')}`
        },
        body: JSON.stringify({
          amount: totalAmount,
          subdomain: subdomain,
          items: cartItems,
          customer_info: customerInfo
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Thanh toán thành công
        alert(`Thanh toán thành công! Mã đơn hàng: ${data.order_id}`);
        
        // Xóa giỏ hàng
        localStorage.removeItem('cart');
        
        // Cập nhật thông tin user (số dư mới)
        await refreshUser();
        
        // Chuyển về trang chủ
        router.push('/');
      } else {
        alert(data.error || 'Có lỗi xảy ra khi thanh toán!');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra khi kết nối đến server thanh toán!');
    } finally {
      setProcessing(false);
    }
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
            {user ? (
              <div className="space-y-2">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>Số dư hiện tại:</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(user.balance)}
                    </span>
                  </div>
                  {user.balance < getTotalPrice() && (
                    <div className="text-red-600 text-sm mt-1">
                      ⚠️ Số dư không đủ để thanh toán
                    </div>
                  )}
                </div>
                <button 
                  onClick={processPayment}
                  disabled={processing || user.balance < getTotalPrice()}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    processing || user.balance < getTotalPrice()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {processing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Đăng nhập để thanh toán
              </button>
            )}
            
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
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
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
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
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
                  value={customerInfo.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú thêm (tùy chọn)"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
    </div>
  );
}