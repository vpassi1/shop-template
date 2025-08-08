'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthButton() {
  const { user, logout, loading, initiateLogin } = useAuth();

  if (loading) {
    return (
      <div className="text-gray-500 text-sm">
        Đang tải...
      </div>
    );
  }

  if (user) {
    return (
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
    );
  }

  return (
    <button
      onClick={initiateLogin}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span>Đăng nhập với Chommo.Store</span>
    </button>
  );
}