import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
      resultCount,
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
        if (!option.content || typeof option.score !== 'number') {
          return NextResponse.json(
            { error: '선택지 내용 또는 점수가 올바르지 않습니다.' },
            { status: 400 }
          )
        }
      }
    }

    // 결과 타입 유효성 검사
    if (!resultTypes || resultTypes.length !== resultCount) {
      return NextResponse.json(
        { error: '결과 타입 정보가 올바르지 않습니다.' },
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

    // 테스트 데이터 구성
    const testData = {
      title,
      description,
      category,
      thumbnailUrl,
      detailImageUrl,
      styleTheme,
      isActive: true,
      testData: {
        questionCount,
        optionCount,
        questions: questions.map((q: any) => ({
          id: q.id,
          content: q.content,
          options: q.options.map((o: any) => ({
            id: o.id,
            content: o.content,
            score: o.score
          }))
        })),
        resultCount,
        resultTypes: resultTypes.map((r: any) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          minScore: r.minScore,
          maxScore: r.maxScore,
          imageUrl: r.imageUrl || null,
          textImageUrl: r.textImageUrl || null
        }))
      }
    }

    // 데이터베이스에 저장
    const createdTest = await prisma.test.create({
      data: testData
    })

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