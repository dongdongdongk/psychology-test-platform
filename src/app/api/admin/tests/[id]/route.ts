import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 관리자용 테스트 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        resultTypes: {
          orderBy: { minScore: 'asc' }
        }
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: '테스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error('테스트 조회 실패:', error)
    return NextResponse.json(
      { error: '테스트 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 관리자용 테스트 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id
    const data = await request.json()

    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        thumbnailUrl: data.thumbnailUrl,
        detailImageUrl: data.detailImageUrl,
        styleTheme: data.styleTheme,
        isActive: data.isActive,
        questions: data.questions
      }
    })

    return NextResponse.json(updatedTest)
  } catch (error) {
    console.error('테스트 수정 실패:', error)
    return NextResponse.json(
      { error: '테스트 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 관리자용 테스트 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id

    // 테스트 존재 여부 확인
    const test = await prisma.test.findUnique({
      where: { id: testId }
    })

    if (!test) {
      return NextResponse.json(
        { error: '테스트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 먼저 관련된 응답 데이터 삭제
    await prisma.userResponse.deleteMany({
      where: { testId }
    })

    // 그 다음 테스트 삭제
    await prisma.test.delete({
      where: { id: testId }
    })

    return NextResponse.json({ 
      message: '테스트가 삭제되었습니다.'
    })
  } catch (error) {
    console.error('테스트 삭제 실패:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '테스트 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}