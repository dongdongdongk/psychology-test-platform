import { useMemo } from 'react'
import { RadarData } from '@/components/ui/RadarChart'
import { ResultData } from '@/hooks/useTestResult'
import { calculateStressScores } from '@/utils/scoreCalculator'

export function useRadarChart(resultData: ResultData | null, testId: string) {
  const radarData = useMemo((): RadarData[] => {
    if (!resultData) return []
    
    // 스트레스 테스트인 경우 실제 계산 로직 적용
    if (testId === 'stresscheck001test2025' || resultData.testTitle.includes('스트레스')) {
      return generateStressRadarData(resultData)
    }
    
    // 다른 테스트는 기존 방식 유지 (향후 확장 가능)
    return generateGenericRadarData(resultData)
  }, [resultData, testId])

  return radarData
}

/**
 * 스트레스 테스트 전용 레이더 차트 데이터 생성
 */
function generateStressRadarData(resultData: ResultData): RadarData[] {
  // API에서 받은 detailedScores 사용
  if (resultData.detailedScores) {
    const scores = resultData.detailedScores
    return [
      {
        subject: '인지적 스트레스',
        score: scores.cognitivePercent,
        fullMark: 100
      },
      {
        subject: '정서적 스트레스',
        score: scores.emotionalPercent,
        fullMark: 100
      },
      {
        subject: '신체적 스트레스',
        score: scores.physicalPercent,
        fullMark: 100
      },
      {
        subject: '행동적 스트레스',
        score: scores.behavioralPercent,
        fullMark: 100
      }
    ]
  }
  
  // 백업: localStorage에서 계산 (API 데이터가 없을 경우)
  const responseData = localStorage.getItem('stressTestResponses')
  let scores = { A: 0, B: 0, C: 0, D: 0 }
  
  if (responseData) {
    try {
      const responses = JSON.parse(responseData)
      scores = calculateStressScores(responses)
    } catch (e) {
      console.error('응답 데이터 파싱 오류:', e)
    }
  }
  
  return [
    {
      subject: '인지적 스트레스',
      score: Math.round((scores.A / 25) * 100),
      fullMark: 100
    },
    {
      subject: '정서적 스트레스',
      score: Math.round((scores.B / 25) * 100),
      fullMark: 100
    },
    {
      subject: '신체적 스트레스',
      score: Math.round((scores.C / 25) * 100),
      fullMark: 100
    },
    {
      subject: '행동적 스트레스',
      score: Math.round((scores.D / 25) * 100),
      fullMark: 100
    }
  ]
}

/**
 * 일반 테스트용 레이더 차트 데이터 생성
 */
function generateGenericRadarData(resultData: ResultData): RadarData[] {
  const baseScore = (resultData.totalScore || 50) / (resultData.maxScore || 100) * 100
  
  return [
    {
      subject: '영역 1',
      score: Math.min(100, Math.max(0, baseScore + Math.random() * 20 - 10)),
      fullMark: 100
    },
    {
      subject: '영역 2', 
      score: Math.min(100, Math.max(0, baseScore + Math.random() * 20 - 10)),
      fullMark: 100
    },
    {
      subject: '영역 3',
      score: Math.min(100, Math.max(0, baseScore + Math.random() * 20 - 10)),
      fullMark: 100
    },
    {
      subject: '영역 4',
      score: Math.min(100, Math.max(0, baseScore + Math.random() * 20 - 10)),
      fullMark: 100
    }
  ]
}