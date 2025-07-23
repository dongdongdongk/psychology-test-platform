import { prisma } from '@/lib/prisma'
import { calculateStressDetailedScores, calculateGeneralScore, calculateGeneralDetailedScores } from '@/utils/scoreCalculator'

interface CacheableResult {
  totalScore?: number
  resultType: string
  detailedScores?: Record<string, any>
  enableRadarChart?: boolean
  enableBarChart?: boolean
  testTitle?: string
  testId: string
  responseId: string
  [key: string]: any // 인덱스 시그니처 추가로 Prisma JSON 타입과 호환
}

export async function cacheTestResult(
  responseId: string,
  testId: string,
  responseData: any,
  testData: any,
  resultType: string
): Promise<CacheableResult> {
  // 1. 결과 계산 수행
  let totalScore: number | undefined
  let detailedScores: any

  const isStressTest = (testId: string, testTitle: string) => {
    return testId === 'stress-test' || testTitle?.includes('스트레스')
  }

  if (isStressTest(testId, testData.title)) {
    detailedScores = calculateStressDetailedScores(responseData, testData, testId)
  } else {
    totalScore = calculateGeneralScore(responseData, resultType)
    detailedScores = calculateGeneralDetailedScores(responseData)
  }

  // 2. 캐시할 결과 데이터 구성
  const cachedResult: CacheableResult = {
    totalScore,
    resultType,
    detailedScores,
    enableRadarChart: testData.enableRadarChart,
    enableBarChart: testData.enableBarChart,
    testTitle: testData.title,
    testId,
    responseId
  }

  // 3. DB에 캐시된 결과 저장
  await prisma.userResponse.update({
    where: { id: responseId },
    data: {
      cachedResult: cachedResult,
      isResultCached: true
    }
  })

  return cachedResult
}

export async function getCachedResult(responseId: string): Promise<CacheableResult | null> {
  const userResponse = await prisma.userResponse.findUnique({
    where: { id: responseId },
    select: {
      cachedResult: true,
      isResultCached: true
    }
  })

  if (!userResponse || !userResponse.isResultCached || !userResponse.cachedResult) {
    return null
  }

  return userResponse.cachedResult as CacheableResult
}

export async function invalidateResultCache(responseId: string): Promise<void> {
  await prisma.userResponse.update({
    where: { id: responseId },
    data: {
      cachedResult: null,
      isResultCached: false
    }
  })
}