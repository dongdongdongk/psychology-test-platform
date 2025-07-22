import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id

    // 공유 카운트 증가
    const updatedTest = await prisma.test.update({
      where: { id: testId },
      data: {
        shareCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      shareCount: updatedTest.shareCount
    })
  } catch (error) {
    console.error('Share count update error:', error)
    return NextResponse.json(
      { error: '공유 카운트 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}