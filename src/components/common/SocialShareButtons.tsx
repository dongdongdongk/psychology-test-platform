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
    // 카카오 SDK 초기화
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      // TODO: 실제 카카오 JavaScript 키로 교체 필요
      const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY || 'YOUR_KAKAO_KEY';
      if (KAKAO_KEY !== 'YOUR_KAKAO_KEY') {
        window.Kakao.init(KAKAO_KEY);
        setIsKakaoInitialized(true);
      }
    }
  }, []);

  // 카카오톡 공유
  const shareToKakao = async () => {
    // 공유 카운트 증가
    if (onShare) {
      await onShare();
    }

    if (!isKakaoInitialized || !window.Kakao) {
      // 카카오 SDK가 없을 경우 폴백 - Web Share API 또는 클립보드 복사
      shareNative();
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: imageUrl || `${window.location.origin}/icon.png`,
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
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
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      // 실패 시 폴백
      shareNative();
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
  const shareToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // X (트위터) 공유
  const shareToTwitter = () => {
    const text = `${title}\n${description}`;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // 인스타그램 공유 (모바일에서만 동작)
  const shareToInstagram = () => {
    // 인스타그램은 직접 링크 공유가 불가능하므로 클립보드 복사 후 안내
    navigator.clipboard.writeText(url).then(() => {
      alert('링크가 복사되었습니다! 인스타그램 앱에서 붙여넣기 해주세요.');
    }).catch(() => {
      alert('인스타그램 앱에서 직접 공유해주세요: ' + url);
    });
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