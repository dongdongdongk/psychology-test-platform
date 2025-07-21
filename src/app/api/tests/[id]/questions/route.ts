import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 테스트 질문 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id

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

    if (!test.isActive) {
      return NextResponse.json(
        { error: '비활성화된 테스트입니다.' },
        { status: 403 }
      )
    }

    // 질문 데이터는 Test의 questions JSONB 필드에서 가져옴
    const testWithQuestions = await prisma.test.findUnique({
      where: { id: testId },
      select: {
        id: true,
        title: true,
        styleTheme: true,
        questions: true
      }
    })

    return NextResponse.json({
      id: testWithQuestions?.id,
      title: testWithQuestions?.title,
      styleTheme: testWithQuestions?.styleTheme,
      questions: testWithQuestions?.questions || []
    })
  } catch (error) {
    console.error('질문 조회 실패:', error)
    return NextResponse.json(
      { error: '질문을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}