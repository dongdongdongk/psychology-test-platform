'use client'

import { Suspense, useState, useEffect } from 'react'
import Header from '@/components/common/Header'
import TestList from '@/components/TestList'
import { useHeroSlides } from '@/hooks/useHeroSlides'
import styles from './HomePage.module.scss'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { slides: heroSlides, loading: slidesLoading, error: slidesError } = useHeroSlides()

  // 5초마다 자동 슬라이드
  useEffect(() => {
    if (heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [heroSlides.length])

  // 슬라이드 클릭 시 테스트로 이동
  const handleSlideClick = (testUrl: string) => {
    window.location.href = testUrl
  }
  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.heroSection}>
            <div className={styles.heroContainer}>
              {/* 슬라이드 로딩 상태 */}
              {slidesLoading ? (
                <div className={styles.slidesLoading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>슬라이드를 불러오는 중...</p>
                </div>
              ) : slidesError ? (
                <div className={styles.slidesError}>
                  <p>슬라이드를 불러오는데 실패했습니다</p>
                </div>
              ) : (
                <>
                  {/* 슬라이드 컨테이너 */}
                  <div className={styles.heroSlideContainer}>
                    {heroSlides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`${styles.heroSlide} ${
                          index === currentSlide ? styles.active : ''
                        }`}
                        style={{ 
                          backgroundImage: `url(${slide.thumbnailUrl})`,
                          transform: `translateX(${(index - currentSlide) * 100}%)`
                        }}
                        onClick={() => handleSlideClick(slide.testUrl)}
                        title={slide.title}
                      />
                    ))}
                    
                    {/* 슬라이드 아이콘 */}
                    <img 
                      src="/images/NewIcon.png" 
                      alt="New Icon" 
                      className={styles.slideIcon}
                    />
                  </div>
                  
                  {/* 슬라이드 인디케이터 */}
                  <div className={styles.slideIndicators}>
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.indicator} ${
                          index === currentSlide ? styles.active : ''
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`슬라이드 ${index + 1}로 이동`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className={styles.mainContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>루노 심리 테스트</h2>
              <p className={styles.sectionDescription}>“1분이면 충분해요. 무료 심리테스트로 하루에 소소한 의미를 더해보세요.”</p>
            </div>
            <Suspense fallback={
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <p>테스트 목록을 불러오는 중...</p>
              </div>
            }>
              <TestList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  )
}