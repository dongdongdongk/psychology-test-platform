import { useState, useEffect } from 'react'
import axios from 'axios'

export interface HeroSlide {
  id: string
  title: string
  thumbnailUrl: string
  testUrl: string
}

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get('/api/tests')
        const tests = response.data
        
        // 최신 4개 테스트만 슬라이드로 사용
        const recentTests = tests.slice(0, 4)
        
        const heroSlides: HeroSlide[] = recentTests.map((test: any) => ({
          id: test.id,
          title: test.title,
          thumbnailUrl: test.thumbnailUrl || '/images/default-thumbnail.png', // 기본 이미지 fallback
          testUrl: `/tests/${test.id}`
        }))
        
        setSlides(heroSlides)
      } catch (err) {
        console.error('Error fetching hero slides:', err)
        setError('슬라이드를 불러오는데 실패했습니다')
        
        // 에러 발생 시 기본 슬라이드 사용
        setSlides([
          {
            id: 'default-1',
            title: '스트레스 테스트',
            thumbnailUrl: '/images/lunchSum.png',
            testUrl: '/tests/stress-test'
          },
          {
            id: 'default-2', 
            title: '데모 테스트 1',
            thumbnailUrl: '/images/DemoSum1.png',
            testUrl: '/tests/stress-test'
          },
          {
            id: 'default-3',
            title: '데모 테스트 2', 
            thumbnailUrl: '/images/DemoSum2.png',
            testUrl: '/tests/stress-test'
          },
          {
            id: 'default-4',
            title: '데모 테스트 3',
            thumbnailUrl: '/images/DemoSum3.png', 
            testUrl: '/tests/stress-test'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  return { slides, loading, error }
}