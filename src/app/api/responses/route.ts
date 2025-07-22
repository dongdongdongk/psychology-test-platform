import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testId, answers, resultType } = body

    // Validate required fields
    if (!testId || !answers) {
      return NextResponse.json(
        { error: 'testId and answers are required' },
        { status: 400 }
      )
    }

    // Check if test exists and get questions
    const test = await prisma.test.findUnique({
      where: { id: testId }
    })

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Get client info
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = uuidv4()

    // Build response data structure
    const now = new Date().toISOString()
    const responseData = {
      answers: answers, // 이미 QuestionAnswer 형태로 전달됨
      metadata: {
        start_time: now,
        completion_time: now,
        browser_info: userAgent,
        device_type: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
        total_questions: test.questions ? (test.questions as any[]).length : 0
      }
    }

    // Save user response with structured JSONB data
    const userResponse = await prisma.userResponse.create({
      data: {
        testId,
        responseData,
        resultType,
        ipAddress: clientIP,
        userAgent,
        sessionId
      }
    })

    // 테스트 완료 카운트 증가
    await prisma.test.update({
      where: { id: testId },
      data: {
        completionCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      id: userResponse.id,
      resultType,
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