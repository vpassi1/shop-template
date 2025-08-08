'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  balance: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  initiateLogin: () => void;
  handleCallback: (code: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // API base URL - thay đổi theo domain chính của bạn
  const API_BASE = 'https://chommo.store/api';

  useEffect(() => {
    // Kiểm tra token trong localStorage khi component mount
    const savedToken = localStorage.getItem('chommo_token');
    if (savedToken) {
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-token.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setToken(tokenToVerify);
          localStorage.setItem('chommo_token', tokenToVerify);
        } else {
          // Token không hợp lệ
          localStorage.removeItem('chommo_token');
        }
      } else {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem('chommo_token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('chommo_token');
    } finally {
      setLoading(false);
    }
  };

  const initiateLogin = () => {
    // Tạo state để tránh CSRF
    const state = btoa(Math.random().toString(36).substring(2, 15));
    localStorage.setItem('oauth_state', state);
    
    // Lưu current URL để redirect về sau khi login
    const currentUrl = window.location.href;
    localStorage.setItem('pre_login_url', currentUrl);
    
    // Redirect đến trang đăng nhập chính
    const shopId = process.env.NEXT_PUBLIC_SHOP_ID;
    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const authUrl = `https://chommo.store/auth/authorize?` + new URLSearchParams({
      response_type: 'code',
      client_id: shopId!,
      redirect_uri: redirectUrl,
      scope: 'read_user read_balance',
      state: state
    });
    
    window.location.href = authUrl;
  };

  const handleCallback = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/oauth-callback.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code,
          shop_id: process.env.NEXT_PUBLIC_SHOP_ID,
          redirect_uri: `${window.location.origin}/auth/callback`
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('chommo_token', data.token);
        return true;
      } else {
        console.error('OAuth callback failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('chommo_token');
  };

  const refreshUser = async () => {
    if (token) {
      await verifyToken(token);
    }
  };

  const value = {
    user,
    token,
    initiateLogin,
    handleCallback,
    logout,
    loading,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}