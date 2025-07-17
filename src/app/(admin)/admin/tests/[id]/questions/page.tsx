'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { nanoid } from 'nanoid'
import styles from './Questions.module.scss'

interface AnswerOption {
  id: string
  content: string
  value: string
  order: number
}

interface Question {
  id: string
  content: string
  type: 'single' | 'multiple'
  order: number
  answerOptions: AnswerOption[]
}

interface Test {
  id: string
  title: string
  description: string
  styleTheme: string
}

export default function QuestionsPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string
  
  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (testId) {
      fetchData()
    }
  }, [testId])

  const fetchData = async () => {
    try {
      const [testResponse, questionsResponse] = await Promise.all([
        axios.get(`/api/admin/tests/${testId}`),
        axios.get(`/api/admin/tests/${testId}/questions`)
      ])
      
      setTest(testResponse.data)
      setQuestions(questionsResponse.data || [])
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: nanoid(),
      content: '',
      type: 'single',
      order: questions.length + 1,
      answerOptions: [
        { id: nanoid(), content: '', value: '1', order: 1 },
        { id: nanoid(), content: '', value: '2', order: 2 }
      ]
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId))
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ))
  }

  const addAnswerOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    const newOption: AnswerOption = {
      id: nanoid(),
      content: '',
      value: String(question.answerOptions.length + 1),
      order: question.answerOptions.length + 1
    }

    updateQuestion(questionId, {
      answerOptions: [...question.answerOptions, newOption]
    })
  }

  const removeAnswerOption = (questionId: string, optionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question || question.answerOptions.length <= 2) return

    updateQuestion(questionId, {
      answerOptions: question.answerOptions.filter(o => o.id !== optionId)
    })
  }

  const updateAnswerOption = (questionId: string, optionId: string, updates: Partial<AnswerOption>) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    const updatedOptions = question.answerOptions.map(o =>
      o.id === optionId ? { ...o, ...updates } : o
    )

    updateQuestion(questionId, { answerOptions: updatedOptions })
  }

  const saveQuestions = async () => {
    setSaving(true)
    setError('')

    try {
      await axios.post(`/api/admin/tests/${testId}/questions`, {
        questions: questions.map((q, index) => ({
          ...q,
          order: index + 1
        }))
      })
      
      alert('질문이 저장되었습니다!')
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('질문 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>데이터를 불러오는 중...</div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>테스트를 찾을 수 없습니다.</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.title}>
            <h1>{test.title} - 질문 관리</h1>
            <p>테스트 질문과 선택지를 관리합니다</p>
          </div>
          <Link href="/admin/tests" className={styles.backButton}>
            ← 테스트 목록
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.questionsContainer}>
          {questions.map((question, questionIndex) => (
            <div key={question.id} className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>질문 {questionIndex + 1}</span>
                <div className={styles.questionActions}>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(question.id, { 
                      type: e.target.value as 'single' | 'multiple' 
                    })}
                    className={styles.typeSelect}
                  >
                    <option value="single">단일 선택</option>
                    <option value="multiple">복수 선택</option>
                  </select>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className={styles.removeButton}
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className={styles.questionContent}>
                <textarea
                  value={question.content}
                  onChange={(e) => updateQuestion(question.id, { content: e.target.value })}
                  placeholder="질문을 입력하세요..."
                  className={styles.questionInput}
                  rows={3}
                />
              </div>

              <div className={styles.optionsContainer}>
                <div className={styles.optionsHeader}>
                  <span>선택지</span>
                  <button
                    onClick={() => addAnswerOption(question.id)}
                    className={styles.addOptionButton}
                  >
                    + 선택지 추가
                  </button>
                </div>

                {question.answerOptions.map((option, optionIndex) => (
                  <div key={option.id} className={styles.optionRow}>
                    <span className={styles.optionNumber}>{optionIndex + 1}</span>
                    <input
                      type="text"
                      value={option.content}
                      onChange={(e) => updateAnswerOption(question.id, option.id, { 
                        content: e.target.value 
                      })}
                      placeholder="선택지 내용"
                      className={styles.optionInput}
                    />
                    <input
                      type="number"
                      value={option.value}
                      onChange={(e) => updateAnswerOption(question.id, option.id, { 
                        value: e.target.value 
                      })}
                      placeholder="점수"
                      className={styles.scoreInput}
                    />
                    {question.answerOptions.length > 2 && (
                      <button
                        onClick={() => removeAnswerOption(question.id, option.id)}
                        className={styles.removeOptionButton}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={addQuestion}
            className={styles.addQuestionButton}
          >
            + 새 질문 추가
          </button>
        </div>

        <div className={styles.actions}>
          <button
            onClick={saveQuestions}
            disabled={saving}
            className={styles.saveButton}
          >
            {saving ? '저장 중...' : '질문 저장'}
          </button>
        </div>
      </div>
    </div>
  )
}