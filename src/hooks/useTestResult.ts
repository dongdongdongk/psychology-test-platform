import { useState, useEffect } from 'react'
import { useTheme } from '@/hooks/useTheme'

export interface DetailedScores {
  cognitive: number
  emotional: number
  physical: number
  behavioral: number
  total: number
  maxTotal: number
  cognitivePercent: number
  emotionalPercent: number
  physicalPercent: number
  behavioralPercent: number
  // 재정 테스트용 ABCD 점수 필드 추가
  A?: number
  B?: number
  C?: number
  D?: number
}

export interface ResultData {
  id: string
  type: string
  title: string
  description: string
  imageUrl: string
  textImageUrl?: string
  testTitle: string
  thumbnailUrl?: string // 테스트 썸네일 URL 추가
  styleTheme: string
  enableRadarChart: boolean
  enableBarChart: boolean
  showResultImage: boolean
  showTextImage: boolean
  totalScore: number
  maxScore: number
  detailedScores?: DetailedScores
  resultTypes?: any // result_types JSONB 데이터
  resultType?: string // 개별 결과 타입 (A, B, C, D 등)
}

export function useTestResult(testId: string, resultType: string, responseId?: string) {
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (testId && resultType) {
      fetchResultData()
    }
  }, [testId, resultType, responseId])

  const fetchResultData = async () => {
    try {
      let response: Response
      
      // responseId가 있으면 API에서 해당 응답 데이터로 계산
      if (responseId) {
        response = await fetch(`/api/tests/${testId}/result/${resultType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responseId: responseId
          })
        })
      } else {
        // responseId가 없으면 localStorage에서 데이터 가져와서 전송 (백업)
        const responseData = localStorage.getItem('testResponses') || localStorage.getItem('stressTestResponses')
        let parsedResponseData = null
        
        if (responseData) {
          try {
            parsedResponseData = JSON.parse(responseData)
          } catch (e) {
            console.error('응답 데이터 파싱 오류:', e)
          }
        }

        response = await fetch(`/api/tests/${testId}/result/${resultType}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responseData: parsedResponseData
          })
        })
      }
      
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

  return {
    resultData,
    loading,
    error,
    refetch: fetchResultData
  }
}