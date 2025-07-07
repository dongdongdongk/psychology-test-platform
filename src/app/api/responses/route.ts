import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testId, responseData, resultData } = body

    // Validate required fields
    if (!testId || !responseData) {
      return NextResponse.json(
        { error: 'testId and responseData are required' },
        { status: 400 }
      )
    }

    // Check if test exists
    const test = await prisma.test.findUnique({
      where: { id: testId }
    })

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Get client IP and user agent
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // Generate session ID (simple implementation)
    const sessionId = uuidv4()

    // Save user response
    const userResponse = await prisma.userResponse.create({
      data: {
        id: uuidv4(),
        testId,
        responseData,
        resultData,
        ipAddress: clientIP,
        userAgent,
        sessionId
      }
    })

    return NextResponse.json({
      id: userResponse.id,
      message: 'Response saved successfully'
    })
  } catch (error) {
    console.error('Error saving response:', error)
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    )
  }
}