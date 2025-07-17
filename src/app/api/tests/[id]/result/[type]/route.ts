import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 테스트 결과 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const testId = params.id
    const resultType = params.type

    // 테스트 존재 확인
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: {
        id: true,
        title: true,
        styleTheme: true,
        isActive: true
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: '테스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 결과 타입 정보 조회
    const result = await prisma.resultType.findFirst({
      where: {
        testId,
        type: resultType
      }
    })

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
        totalScore: true
      }
    })

    // 최대 점수 계산
    const maxScore = await prisma.resultType.findMany({
      where: { testId },
      select: { maxScore: true }
    }).then(results => 
      results.reduce((max, r) => Math.max(max, r.maxScore || 0), 0)
    )

    return NextResponse.json({
      id: result.id,
      type: result.type,
      title: result.title,
      description: result.description,
      imageUrl: result.imageUrl,
      testTitle: test.title,
      styleTheme: test.styleTheme,
      totalScore: recentResponse?.totalScore || 0,
      maxScore: maxScore || 100
    })
  } catch (error) {
    console.error('결과 조회 실패:', error)
    return NextResponse.json(
      { error: '결과를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}