'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function CallbackHandler() {
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

        // Kiểm tra state để tránh CSRF với fallback
        const savedStateLocal = localStorage.getItem('oauth_state');
        const savedStateSession = sessionStorage.getItem('oauth_state');
        const savedTimestamp = localStorage.getItem('oauth_timestamp');
        
        console.log('🔍 OAuth Callback: Received state:', state);
        console.log('💾 OAuth Callback: localStorage state:', savedStateLocal);
        console.log('📱 OAuth Callback: sessionStorage state:', savedStateSession);
        console.log('⏰ OAuth Callback: Saved timestamp:', savedTimestamp);
        
        // Try to match with either storage
        const stateMatch = state === savedStateLocal || state === savedStateSession;
        
        if (!stateMatch && savedStateLocal === null && savedStateSession === null) {
          // localStorage & sessionStorage both clear - Try to decode and validate state
          try {
            const decodedState = atob(state);
            console.log('🔓 OAuth: Decoded state:', decodedState);
            
            const [stateDomain, stateTimestamp, randomPart] = decodedState.split('_');
            const currentDomain = window.location.hostname;
            const stateAge = Date.now() - parseInt(stateTimestamp);
            
            console.log('🌐 OAuth: State domain:', stateDomain);
            console.log('🌐 OAuth: Current domain:', currentDomain);
            console.log('⏰ OAuth: State age (ms):', stateAge);
            
            // Allow if domain matches and state is recent (within 10 minutes)
            if (stateDomain === currentDomain && stateAge < 600000) {
              console.log('✅ OAuth: State validated via fallback method');
            } else {
              setStatus('error');
              setMessage(`State không hợp lệ\nDomain: ${stateDomain} vs ${currentDomain}\nTuổi: ${Math.round(stateAge/1000)}s`);
              return;
            }
          } catch (e) {
            console.error('❌ OAuth: Cannot decode state:', e);
            setStatus('error');
            setMessage('State không thể giải mã - có thể bị tấn công');
            return;
          }
        } else if (!stateMatch) {
          console.error('❌ OAuth CSRF: State mismatch detected!');
          console.error('  - Received:', state);
          console.error('  - Local:', savedStateLocal);
          console.error('  - Session:', savedStateSession);
          
          setStatus('error');
          setMessage(`State không khớp\nNhận: ${state}\nLocal: ${savedStateLocal}\nSession: ${savedStateSession}`);
          return;
        }
        
        console.log('✅ OAuth: State validation passed');

        // Xử lý authorization code
        const success = await handleCallback(code);
        
        if (success) {
          setStatus('success');
          setMessage('Đăng nhập thành công! Đang chuyển hướng...');
          
          // Dọn dẹp localStorage và sessionStorage
          localStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_state');
          localStorage.removeItem('oauth_timestamp');
          
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

// Loading fallback cho Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Đang tải...
        </h2>
        <p className="text-gray-600">
          Vui lòng chờ trong giây lát...
        </p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackHandler />
    </Suspense>
  );
}