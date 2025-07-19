'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTheme } from '@/hooks/useTheme'
import Header from '@/components/common/Header'
import { Test, Question, AnswerOption } from '@/types'
import styles from './QuizPage.module.scss'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string
  const [testData, setTestData] = useState<Test | null>(null)
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
      const response = await fetch(`/api/tests/${testId}`)
      if (!response.ok) {
        throw new Error('테스트 데이터를 불러올 수 없습니다')
      }
      
      const data = await response.json()
      setTestData(data)
      setTheme(data.styleTheme || 'modern')
      
      // 답변 초기화
      const initialAnswers: Record<string, string | string[]> = {}
      if (data.questions) {
        data.questions.forEach((question: Question) => {
          initialAnswers[question.id] = question.type === 'multiple' ? [] : ''
        })
      }
      setAnswers(initialAnswers)
    } catch (err) {
      setError(err instanceof Error ? err.message : '테스트 데이터를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: string, optionIndex: number, type: 'single' | 'multiple') => {
    if (type === 'single') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionIndex.toString()
      }))
      
      // 단일 선택 문제에서는 답변 선택 후 자동으로 다음 문제로 이동
      setTimeout(() => {
        if (testData && testData.questions && currentQuestion < testData.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
        } else if (testData && testData.questions && currentQuestion === testData.questions.length - 1) {
          // 마지막 문제인 경우 자동으로 제출
          submitAnswers()
        }
      }, 300) // 0.3초 딜레이로 사용자가 선택을 확인할 수 있게 함
    } else {
      setAnswers(prev => {
        const currentAnswers = prev[questionId] as string[]
        const optionStr = optionIndex.toString()
        const newAnswers = currentAnswers.includes(optionStr)
          ? currentAnswers.filter(id => id !== optionStr)
          : [...currentAnswers, optionStr]
        
        return {
          ...prev,
          [questionId]: newAnswers
        }
      })
    }
  }

  const goToNext = () => {
    if (testData && testData.questions && currentQuestion < testData.questions.length - 1) {
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
      // 점수 계산
      let totalScores: Record<string, number> = {}
      
      if (testData.questions) {
        testData.questions.forEach((question) => {
          const userAnswer = answers[question.id]
          if (userAnswer) {
            if (question.type === 'single') {
              const optionIndex = parseInt(userAnswer as string)
              const selectedOption = question.options[optionIndex]
              if (selectedOption) {
                Object.entries(selectedOption.value).forEach(([key, value]) => {
                  totalScores[key] = (totalScores[key] || 0) + value
                })
              }
            } else {
              const optionIndices = userAnswer as string[]
              optionIndices.forEach((indexStr) => {
                const optionIndex = parseInt(indexStr)
                const selectedOption = question.options[optionIndex]
                if (selectedOption) {
                  Object.entries(selectedOption.value).forEach(([key, value]) => {
                    totalScores[key] = (totalScores[key] || 0) + value
                  })
                }
              })
            }
          }
        })
      }

      // 가장 높은 점수의 타입 찾기
      const resultType = Object.entries(totalScores).reduce((a, b) => a[1] > b[1] ? a : b)[0]

      // 새로운 JSONB 구조에 맞게 답변 데이터 변환
      const now = new Date().toISOString()
      const answersFormatted: Record<string, any> = {}
      
      Object.entries(answers).forEach(([questionId, answer]) => {
        const question = testData.questions?.find(q => q.id === questionId)
        if (question && answer) {
          if (question.type === 'single') {
            const optionIndex = parseInt(answer as string)
            const selectedOption = question.options[optionIndex]
            answersFormatted[questionId] = {
              answer: selectedOption?.content || '',
              optionIndex: optionIndex,
              scores: selectedOption?.value || {},
              answered_at: now
            }
          } else {
            const optionIndices = answer as string[]
            const selectedOptions = optionIndices.map(idx => question.options[parseInt(idx)])
            let combinedScores: Record<string, number> = {}
            selectedOptions.forEach(option => {
              if (option) {
                Object.entries(option.value).forEach(([key, value]) => {
                  combinedScores[key] = (combinedScores[key] || 0) + value
                })
              }
            })
            answersFormatted[questionId] = {
              answer: selectedOptions.map(opt => opt?.content).filter(Boolean),
              optionIndex: optionIndices.map(idx => parseInt(idx)),
              scores: combinedScores,
              answered_at: now
            }
          }
        }
      })

      const response = await fetch(`/api/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId,
          answers: answersFormatted,
          resultType
        })
      })

      if (!response.ok) {
        throw new Error('답변 제출에 실패했습니다')
      }

      // 결과 페이지로 이동
      router.push(`/tests/${testId}/result/${resultType}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '답변 제출에 실패했습니다')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>테스트를 준비하는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !testData || !testData.questions || testData.questions.length === 0) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>오류가 발생했습니다</h2>
            <p>{error || '테스트를 불러올 수 없습니다'}</p>
            <button onClick={() => router.push(`/tests/${testId}`)} className="theme-button">
              다시 시도하기
            </button>
          </div>
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
    <div className={styles.page}>
      <Header />
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
            {question.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                className={`${styles.option} ${
                  question.type === 'single' 
                    ? answers[question.id] === optionIndex.toString() ? styles.selected : ''
                    : (answers[question.id] as string[]).includes(optionIndex.toString()) ? styles.selected : ''
                }`}
                onClick={() => handleAnswer(question.id, optionIndex, question.type)}
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
    </div>
  )
}