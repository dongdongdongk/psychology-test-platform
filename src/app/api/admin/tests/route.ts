import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
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

export async function GET(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const tests = await prisma.test.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            responses: true
          }
        }
      }
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { id, title, description, thumbnailUrl, testUrl, isActive } = body

    // Validate required fields
    if (!id || !title || !testUrl) {
      return NextResponse.json(
        { error: 'id, title, and testUrl are required' },
        { status: 400 }
      )
    }

    // Check if test ID already exists
    const existingTest = await prisma.test.findUnique({
      where: { id }
    })

    if (existingTest) {
      return NextResponse.json(
        { error: 'Test ID already exists' },
        { status: 409 }
      )
    }

    const test = await prisma.test.create({
      data: {
        id,
        title,
        description,
        thumbnailUrl,
        testUrl,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json(
      { error: 'Failed to create test' },
      { status: 500 }
    )
  }
}