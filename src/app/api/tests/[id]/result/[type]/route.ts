import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 테스트 결과 조회
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
        styleTheme: true,
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

    // 최근 사용자 응답에서 점수 정보 가져오기 (선택사항)
    const recentResponse = await prisma.userResponse.findFirst({
      where: {
        testId,
        resultType
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        responseData: true
      }
    })

    // JSONB에서 점수 계산
    let totalScore = 0
    if (recentResponse?.responseData) {
      const responseData = recentResponse.responseData as any
      if (responseData.answers) {
        Object.values(responseData.answers).forEach((answer: any) => {
          if (answer.scores && answer.scores[resultType]) {
            totalScore += answer.scores[resultType]
          }
        })
      }
    }

    // 최대 점수는 고정값 또는 계산로직으로 처리 (필요시 별도 구현)
    const maxScore = 100 // 기본값

    // 깔끔한 구조: description과 description_url 분리
    const textImageUrl = result.description_url
    const cleanDescription = result.description || ''

    return NextResponse.json({
      id: `${testId}_${resultType}`, // 임시 ID 생성
      type: resultType,
      title: result.title,
      description: cleanDescription,
      imageUrl: result.image_url,
      textImageUrl: textImageUrl,
      testTitle: test.title,
      styleTheme: test.styleTheme,
      totalScore: totalScore,
      maxScore: maxScore
    })
  } catch (error) {
    console.error('결과 조회 실패:', error)
    return NextResponse.json(
      { error: '결과를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}