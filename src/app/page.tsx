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
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      testUrl: '/tests/stress-test'
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      testUrl: '/tests/personality-test'
    },
    {
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      testUrl: '/tests/mbti-test'
    },
    {
      image: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      testUrl: '/tests/emotional-test'
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
        <div className={styles.mainContainer}>
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
    </main>
  )
}