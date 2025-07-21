import { useMemo } from 'react'
import { ResultData } from '@/hooks/useTestResult'
import { getStressLevel } from '@/utils/scoreCalculator'

export function useResultTitle(resultData: ResultData | null, testId: string): string {
  return useMemo(() => {
    if (!resultData) return '테스트 결과'
    
    // 스트레스 테스트인 경우 총점에 따른 레벨 표시
    if (testId === 'stresscheck001test2025' || resultData.testTitle.includes('스트레스')) {
      return getStressLevel(resultData.totalScore || 0, resultData.maxScore || 100)
    }
    
    // 기본적으로 결과 타입의 제목 사용
    return resultData.title || '테스트 결과'
  }, [resultData, testId])
}