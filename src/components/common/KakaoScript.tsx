'use client';

import Script from 'next/script';

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any;
  }
}

export default function KakaoScript() {
  const handleKakaoLoad = () => {
    console.log('✅ 카카오 SDK 스크립트 로드 완료');
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY;
      if (KAKAO_KEY) {
        try {
          window.Kakao.init(KAKAO_KEY);
          console.log('✅ 카카오 SDK 자동 초기화 완료');
        } catch (error) {
          console.error('❌ 카카오 SDK 자동 초기화 실패:', error);
        }
      } else {
        console.warn('⚠️ NEXT_PUBLIC_KAKAO_KEY가 설정되지 않았습니다');
      }
    }
  };

  const handleKakaoError = (error: any) => {
    console.error('❌ 카카오 SDK 스크립트 로드 실패:', error);
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
      integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
      crossOrigin="anonymous"
      strategy="beforeInteractive"
      onLoad={handleKakaoLoad}
      onError={handleKakaoError}
    />
  );
}