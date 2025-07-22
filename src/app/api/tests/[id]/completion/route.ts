import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id

    // 테스트 완료 카운트 증가
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        completionCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      completionCount: updatedTest.completionCount
    })
  } catch (error) {
    console.error('Completion count update error:', error)
    return NextResponse.json(
      { error: '완료 카운트 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}