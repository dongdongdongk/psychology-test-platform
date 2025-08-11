'use client'

import { useState, useEffect } from 'react'
import { useHeroSlides } from '@/hooks/useHeroSlides'
import styles from '../app/HomePage.module.scss'

export default function HeroSection() {
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
    <>
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
    </>
  )
}