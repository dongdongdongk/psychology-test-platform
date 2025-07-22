'use client';

import { useEffect, useState } from 'react';
import styles from './SocialShareButtons.module.scss';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  onShare?: () => Promise<void> | void;
}

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function SocialShareButtons({ 
  url, 
  title, 
  description, 
  imageUrl,
  onShare
}: SocialShareButtonsProps) {
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);

  useEffect(() => {
    // 카카오 SDK 상태 확인 및 수동 초기화 시도
    if (typeof window !== 'undefined') {
      console.log('🔍 카카오 SDK 상태 확인:');
      console.log('- window.Kakao 존재:', !!window.Kakao);
      console.log('- Kakao 초기화됨:', window.Kakao?.isInitialized?.());
      console.log('- 현재 도메인:', window.location.hostname);
      
      if (window.Kakao?.isInitialized?.()) {
        setIsKakaoInitialized(true);
        console.log('✅ 카카오 SDK 사용 가능');
      } else if (window.Kakao) {
        // SDK는 로드되었지만 초기화되지 않은 경우 수동 초기화 시도
        console.log('🔧 카카오 SDK 수동 초기화 시도');
        const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY || 'db6a0626702613f3bd014a0cf06a12a5';
        try {
          window.Kakao.init(KAKAO_KEY);
          console.log('✅ 카카오 SDK 수동 초기화 성공');
          setIsKakaoInitialized(true);
        } catch (error) {
          console.error('❌ 카카오 SDK 수동 초기화 실패:', error);
          // 재시도
          setTimeout(() => {
            try {
              if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init(KAKAO_KEY);
                console.log('✅ 카카오 SDK 지연 초기화 성공');
                setIsKakaoInitialized(true);
              }
            } catch (retryError) {
              console.error('❌ 카카오 SDK 재시도 실패:', retryError);
            }
          }, 1000);
        }
      } else {
        console.log('⏳ 카카오 SDK 아직 로드되지 않음 - 잠시 후 재시도');
        // 1초 후 재시도 (스크립트 로딩 대기)
        setTimeout(() => {
          if (window.Kakao?.isInitialized?.()) {
            setIsKakaoInitialized(true);
            console.log('✅ 카카오 SDK 지연 로딩 완료');
          } else if (window.Kakao) {
            // 로드되었지만 초기화 안됨
            const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY || 'db6a0626702613f3bd014a0cf06a12a5';
            try {
              window.Kakao.init(KAKAO_KEY);
              console.log('✅ 카카오 SDK 지연 초기화 성공');
              setIsKakaoInitialized(true);
            } catch (error) {
              console.error('❌ 카카오 SDK 지연 초기화 실패:', error);
            }
          } else {
            console.warn('❌ 카카오 SDK 사용 불가 - 폴백 모드');
          }
        }, 1000);
      }
    }
  }, []);

  // 카카오톡 공유
  const shareToKakao = async () => {
    console.log('🚀 공유 버튼 클릭됨');
    console.log('- isKakaoInitialized:', isKakaoInitialized);
    console.log('- window.Kakao 존재:', !!window.Kakao);
    
    if (!isKakaoInitialized || !window.Kakao) {
      console.log('🔄 카카오 SDK 없음 - 폴백 실행');
      // 사용자 제스처를 유지하기 위해 비동기 작업 전에 공유 실행
      shareNative();
      
      // 공유 카운트는 백그라운드에서 비동기 실행
      if (onShare) {
        Promise.resolve(onShare()).catch(console.error);
      }
      return;
    }

    try {
      console.log('📤 카카오톡 공유 시도 중...');
      
      // 임시 버튼 생성하여 즉시 클릭하는 방식
      const tempButtonId = 'temp-kakao-share-btn-' + Date.now();
      const tempButton = document.createElement('div');
      tempButton.id = tempButtonId;
      tempButton.style.display = 'none';
      document.body.appendChild(tempButton);
      
      // 카카오톡 공유 콘텐츠 설정
      const shareContent: any = {
        title: title,
        description: description,
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      };

      // 이미지가 있고 유효할 때만 imageUrl 속성 추가
      if (imageUrl && imageUrl.trim() && !imageUrl.includes('/icon.png')) {
        shareContent.imageUrl = imageUrl;
      }

      window.Kakao.Share.createDefaultButton({
        container: '#' + tempButtonId,
        objectType: 'feed',
        content: shareContent,
        buttons: [
          {
            title: '테스트하러 가기',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
      
      // 임시 버튼 클릭으로 공유 실행
      tempButton.click();
      
      // 임시 버튼 정리
      setTimeout(() => {
        document.body.removeChild(tempButton);
      }, 100);
      
      console.log('✅ 카카오톡 공유 성공');
      
      // 성공 시에만 공유 카운트 증가
      if (onShare) {
        Promise.resolve(onShare()).catch(console.error);
      }
    } catch (error) {
      console.error('❌ 카카오톡 공유 실패:', error);
      // 실패 시 폴백
      shareNative();
      
      // 공유 카운트는 백그라운드에서 비동기 실행
      if (onShare) {
        Promise.resolve(onShare()).catch(console.error);
      }
    }
  };

  // Web Share API 또는 클립보드 복사 (폴백)
  const shareNative = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(`${title}\n${description}\n${url}`);
        alert('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.error('공유 실패:', error);
      // 최후의 수단
      const textToCopy = `${title}\n${description}\n${url}`;
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  // 페이스북 공유
  const shareToFacebook = async () => {
    // 공유 카운트 증가 (백그라운드)
    if (onShare) {
      Promise.resolve(onShare()).catch(console.error);
    }
    
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // X (트위터) 공유
  const shareToTwitter = async () => {
    // 공유 카운트 증가 (백그라운드)
    if (onShare) {
      Promise.resolve(onShare()).catch(console.error);
    }
    
    const text = `${title}\n${description}`;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // 인스타그램 공유 (모바일에서만 동작)
  const shareToInstagram = async () => {
    // 공유 카운트 증가 (백그라운드)
    if (onShare) {
      Promise.resolve(onShare()).catch(console.error);
    }
    
    // 인스타그램은 직접 링크 공유가 불가능하므로 클립보드 복사 후 안내
    try {
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다! 인스타그램 앱에서 붙여넣기 해주세요.');
    } catch (error) {
      // 클립보드 복사 실패시 수동 복사 안내
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('링크가 복사되었습니다! 인스타그램 앱에서 붙여넣기 해주세요.');
    }
  };

  return (
    <div className={styles.shareContainer}>
      {/* 메인 공유 버튼 - 카카오톡 */}
      <button 
        className={styles.mainShareButton}
        onClick={shareToKakao}
        aria-label="카카오톡으로 공유하기"
      >
        <span className={styles.kakaoIcon}>💬</span>
        결과 공유하기
      </button>

      {/* SNS 아이콘들 */}
      <div className={styles.snsIcons}>
        <button 
          className={`${styles.snsButton} ${styles.instagram}`}
          onClick={shareToInstagram}
          aria-label="인스타그램에 공유하기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </button>

        <button 
          className={`${styles.snsButton} ${styles.facebook}`}
          onClick={shareToFacebook}
          aria-label="페이스북에 공유하기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        <button 
          className={`${styles.snsButton} ${styles.twitter}`}
          onClick={shareToTwitter}
          aria-label="X(트위터)에 공유하기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}