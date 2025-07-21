import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '모든 필수 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      )
    }

    // Get client IP and user agent for tracking
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Save contact inquiry to database
    // For now, we'll use the UserResponse table to store contact forms
    // In a real application, you might want a separate ContactInquiry table
    await prisma.userResponse.create({
      data: {
        testId: 'contact-form', // Special identifier for contact forms
        responseData: {
          name,
          email,
          subject,
          message,
          submittedAt: new Date().toISOString()
        },
        resultType: 'contact-inquiry',
        ipAddress: ip,
        userAgent: userAgent,
        sessionId: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    })

    return NextResponse.json(
      { message: '문의가 성공적으로 전송되었습니다.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}