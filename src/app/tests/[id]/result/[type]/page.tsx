'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/hooks/useTheme'
import styles from './ResultPage.module.scss'

interface ResultData {
  id: string
  type: string
  title: string
  description: string
  imageUrl: string
  testTitle: string
  styleTheme: string
  totalScore: number
  maxScore: number
}

export default function ResultPage() {
  const params = useParams()
  const testId = params.id as string
  const resultType = params.type as string
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (testId && resultType) {
      fetchResultData()
    }
  }, [testId, resultType])

  const fetchResultData = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/result/${resultType}`)
      if (!response.ok) {
        throw new Error('결과를 불러올 수 없습니다')
      }
      
      const data = await response.json()
      setResultData(data)
      setTheme(data.styleTheme || 'modern')
    } catch (err) {
      setError(err instanceof Error ? err.message : '결과를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resultData?.testTitle} 결과`,
          text: `나의 ${resultData?.testTitle} 결과: ${resultData?.title}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('공유 취소됨')
      }
    } else {
      // 클립보드 복사
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('링크가 클립보드에 복사되었습니다!')
      } catch (err) {
        console.error('클립보드 복사 실패:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>결과를 분석하는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !resultData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>오류가 발생했습니다</h2>
          <p>{error || '결과를 불러올 수 없습니다'}</p>
          <Link href="/" className="theme-button">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  const scorePercentage = (resultData.totalScore / resultData.maxScore) * 100

  return (
    <div className={styles.container}>
      <div className={styles.resultContainer}>
        <div className={styles.header}>
          <div className={styles.badge}>테스트 완료</div>
          <h1 className={styles.testTitle}>{resultData.testTitle}</h1>
          <div className={styles.resultTitle}>{resultData.title}</div>
        </div>

        <div className={styles.imageContainer}>
          <img 
            src={resultData.imageUrl || '/placeholder-result.jpg'} 
            alt={resultData.title}
            className={styles.resultImage}
          />
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.scoreTitle}>전체 점수</div>
          <div className={styles.scoreDisplay}>
            <div className={styles.scoreNumber}>
              {resultData.totalScore} / {resultData.maxScore}
            </div>
            <div className={styles.scoreBar}>
              <div 
                className={styles.scoreProgress}
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
            <div className={styles.scorePercentage}>
              {Math.round(scorePercentage)}%
            </div>
          </div>
        </div>

        <div className={styles.description}>
          <h2>결과 해석</h2>
          <div className={styles.descriptionContent}>
            {resultData.description.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={shareResult} className={styles.shareButton}>
            결과 공유하기
          </button>
          <Link href={`/tests/${testId}`} className={styles.retryButton}>
            다시 테스트하기
          </Link>
          <Link href="/" className={styles.homeButton}>
            다른 테스트 보기
          </Link>
        </div>

        <div className={styles.disclaimer}>
          <p>💡 이 결과는 참고용입니다. 전문적인 상담이 필요한 경우 전문가와 상담하세요.</p>
        </div>
      </div>
    </div>
  )
}