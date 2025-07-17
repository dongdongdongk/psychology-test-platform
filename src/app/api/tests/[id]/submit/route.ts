import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

// 답변 제출 및 결과 계산
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id
    const { answers } = await request.json()

    // 테스트 존재 확인
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            answerOptions: true
          }
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

    if (!test.isActive) {
      return NextResponse.json(
        { error: '비활성화된 테스트입니다.' },
        { status: 403 }
      )
    }

    // 점수 계산
    let totalScore = 0
    const processedAnswers: Record<string, any> = {}

    for (const question of test.questions) {
      const answer = answers[question.id]
      processedAnswers[question.id] = answer

      if (question.type === 'single' && typeof answer === 'string') {
        const option = question.answerOptions.find(opt => opt.id === answer)
        if (option) {
          totalScore += parseInt(option.value) || 0
        }
      } else if (question.type === 'multiple' && Array.isArray(answer)) {
        for (const optionId of answer) {
          const option = question.answerOptions.find(opt => opt.id === optionId)
          if (option) {
            totalScore += parseInt(option.value) || 0
          }
        }
      }
    }

    // 결과 타입 결정
    let resultType = 'default'
    for (const result of test.resultTypes) {
      if (result.minScore !== null && result.maxScore !== null) {
        if (totalScore >= result.minScore && totalScore <= result.maxScore) {
          resultType = result.type
          break
        }
      }
    }

    // 기본 결과 타입이 없으면 첫 번째 결과 사용
    if (resultType === 'default' && test.resultTypes.length > 0) {
      resultType = test.resultTypes[0].type
    }

    // 사용자 IP 및 User-Agent 추출
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // 응답 저장
    const response = await prisma.userResponse.create({
      data: {
        id: nanoid(),
        testId,
        responseData: processedAnswers,
        resultType,
        totalScore,
        ipAddress: ip,
        userAgent,
        sessionId: nanoid()
      }
    })

    return NextResponse.json({
      responseId: response.id,
      resultType,
      totalScore,
      maxScore: test.resultTypes.reduce((max, result) => 
        Math.max(max, result.maxScore || 0), 0
      )
    })
  } catch (error) {
    console.error('답변 제출 실패:', error)
    return NextResponse.json(
      { error: '답변 제출에 실패했습니다.' },
      { status: 500 }
    )
  }
}