'use client'

import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/common/Header'
import PageLoader from '@/components/common/PageLoader'
import SocialShareButtons from '@/components/common/SocialShareButtons'
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

  // 공유 카운트 증가 API 호출을 위한 함수
  const updateShareCount = async () => {
    try {
      await fetch(`/api/tests/${testId}/share`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('공유 카운트 업데이트 실패:', error)
    }
  }

  if (loading) {
    return <PageLoader type="loading" message="결과를 분석하는 중..." />
  }

  if (error || !resultData) {
    return (
      <PageLoader 
        type="error" 
        title="결과를 불러올 수 없습니다"
        message={error || '테스트 결과를 가져오는데 실패했습니다'}
      />
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

          {/* 새로운 소셜 공유 버튼들 */}
          <SocialShareButtons
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={`${resultData.testTitle} 결과`}
            description={`나의 ${resultData.testTitle} 결과: ${resultData.title}`}
            imageUrl={resultData.imageUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/icon.png`}
            onShare={updateShareCount}
          />

          <div className={styles.actions}>
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