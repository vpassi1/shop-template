'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getShopInfo } from '@/lib/api';
import type { Shop } from '@/types/shop';
import { useAuth } from '@/contexts/AuthContext';
import AuthButton from './AuthButton';

export default function Header() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

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
            
            <AuthButton />
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
              
              <div className="px-3 py-2 border-t">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>

    </header>
  );
}