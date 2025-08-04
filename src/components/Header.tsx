'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getShopInfo } from '@/lib/api';
import type { Shop } from '@/types/shop';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';

export default function Header() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopData = await getShopInfo();
        setShop(shopData);
      } catch (error) {
        console.error('Error fetching shop info:', error);
      }
    };

    fetchShop();
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {shop?.logo && (
                <img 
                  src={shop.logo} 
                  alt={shop.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <span className="text-xl font-bold text-gray-900">
                {shop?.name || 'Gian Hàng Premium'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Sản phẩm
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Giới thiệu
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Liên hệ
            </Link>
            
            {/* Auth Section */}
            {loading ? (
              <div className="text-gray-500">...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.avatar && (
                    <img 
                      src={user.avatar} 
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user.full_name}</div>
                    <div className="text-green-600 font-semibold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(user.balance)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Trang chủ
              </Link>
              <Link href="/products" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Sản phẩm
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Giới thiệu
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Liên hệ
              </Link>
              
              {/* Mobile Auth */}
              {user ? (
                <div className="px-3 py-2 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={user.full_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{user.full_name}</div>
                      <div className="text-green-600 font-semibold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(user.balance)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 border-t">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đăng nhập
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          setIsMenuOpen(false);
        }}
      />
    </header>
  );
}