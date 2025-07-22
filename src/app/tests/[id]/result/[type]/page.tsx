'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/common/Header'
import { useTestResult } from '@/hooks/useTestResult'
import { useResultTitle } from '@/hooks/useResultTitle'
import { shouldShowTitle } from '@/lib/testConfig'
import ResultImages from '@/components/result/ResultImages'
import RadarChartSection from '@/components/result/RadarChartSection'
import BarChartSection from '@/components/result/BarChartSection'
import StressTestExtras from '@/components/result/extras/StressTestExtras'
import ValuesTestExtras from '@/components/result/extras/ValuesTestExtras'
import FinanceTestExtras from '@/components/result/extras/FinanceTestExtras'
import styles from './ResultPage.module.scss'

export default function ResultPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const testId = params.id as string
  const resultType = params.type as string
  const responseId = searchParams.get('responseId') || undefined
  
  const { resultData, loading, error } = useTestResult(testId, resultType, responseId)
  const resultTitle = useResultTitle(resultData, testId)

  const shareResult = async () => {
    if (!resultData) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resultData.testTitle} 결과`,
          text: `나의 ${resultData.testTitle} 결과: ${resultData.title}`,
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
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>결과를 분석하는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !resultData) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>오류가 발생했습니다</h2>
            <p>{error || '결과를 불러올 수 없습니다'}</p>
            <Link href="/" className="theme-button">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          {/* 테스트 설정에 따라 제목 표시 여부 결정 */}
          {shouldShowTitle(testId) && (
            <h1 className={styles.title}>{resultTitle}</h1>
          )}
          
          <BarChartSection 
            resultData={resultData} 
            testId={testId} 
          />
          <ResultImages resultData={resultData} />
          
          <RadarChartSection 
            resultData={resultData} 
            testId={testId} 
          />

          {/* 테스트별 특화 컨텐츠 */}
          {/* {testId === 'stresscheck001test2025' && (
            <StressTestExtras resultData={resultData} />
          )} */}
          
          {/* {testId === 'valuetest2025' && (
            <ValuesTestExtras resultData={resultData} />
          )} */}
          
          {testId === 'cmd9un7aq0006ut7b7p9s40q0' && (
            <FinanceTestExtras resultData={resultData} />
          )}

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
        </div>
      </div>
    </div>
  )
}