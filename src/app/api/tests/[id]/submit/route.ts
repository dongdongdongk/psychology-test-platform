import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

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

    // 타입별 점수 계산
    const typeScores: Record<string, number> = {}
    const processedAnswers: Record<string, any> = {}

    for (const question of test.questions) {
      const answer = answers[question.id]
      processedAnswers[question.id] = answer

      if (question.type === 'single' && typeof answer === 'string') {
        const option = question.answerOptions.find(opt => opt.id === answer)
        if (option && option.value) {
          try {
            // value는 JSON 문자열로 저장된 점수 객체 (예: {"A": 3, "B": 1})
            const scores = JSON.parse(option.value)
            for (const [typeId, score] of Object.entries(scores)) {
              if (typeof score === 'number') {
                typeScores[typeId] = (typeScores[typeId] || 0) + score
              }
            }
          } catch (e) {
            console.error('점수 파싱 오류:', e)
          }
        }
      } else if (question.type === 'multiple' && Array.isArray(answer)) {
        for (const optionId of answer) {
          const option = question.answerOptions.find(opt => opt.id === optionId)
          if (option && option.value) {
            try {
              const scores = JSON.parse(option.value)
              for (const [typeId, score] of Object.entries(scores)) {
                if (typeof score === 'number') {
                  typeScores[typeId] = (typeScores[typeId] || 0) + score
                }
              }
            } catch (e) {
              console.error('점수 파싱 오류:', e)
            }
          }
        }
      }
    }

    // 가장 높은 점수를 가진 타입 찾기
    let resultType = 'default'
    let maxScore = -1
    const typeScoreEntries = Object.entries(typeScores)
    
    if (typeScoreEntries.length > 0) {
      // 점수가 높은 순으로 정렬
      typeScoreEntries.sort((a, b) => b[1] - a[1])
      
      // 동점 처리: 가장 높은 점수가 동일한 경우 알파벳 순으로 첫 번째 타입 선택
      const highestScore = typeScoreEntries[0][1]
      const tiedTypes = typeScoreEntries.filter(([_, score]) => score === highestScore)
      
      if (tiedTypes.length > 1) {
        // 동점인 경우 알파벳 순으로 정렬하여 첫 번째 선택
        tiedTypes.sort((a, b) => a[0].localeCompare(b[0]))
        resultType = tiedTypes[0][0]
        maxScore = tiedTypes[0][1]
      } else {
        resultType = typeScoreEntries[0][0]
        maxScore = typeScoreEntries[0][1]
      }
    }

    // 결과 타입이 없으면 첫 번째 결과 사용
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
        totalScore: maxScore, // 최고 점수를 totalScore로 저장
        ipAddress: ip,
        userAgent,
        sessionId: nanoid()
      }
    })

    return NextResponse.json({
      responseId: response.id,
      resultType,
      typeScores, // 모든 타입별 점수 반환
      finalScore: maxScore,
      tiedTypes: Object.entries(typeScores).filter(([_, score]) => score === maxScore).map(([type, _]) => type)
    })
  } catch (error) {
    console.error('답변 제출 실패:', error)
    return NextResponse.json(
      { error: '답변 제출에 실패했습니다.' },
      { status: 500 }
    )
  }
}