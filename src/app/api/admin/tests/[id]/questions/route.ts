import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

// 테스트 질문 목록 조회 (관리자용)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 인증 확인 (실제 구현에서는 NextAuth 또는 JWT 토큰 확인)
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    // }

    const testId = params.id

    const questions = await prisma.question.findMany({
      where: { testId },
      include: {
        answerOptions: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('질문 조회 실패:', error)
    return NextResponse.json(
      { error: '질문을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 테스트 질문 저장/수정 (관리자용)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 인증 확인
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    // }

    const testId = params.id
    const { questions } = await request.json()

    // 기존 질문과 선택지 삭제
    await prisma.question.deleteMany({
      where: { testId }
    })

    // 새 질문과 선택지 생성
    for (const question of questions) {
      const createdQuestion = await prisma.question.create({
        data: {
          id: question.id || nanoid(),
          testId,
          content: question.content,
          type: question.type,
          order: question.order
        }
      })

      // 선택지 생성
      for (const option of question.answerOptions) {
        await prisma.answerOption.create({
          data: {
            id: option.id || nanoid(),
            questionId: createdQuestion.id,
            content: option.content,
            value: option.value,
            order: option.order
          }
        })
      }
    }

    return NextResponse.json({ message: '질문이 저장되었습니다.' })
  } catch (error) {
    console.error('질문 저장 실패:', error)
    return NextResponse.json(
      { error: '질문 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}