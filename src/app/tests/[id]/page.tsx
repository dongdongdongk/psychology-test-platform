'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import styles from './TestPage.module.scss'

interface TestData {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string
  styleTheme: string
  isActive: boolean
}

export default function TestPage() {
  const params = useParams()
  const testId = params.id as string
  const [testData, setTestData] = useState<TestData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (testId) {
      fetchTestData()
    }
  }, [testId])

  const fetchTestData = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}`)
      if (!response.ok) {
        throw new Error('테스트를 찾을 수 없습니다')
      }
      
      const data = await response.json()
      setTestData(data)
      
      // 테스트의 테마 적용
      setTheme(data.styleTheme || 'modern')
    } catch (err) {
      setError(err instanceof Error ? err.message : '테스트를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>테스트 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !testData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>오류가 발생했습니다</h2>
          <p>{error || '테스트를 찾을 수 없습니다'}</p>
          <Link href="/" className="theme-button">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  if (!testData.isActive) {
    return (
      <div className={styles.container}>
        <div className={styles.inactive}>
          <h2>서비스 준비중</h2>
          <p>이 테스트는 현재 개발 중입니다. 곧 만나보실 수 있어요!</p>
          <Link href="/" className="theme-button">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.testIntro}>
        <div className={styles.header}>
          <div className={styles.category}>{testData.category}</div>
          <h1 className={styles.title}>{testData.title}</h1>
          <p className={styles.description}>{testData.description}</p>
        </div>

        <div className={styles.thumbnail}>
          <img 
            src={testData.thumbnailUrl || '/placeholder-image.jpg'} 
            alt={testData.title}
            className={styles.thumbnailImage}
          />
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>빠른 진단</h3>
            <p>5-10분 내에 완료</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>정확한 분석</h3>
            <p>과학적 근거 기반</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📊</div>
            <h3>상세한 결과</h3>
            <p>맞춤형 피드백 제공</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/tests/${testId}/quiz`} className={styles.startButton}>
            테스트 시작하기
          </Link>
          <Link href="/" className={styles.backButton}>
            다른 테스트 보기
          </Link>
        </div>

        <div className={styles.notice}>
          <p>💡 이 테스트는 자가진단 도구입니다. 전문적인 상담이 필요한 경우 전문가와 상담하세요.</p>
        </div>
      </div>
    </div>
  )
}