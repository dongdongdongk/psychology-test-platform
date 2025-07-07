import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Check admin authentication
function checkAdminAuth(request: NextRequest) {
  const cookieStore = cookies()
  const session = cookieStore.get('admin-session')
  
  if (!session) {
    return false
  }
  
  return true
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const test = await prisma.test.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            responses: true
          }
        }
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error fetching test:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { title, description, thumbnailUrl, testUrl, isActive } = body

    // Validate required fields
    if (!title || !testUrl) {
      return NextResponse.json(
        { error: 'title and testUrl are required' },
        { status: 400 }
      )
    }

    const test = await prisma.test.update({
      where: { id: params.id },
      data: {
        title,
        description,
        thumbnailUrl,
        testUrl,
        isActive
      }
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error updating test:', error)
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Check if test has responses
    const responseCount = await prisma.userResponse.count({
      where: { testId: params.id }
    })

    if (responseCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete test with existing responses' },
        { status: 400 }
      )
    }

    await prisma.test.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Test deleted successfully' })
  } catch (error) {
    console.error('Error deleting test:', error)
    return NextResponse.json(
      { error: 'Failed to delete test' },
      { status: 500 }
    )
  }
}