'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        // Kiểm tra lỗi từ authorization server
        if (error) {
          setStatus('error');
          setMessage(`Lỗi đăng nhập: ${error}`);
          return;
        }

        // Kiểm tra code và state
        if (!code || !state) {
          setStatus('error');
          setMessage('Thiếu thông tin ủy quyền');
          return;
        }

        // Kiểm tra state để tránh CSRF
        const savedState = localStorage.getItem('oauth_state');
        if (state !== savedState) {
          setStatus('error');
          setMessage('State không khớp - có thể bị tấn công CSRF');
          return;
        }

        // Xử lý authorization code
        const success = await handleCallback(code);
        
        if (success) {
          setStatus('success');
          setMessage('Đăng nhập thành công! Đang chuyển hướng...');
          
          // Dọn dẹp localStorage
          localStorage.removeItem('oauth_state');
          
          // Redirect về trang trước khi login hoặc trang chủ
          setTimeout(() => {
            const preLoginUrl = localStorage.getItem('pre_login_url');
            localStorage.removeItem('pre_login_url');
            router.push(preLoginUrl || '/');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Không thể đăng nhập. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xử lý đăng nhập');
      }
    };

    processCallback();
  }, [searchParams, handleCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Đang xử lý đăng nhập
            </h2>
            <p className="text-gray-600">
              Vui lòng chờ trong giây lát...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {message}
            </h2>
            <p className="text-gray-600">
              Bạn sẽ được chuyển hướng về trang trước đó
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">⚠</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Lỗi đăng nhập
            </h2>
            <p className="text-red-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay về trang chủ
            </button>
          </>
        )}
      </div>
    </div>
  );
}