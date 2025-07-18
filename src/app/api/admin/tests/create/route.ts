import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      description,
      category,
      thumbnailUrl,
      detailImageUrl,
      questionCount,
      optionCount,
      styleTheme,
      questions,
      resultTypes
    } = body

    // 기본 정보 유효성 검사
    if (!title || !description || !category || !styleTheme) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 문제 정보 유효성 검사
    if (!questions || questions.length !== questionCount) {
      return NextResponse.json(
        { error: '문제 정보가 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    // 각 문제별 유효성 검사
    for (const question of questions) {
      if (!question.content || !question.options || question.options.length !== optionCount) {
        return NextResponse.json(
          { error: '문제 내용 또는 선택지가 올바르지 않습니다.' },
          { status: 400 }
        )
      }
      
      for (const option of question.options) {
        if (!option.content || !option.scores || Object.keys(option.scores).length === 0) {
          return NextResponse.json(
            { error: '선택지 내용 또는 점수가 올바르지 않습니다.' },
            { status: 400 }
          )
        }
      }
    }

    // 결과 타입 유효성 검사
    if (!resultTypes || resultTypes.length < 2) {
      return NextResponse.json(
        { error: '최소 2개 이상의 결과 타입이 필요합니다.' },
        { status: 400 }
      )
    }

    for (const resultType of resultTypes) {
      if (!resultType.name || !resultType.description) {
        return NextResponse.json(
          { error: '결과 타입 이름 또는 설명이 누락되었습니다.' },
          { status: 400 }
        )
      }
    }

    // 데이터베이스에 순차적으로 저장
    // 1. 테스트 기본 정보 저장
    const test = await prisma.test.create({
      data: {
        title,
        description,
        category,
        thumbnailUrl,
        detailImageUrl,
        styleTheme,
        isActive: true
      }
    })

    // 2. 질문들 저장
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const createdQuestion = await prisma.question.create({
        data: {
          testId: test.id,
          content: question.content,
          order: i + 1,
          type: 'single'
        }
      })

      // 3. 각 질문의 선택지들 저장
      for (let j = 0; j < question.options.length; j++) {
        const option = question.options[j]
        await prisma.answerOption.create({
          data: {
            questionId: createdQuestion.id,
            content: option.content,
            value: JSON.stringify(option.scores),
            order: j + 1
          }
        })
      }
    }

    // 4. 결과 타입들 저장
    for (const resultType of resultTypes) {
      await prisma.resultType.create({
        data: {
          testId: test.id,
          type: resultType.id,
          title: resultType.name,
          description: resultType.description + (resultType.textImageUrl ? `\n[TEXT_IMAGE:${resultType.textImageUrl}]` : ''),
          imageUrl: resultType.imageUrl || null,
          minScore: null,
          maxScore: null
        }
      })
    }

    const createdTest = test

    return NextResponse.json({
      message: '테스트가 성공적으로 생성되었습니다.',
      test: createdTest
    }, { status: 201 })

  } catch (error) {
    console.error('테스트 생성 실패:', error)
    return NextResponse.json(
      { error: '테스트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}