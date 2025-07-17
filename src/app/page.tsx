'use client'

import { Suspense, useState, useEffect } from 'react'
import Header from '@/components/common/Header'
import TestList from '@/components/TestList'
import styles from './HomePage.module.scss'

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // 슬라이드 이미지와 테스트 정보 배열
  const heroSlides = [
    {
      image: '/images/lunchSum.png',
      testUrl: '/tests/stress-test'
    },
    {
      image: '/images/DemoSum1.png',
      testUrl: '/tests/stress-test'
    },
    {
      image: '/images/DemoSum2.png',
      testUrl: '/tests/stress-test'
    },
    {
      image: '/images/DemoSum3.png',
      testUrl: '/tests/stress-test'
    }
  ]


  // 5초마다 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
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
              {/* 슬라이드 컨테이너 */}
              <div className={styles.heroSlideContainer}>
                {heroSlides.map((slide, index) => (
                  <div
                    key={index}
                    className={`${styles.heroSlide} ${
                      index === currentSlide ? styles.active : ''
                    }`}
                    style={{ 
                      backgroundImage: `url(${slide.image})`,
                      transform: `translateX(${(index - currentSlide) * 100}%)`
                    }}
                    onClick={() => handleSlideClick(slide.testUrl)}
                  />
                ))}
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
            </div>
          </div>
          
          <div className={styles.mainContent}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>심리 테스트 컬렉션</h2>
              <p className={styles.sectionDescription}>과학적으로 검증된 심리 테스트로 나의 숨겨진 성격을 발견해보세요</p>
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