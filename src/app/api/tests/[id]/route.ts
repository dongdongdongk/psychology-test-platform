import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// 특정 테스트 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'
    
    // 관리자 권한 확인
    let hasAdminAccess = false
    if (isAdmin) {
      const cookieStore = cookies()
      const adminSession = cookieStore.get('admin-session')
      hasAdminAccess = !!adminSession
    }

    // 관리자인 경우 모든 테스트 접근 가능, 일반 사용자는 활성화된 테스트만
    const whereCondition = hasAdminAccess 
      ? { id: testId }
      : { id: testId, isActive: true }

    const test = await prisma.test.findUnique({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        thumbnailUrl: true,
        detailImageUrl: true,
        styleTheme: true,
        enableRadarChart: true,
        isActive: true,
        questions: true,
        createdAt: true,
        updatedAt: true
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