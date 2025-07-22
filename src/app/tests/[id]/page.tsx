'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import Header from '@/components/common/Header'
import PageLoader from '@/components/common/PageLoader'
import styles from './TestPage.module.scss'

interface TestData {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string
  detailImageUrl: string
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
    return <PageLoader type="loading" message="테스트 정보를 불러오는 중..." />
  }

  if (error || !testData) {
    return (
      <PageLoader 
        type="error" 
        title="테스트를 찾을 수 없습니다"
        message={error || '요청하신 테스트가 존재하지 않습니다'}
      />
    )
  }

  if (!testData.isActive) {
    return <PageLoader type="inactive" />
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.testIntro}>
          <div className={styles.detailImage}>
            <img 
              src={testData.detailImageUrl || testData.thumbnailUrl || '/placeholder-image.jpg'} 
              alt={testData.title}
              className={styles.detailImagePhoto}
            />
          </div>

          <div className={styles.testDescription}>
            <h1 className={styles.testTitle}>{testData.title}</h1>
            <p className={styles.testDescriptionText}>{testData.description}</p>
          </div>

          <div className={styles.actions}>
            <Link href={`/tests/${testId}/quiz`} className={styles.startButton}>
              테스트 시작하기
            </Link>
            <Link href="/" className={styles.backButton}>
              다른 테스트 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}