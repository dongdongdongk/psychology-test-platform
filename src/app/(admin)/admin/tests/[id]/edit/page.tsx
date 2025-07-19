'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Test, Question, AnswerOption } from '@/types'
import styles from './EditTest.module.scss'

export default function EditTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    thumbnailUrl: '',
    detailImageUrl: '',
    styleTheme: 'modern',
    isActive: true,
    questions: [] as Question[]
  })

  useEffect(() => {
    fetchTest()
  }, [testId])

  const fetchTest = async () => {
    try {
      const response = await axios.get(`/api/admin/tests/${testId}`)
      const testData = response.data
      
      setTest(testData)
      setFormData({
        title: testData.title || '',
        description: testData.description || '',
        category: testData.category || '',
        thumbnailUrl: testData.thumbnailUrl || '',
        detailImageUrl: testData.detailImageUrl || '',
        styleTheme: testData.styleTheme || 'modern',
        isActive: testData.isActive ?? true,
        questions: testData.questions || []
      })
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/admin/login')
        return
      }
      setError('테스트 정보를 불러오는데 실패했습니다.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      content: '',
      order: formData.questions.length + 1,
      type: 'single',
      options: [
        { content: '', value: {}, order: 1 },
        { content: '', value: {}, order: 2 }
      ]
    }
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const updateQuestion = (questionIndex: number, field: keyof Question, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => 
        idx === questionIndex ? { ...q, [field]: value } : q
      )
    }))
  }

  const deleteQuestion = (questionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== questionIndex)
        .map((q, idx) => ({ ...q, order: idx + 1 }))
    }))
  }

  const addOption = (questionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, idx) => 
        idx === questionIndex 
          ? {
              ...q,
              options: [...q.options, {
                content: '',
                value: {},
                order: q.options.length + 1
              }]
            }
          : q
      )
    }))
  }

  const updateOption = (questionIndex: number, optionIndex: number, field: keyof AnswerOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIdx) => 
        qIdx === questionIndex 
          ? {
              ...q,
              options: q.options.map((opt, oIdx) => 
                oIdx === optionIndex ? { ...opt, [field]: value } : opt
              )
            }
          : q
      )
    }))
  }

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, qIdx) => 
        qIdx === questionIndex 
          ? {
              ...q,
              options: q.options.filter((_, oIdx) => oIdx !== optionIndex)
                .map((opt, idx) => ({ ...opt, order: idx + 1 }))
            }
          : q
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('테스트 제목을 입력해주세요.')
      return
    }

    setSaving(true)
    try {
      await axios.put(`/api/admin/tests/${testId}`, formData)
      alert('테스트가 성공적으로 수정되었습니다.')
      router.push('/admin/tests')
    } catch (error: any) {
      alert(error.response?.data?.error || '테스트 수정에 실패했습니다.')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (confirm('수정을 취소하시겠습니까? 변경사항이 저장되지 않습니다.')) {
      router.push('/admin/tests')
    }
  }

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>오류가 발생했습니다</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/admin/tests')} className={styles.backButton}>
          목록으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>테스트 수정</h1>
        <p>테스트 '{test?.title}'의 정보를 수정합니다</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>기본 정보</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="title">테스트 제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="테스트 제목을 입력하세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">테스트 설명</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="테스트에 대한 설명을 입력하세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">카테고리</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="예: 성격, 심리, 연애 등"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>이미지 설정</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="thumbnailUrl">썸네일 이미지 URL</label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="https://example.com/thumbnail.jpg"
            />
            {formData.thumbnailUrl && (
              <div className={styles.imagePreview}>
                <img src={formData.thumbnailUrl} alt="썸네일 미리보기" />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="detailImageUrl">상세 이미지 URL</label>
            <input
              type="url"
              id="detailImageUrl"
              name="detailImageUrl"
              value={formData.detailImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/detail.jpg"
            />
            {formData.detailImageUrl && (
              <div className={styles.imagePreview}>
                <img src={formData.detailImageUrl} alt="상세 이미지 미리보기" />
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>질문 관리</h2>
          <div className={styles.questionsContainer}>
            {formData.questions.map((question, qIdx) => (
              <div key={question.id} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <h3>질문 {qIdx + 1}</h3>
                  <button 
                    type="button" 
                    onClick={() => deleteQuestion(qIdx)}
                    className={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
                
                <div className={styles.formGroup}>
                  <label>질문 내용</label>
                  <textarea
                    value={question.content}
                    onChange={(e) => updateQuestion(qIdx, 'content', e.target.value)}
                    placeholder="질문을 입력하세요"
                    rows={3}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>질문 타입</label>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                  >
                    <option value="single">단일 선택</option>
                    <option value="multiple">다중 선택</option>
                  </select>
                </div>

                <div className={styles.optionsContainer}>
                  <h4>선택지</h4>
                  {question.options.map((option, oIdx) => (
                    <div key={oIdx} className={styles.optionRow}>
                      <input
                        type="text"
                        value={option.content}
                        onChange={(e) => updateOption(qIdx, oIdx, 'content', e.target.value)}
                        placeholder={`선택지 ${oIdx + 1}`}
                      />
                      <input
                        type="text"
                        value={JSON.stringify(option.value)}
                        onChange={(e) => {
                          try {
                            const value = JSON.parse(e.target.value)
                            updateOption(qIdx, oIdx, 'value', value)
                          } catch {}
                        }}
                        placeholder='{"A": -1, "B": 3}'
                      />
                      <button
                        type="button"
                        onClick={() => deleteOption(qIdx, oIdx)}
                        className={styles.deleteOptionButton}
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIdx)}
                    className={styles.addOptionButton}
                  >
                    선택지 추가
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className={styles.addQuestionButton}
            >
              질문 추가
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h2>스타일 설정</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="styleTheme">테마</label>
            <select
              id="styleTheme"
              name="styleTheme"
              value={formData.styleTheme}
              onChange={handleChange}
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="playful">Playful</option>
              <option value="elegant">Elegant</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              테스트 활성화
            </label>
            <p className={styles.helpText}>
              비활성화된 테스트는 사용자에게 노출되지 않습니다.
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  )
}