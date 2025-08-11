'use client'

import { useState, useEffect } from 'react'
import { Test } from '@/types'
import styles from './HeroSlider.module.scss'

interface HeroSliderProps {
  tests: Test[]
}

export default function HeroSlider({ tests }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // 활성화된 테스트만 슬라이드로 사용 (최대 5개)
  const slideTests = tests.filter(test => test.isActive).slice(0, 5)

  // 5초마다 자동 슬라이드
  useEffect(() => {
    if (slideTests.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideTests.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [slideTests.length])

  // 슬라이드 클릭 시 테스트로 이동
  const handleSlideClick = (testId: string) => {
    window.location.href = `/tests/${testId}`
  }

  if (slideTests.length === 0) {
    return (
      <div className={styles.noSlides}>
        <div className={styles.placeholder}>
          <h3>곧 새로운 심리테스트가 준비됩니다!</h3>
          <p>다양하고 흥미로운 테스트들을 만나보세요</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 슬라이드 컨테이너 */}
      <div className={styles.heroSlideContainer}>
        {slideTests.map((test, index) => (
          <div
            key={test.id}
            className={`${styles.heroSlide} ${
              index === currentSlide ? styles.active : ''
            }`}
            style={{ 
              backgroundImage: `url(${test.thumbnailUrl || '/placeholder-image.jpg'})`,
              transform: `translateX(${(index - currentSlide) * 100}%)`
            }}
            onClick={() => handleSlideClick(test.id)}
            title={test.title}
          >
            <div className={styles.slideContent}>
              <h3 className={styles.slideTitle}>{test.title}</h3>
              {test.description && (
                <p className={styles.slideDescription}>{test.description}</p>
              )}
            </div>
          </div>
        ))}
        
        {/* 슬라이드 아이콘 */}
        <img 
          src="/images/NewIcon.png" 
          alt="New Icon" 
          className={styles.slideIcon}
        />
      </div>
      
      {/* 슬라이드 인디케이터 */}
      {slideTests.length > 1 && (
        <div className={styles.slideIndicators}>
          {slideTests.map((_, index) => (
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
      )}
    </>
  )
}