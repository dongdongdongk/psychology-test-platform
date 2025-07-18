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
        questions: {
          include: {
            answerOptions: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
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
        isActive: data.isActive
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

// 관리자용 테스트 삭제 (응답 데이터 백업 후 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id
    
    // 요청 헤더에서 관리자 정보 가져오기 (인증 시스템이 있다면)
    const adminInfo = request.headers.get('admin-info') || 'unknown'

    // 트랜잭션으로 백업 후 삭제 처리
    await prisma.$transaction(async (tx) => {
      // 1. 테스트 정보 가져오기
      const test = await tx.test.findUnique({
        where: { id: testId },
        select: { title: true }
      })

      if (!test) {
        throw new Error('테스트를 찾을 수 없습니다.')
      }

      // 2. 응답 데이터 백업
      const responses = await tx.userResponse.findMany({
        where: { testId }
      })

      if (responses.length > 0) {
        await tx.userResponseBackup.createMany({
          data: responses.map(response => ({
            id: response.id,
            testId: response.testId,
            testTitle: test.title,
            responseData: response.responseData,
            resultType: response.resultType,
            totalScore: response.totalScore,
            ipAddress: response.ipAddress,
            userAgent: response.userAgent,
            sessionId: response.sessionId,
            originalCreatedAt: response.createdAt,
            deletedBy: adminInfo
          }))
        })

        // 3. 원본 응답 데이터 삭제
        await tx.userResponse.deleteMany({
          where: { testId }
        })
      }

      // 4. 테스트 삭제 (questions, resultTypes는 cascade로 자동 삭제)
      await tx.test.delete({
        where: { id: testId }
      })
    })

    return NextResponse.json({ 
      message: '테스트가 삭제되었습니다. 응답 데이터는 백업되었습니다.',
      backupCount: await prisma.userResponseBackup.count({ where: { testId } })
    })
  } catch (error) {
    console.error('테스트 삭제 실패:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '테스트 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}