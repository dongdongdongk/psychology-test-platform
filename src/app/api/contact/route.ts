import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

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

    // SMTP 설정 및 메일 발송
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        // SMTP 설정
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        })

        // 관리자에게 보낼 메일 내용
        const adminMailOptions = {
          from: process.env.SMTP_EMAIL,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
          subject: `[심리테스트 플랫폼] 새로운 문의: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f7bcb7; border-bottom: 2px solid #f7bcb7; padding-bottom: 10px;">
                새로운 문의가 도착했습니다
              </h2>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">문의 정보</h3>
                <p><strong>이름:</strong> ${name}</p>
                <p><strong>이메일:</strong> ${email}</p>
                <p><strong>문의 유형:</strong> ${subject}</p>
                <p><strong>IP 주소:</strong> ${ip}</p>
              </div>
              
              <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">문의 내용</h3>
                <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  이 메일은 심리테스트 플랫폼 문의 시스템에서 자동으로 발송되었습니다.<br>
                  답변은 ${email}로 직접 보내주세요.
                </p>
              </div>
            </div>
          `,
        }

        // 문의자에게 보낼 자동 응답 메일
        const userMailOptions = {
          from: process.env.SMTP_EMAIL,
          to: email,
          subject: '[심리테스트 플랫폼] 문의가 정상적으로 접수되었습니다',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f7bcb7; border-bottom: 2px solid #f7bcb7; padding-bottom: 10px;">
                문의 접수 완료
              </h2>
              
              <p>안녕하세요 ${name}님,</p>
              
              <p>심리테스트 플랫폼을 이용해주셔서 감사합니다. 문의가 정상적으로 접수되었습니다.</p>
              
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">접수된 문의 정보</h3>
                <p><strong>문의 유형:</strong> ${subject}</p>
                <p><strong>접수 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
              </div>
              
              <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">문의 내용</h3>
                <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  • 영업일 기준 24시간 내로 답변드리겠습니다.<br>
                  • 추가 문의사항이 있으시면 언제든지 연락주세요.<br>
                  • 이 메일은 자동 발송된 메일입니다.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" 
                   style="background: linear-gradient(135deg, #f7bcb7 0%, #e8958f 100%); 
                          color: white; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 6px; 
                          display: inline-block;">
                  심리테스트 플랫폼 방문하기
                </a>
              </div>
            </div>
          `,
        }

        // 메일 발송
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(userMailOptions)
        ])
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // 메일 발송 실패해도 DB 저장은 진행
      }
    }

    // 문의는 이메일로만 발송하고 DB에는 저장하지 않음

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