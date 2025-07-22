import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateStressDetailedScores, calculateGeneralScore, calculateGeneralDetailedScores, isStressTest } from '@/utils/scoreCalculator'

// 공통 함수들은 utils/scoreCalculator.ts에서 import

// 테스트 결과 조회 (POST로 응답 데이터와 함께 받음)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const testId = params.id
    const resultType = params.type
    const body = await request.json()
    const { responseData, responseId } = body

    // 테스트 존재 확인 및 결과 타입 정보 조회
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        styleTheme: true,
        enableRadarChart: true,
        enableBarChart: true,
        showResultImage: true,
        showTextImage: true,
        isActive: true,
        resultTypes: true,
        questions: true
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: '테스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // JSONB에서 결과 타입 정보 추출
    const resultTypesData = test.resultTypes as any
    const result = resultTypesData?.[resultType]

    if (!result) {
      return NextResponse.json(
        { error: '결과를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // JSONB에서 점수 계산 및 상세 점수 정보
    let totalScore = 0
    let detailedScores: any = null
    let actualResponseData = responseData
    
    // responseId가 있으면 DB에서 해당 응답 데이터 조회
    if (responseId) {
      console.log('responseId로 DB에서 조회:', responseId)
      const userResponse = await prisma.userResponse.findUnique({
        where: { id: responseId },
        select: { responseData: true }
      })
      
      if (userResponse && userResponse.responseData) {
        // DB에서 저장된 구조: {answers: {...}, metadata: {...}}
        // answers 부분만 추출하여 사용
        const dbData = userResponse.responseData as any
        actualResponseData = dbData.answers || dbData
        console.log('DB에서 조회한 응답 데이터:', actualResponseData)
      } else {
        console.log('responseId에 해당하는 응답을 찾을 수 없음:', responseId)
      }
    }
    
    if (actualResponseData) {
      // 스트레스 테스트인 경우 특별한 영역별 상세 점수 계산
      if (isStressTest(testId, test.title)) {
        detailedScores = calculateStressDetailedScores(actualResponseData, test, testId)
        totalScore = detailedScores.total
      } else {
        // 일반 테스트: 타입별 점수 합산
        totalScore = calculateGeneralScore(actualResponseData, resultType)
        
        // 모든 테스트는 ABCD 점수를 가지므로 항상 계산
        detailedScores = calculateGeneralDetailedScores(actualResponseData)
        console.log('일반 테스트 ABCD 점수 계산:', detailedScores)
      }
    }

    // 최대 점수는 고정값 또는 계산로직으로 처리 (필요시 별도 구현)
    const maxScore = 100 // 기본값

    // 깔끔한 구조: description과 description_url 분리
    const textImageUrl = result.description_url
    const cleanDescription = result.description || ''

    const apiResponseData = {
      id: `${testId}_${resultType}`, // 임시 ID 생성
      type: resultType,
      resultType: resultType, // 추가: resultType도 명시적으로 설정
      title: result.title,
      description: cleanDescription,
      imageUrl: result.image_url,
      textImageUrl: textImageUrl,
      testTitle: test.title,
      thumbnailUrl: test.thumbnailUrl, // 테스트 썸네일 URL 추가
      styleTheme: test.styleTheme,
      enableRadarChart: test.enableRadarChart ?? false,
      enableBarChart: test.enableBarChart ?? false,
      showResultImage: test.showResultImage ?? true,
      showTextImage: test.showTextImage ?? true,
      totalScore: totalScore,
      maxScore: maxScore,
      detailedScores: detailedScores, // 레이더 차트용 상세 점수 포함
      resultTypes: resultTypesData // 막대 차트에서 사용할 결과 타입 정보
    }
    
    console.log('API 응답 데이터:', {
      testId,
      enableBarChart: test.enableBarChart,
      detailedScores: !!detailedScores
    })
    
    return NextResponse.json(apiResponseData)
  } catch (error) {
    console.error('결과 조회 실패:', error)
    return NextResponse.json(
      { error: '결과를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET 메서드 (기존 호환성 유지)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const testId = params.id
    const resultType = params.type

    // 테스트 존재 확인 및 결과 타입 정보 조회
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        styleTheme: true,
        enableRadarChart: true,
        enableBarChart: true,
        showResultImage: true,
        showTextImage: true,
        isActive: true,
        resultTypes: true
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: '테스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // JSONB에서 결과 타입 정보 추출
    const resultTypesData = test.resultTypes as any
    const result = resultTypesData?.[resultType]

    if (!result) {
      return NextResponse.json(
        { error: '결과를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 깔끔한 구조: description과 description_url 분리
    const textImageUrl = result.description_url
    const cleanDescription = result.description || ''

    return NextResponse.json({
      id: `${testId}_${resultType}`,
      type: resultType,
      title: result.title,
      description: cleanDescription,
      imageUrl: result.image_url,
      textImageUrl: textImageUrl,
      testTitle: test.title,
      thumbnailUrl: test.thumbnailUrl, // 테스트 썸네일 URL 추가
      styleTheme: test.styleTheme,
      enableRadarChart: test.enableRadarChart ?? false,
      enableBarChart: test.enableBarChart ?? false,
      showResultImage: test.showResultImage ?? true,
      showTextImage: test.showTextImage ?? true,
      totalScore: 0, // GET에서는 점수 계산 안함
      maxScore: 100
    })
  } catch (error) {
    console.error('결과 조회 실패:', error)
    return NextResponse.json(
      { error: '결과를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}