'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import styles from './QuizPage.module.scss'

interface Question {
  id: string
  content: string
  type: 'single' | 'multiple'
  answerOptions: AnswerOption[]
}

interface AnswerOption {
  id: string
  content: string
  value: string
  order: number
}

interface TestData {
  id: string
  title: string
  styleTheme: string
  questions: Question[]
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string
  const [testData, setTestData] = useState<TestData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setTheme } = useTheme()

  useEffect(() => {
    if (testId) {
      fetchTestData()
    }
  }, [testId])

  const fetchTestData = async () => {
    try {
      const response = await fetch(`/api/tests/${testId}/questions`)
      if (!response.ok) {
        throw new Error('테스트 데이터를 불러올 수 없습니다')
      }
      
      const data = await response.json()
      setTestData(data)
      setTheme(data.styleTheme || 'modern')
      
      // 답변 초기화
      const initialAnswers: Record<string, string | string[]> = {}
      data.questions.forEach((question: Question) => {
        initialAnswers[question.id] = question.type === 'multiple' ? [] : ''
      })
      setAnswers(initialAnswers)
    } catch (err) {
      setError(err instanceof Error ? err.message : '테스트 데이터를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: string, optionId: string, type: 'single' | 'multiple') => {
    if (type === 'single') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }))
    } else {
      setAnswers(prev => {
        const currentAnswers = prev[questionId] as string[]
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter(id => id !== optionId)
          : [...currentAnswers, optionId]
        
        return {
          ...prev,
          [questionId]: newAnswers
        }
      })
    }
  }

  const goToNext = () => {
    if (testData && currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitAnswers = async () => {
    if (!testData) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers,
          testId
        })
      })

      if (!response.ok) {
        throw new Error('답변 제출에 실패했습니다')
      }

      const result = await response.json()
      
      // 결과 페이지로 이동
      router.push(`/tests/${testId}/result/${result.resultType}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '답변 제출에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>테스트를 준비하는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !testData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>오류가 발생했습니다</h2>
          <p>{error || '테스트를 불러올 수 없습니다'}</p>
          <button onClick={() => router.push(`/tests/${testId}`)} className="theme-button">
            다시 시도하기
          </button>
        </div>
      </div>
    )
  }

  const question = testData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100
  const isLastQuestion = currentQuestion === testData.questions.length - 1
  const hasAnswer = question.type === 'single' 
    ? answers[question.id] !== ''
    : (answers[question.id] as string[]).length > 0

  return (
    <div className={styles.container}>
      <div className={styles.quizContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>{testData.title}</h1>
          <div className={styles.progress}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            <span className={styles.progressText}>
              {currentQuestion + 1} / {testData.questions.length}
            </span>
          </div>
        </div>

        <div className={styles.questionContainer}>
          <div className={styles.questionNumber}>
            질문 {currentQuestion + 1}
          </div>
          <h2 className={styles.questionText}>{question.content}</h2>
          
          <div className={styles.options}>
            {question.answerOptions.map((option) => (
              <button
                key={option.id}
                className={`${styles.option} ${
                  question.type === 'single' 
                    ? answers[question.id] === option.id ? styles.selected : ''
                    : (answers[question.id] as string[]).includes(option.id) ? styles.selected : ''
                }`}
                onClick={() => handleAnswer(question.id, option.id, question.type)}
              >
                <div className={styles.optionIndicator}>
                  {question.type === 'single' ? '○' : '☐'}
                </div>
                <span className={styles.optionText}>{option.content}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className={styles.prevButton}
          >
            이전
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={submitAnswers}
              disabled={!hasAnswer || submitting}
              className={styles.submitButton}
            >
              {submitting ? '제출 중...' : '결과 보기'}
            </button>
          ) : (
            <button
              onClick={goToNext}
              disabled={!hasAnswer}
              className={styles.nextButton}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  )
}