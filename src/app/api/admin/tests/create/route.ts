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

    // 질문 데이터를 JSONB 형태로 변환
    const questionsData = questions.map((question: any, index: number) => ({
      id: `q${index + 1}`,
      content: question.content,
      order: index + 1,
      type: 'single',
      options: question.options.map((option: any, optionIndex: number) => ({
        content: option.content,
        value: option.scores, // 이미 객체 형태
        order: optionIndex + 1
      }))
    }))

    // 테스트 생성 (questions를 JSONB로 저장)
    const test = await prisma.test.create({
      data: {
        title,
        description,
        category,
        thumbnailUrl,
        detailImageUrl,
        styleTheme,
        isActive: true,
        questions: questionsData
      }
    })

    // 결과 타입들을 JSONB 형태로 변환
    const resultTypesData: Record<string, any> = {}
    resultTypes.forEach((resultType: any) => {
      // [TEXT_IMAGE:...] 패턴을 파싱해서 description_url로 분리
      let description = resultType.description || ''
      let descriptionUrl = resultType.textImageUrl || null
      
      // description에서 [TEXT_IMAGE:...] 패턴 추출
      const textImageMatch = description.match(/\[TEXT_IMAGE:([^\]]+)\]/)
      if (textImageMatch) {
        descriptionUrl = textImageMatch[1]
        description = description.replace(/\[TEXT_IMAGE:[^\]]+\]/g, '').trim()
      }
      
      resultTypesData[resultType.id] = {
        title: resultType.name,
        description: description,
        description_url: descriptionUrl,
        image_url: resultType.imageUrl || null
      }
    })

    // 테스트에 결과 타입 정보 업데이트
    const updatedTest = await prisma.test.update({
      where: { id: test.id },
      data: {
        resultTypes: resultTypesData
      }
    })

    const createdTest = updatedTest

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