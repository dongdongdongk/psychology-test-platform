'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import PageLoader from '@/components/common/PageLoader'
import { Test, Question, AnswerOption, TestResultTypes, TestResultType } from '@/types'
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
    enableRadarChart: false,
    enableBarChart: false,
    showResultImage: true,
    showTextImage: true,
    questions: [] as Question[],
    resultTypes: {} as TestResultTypes
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
        enableRadarChart: testData.enableRadarChart ?? false,
        enableBarChart: testData.enableBarChart ?? false,
        showResultImage: testData.showResultImage ?? true,
        showTextImage: testData.showTextImage ?? true,
        questions: testData.questions || [],
        resultTypes: testData.resultTypes || {}
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

  const addResultType = () => {
    setFormData(prev => {
      // 사용 가능한 기본 ID 찾기 (A, B, C, ...)
      const existingIds = Object.keys(prev.resultTypes)
      let newTypeId = 'A'
      
      for (let i = 0; i < 26; i++) {
        const id = String.fromCharCode(65 + i) // A부터 Z까지
        if (!existingIds.includes(id)) {
          newTypeId = id
          break
        }
      }
      
      // A-Z가 모두 사용된 경우
      if (existingIds.includes(newTypeId)) {
        let counter = 1
        while (existingIds.includes(`TYPE${counter}`)) {
          counter++
        }
        newTypeId = `TYPE${counter}`
      }
      
      return {
        ...prev,
        resultTypes: {
          ...prev.resultTypes,
          [newTypeId]: {
            title: '',
            description: '',
            description_url: '',
            image_url: ''
          }
        }
      }
    })
  }

  const updateResultType = (typeId: string, field: keyof TestResultType, value: string) => {
    setFormData(prev => ({
      ...prev,
      resultTypes: {
        ...prev.resultTypes,
        [typeId]: {
          ...prev.resultTypes[typeId],
          [field]: value
        }
      }
    }))
  }

  const deleteResultType = (typeId: string) => {
    setFormData(prev => {
      const newResultTypes = { ...prev.resultTypes }
      delete newResultTypes[typeId]
      return {
        ...prev,
        resultTypes: newResultTypes
      }
    })
  }

  const updateResultTypeId = (oldId: string, newId: string) => {
    if (oldId === newId) return
    
    setFormData(prev => {
      const newResultTypes = { ...prev.resultTypes }
      
      // 새 ID가 이미 존재하는지 확인
      if (newResultTypes[newId]) {
        alert(`결과 타입 ID "${newId}"가 이미 존재합니다.`)
        return prev
      }
      
      // 기존 데이터를 새 ID로 이동
      newResultTypes[newId] = { ...newResultTypes[oldId] }
      delete newResultTypes[oldId]
      
      return {
        ...prev,
        resultTypes: newResultTypes
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('테스트 제목을 입력해주세요.')
      return
    }

    // 결과 타입 유효성 검사
    const resultTypeIds = Object.keys(formData.resultTypes)
    if (resultTypeIds.length === 0) {
      alert('최소 1개 이상의 결과 타입이 필요합니다.')
      return
    }

    // 결과 타입별 필수 정보 확인
    for (const [typeId, resultType] of Object.entries(formData.resultTypes)) {
      // 결과 타입 ID 형식 검사
      if (!/^[A-Z0-9_]+$/.test(typeId)) {
        alert(`결과 타입 ID "${typeId}"는 영문 대문자, 숫자, 언더스코어만 사용 가능합니다.`)
        return
      }
      if (!resultType.title?.trim()) {
        alert(`결과 타입 "${typeId}"의 이름을 입력해주세요.`)
        return
      }
      if (!resultType.description?.trim()) {
        alert(`결과 타입 "${typeId}"의 설명을 입력해주세요.`)
        return
      }
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
    return <PageLoader type="loading" message="테스트 정보를 불러오는 중..." showHeader={false} />
  }

  if (error) {
    return (
      <PageLoader 
        type="error" 
        title="테스트를 불러올 수 없습니다"
        message={error}
        customAction={
          <button onClick={() => router.push('/admin/tests')} className="theme-button">
            목록으로 돌아가기
          </button>
        }
        showHeader={false}
        showHomeButton={false}
      />
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
          <h2>결과 타입 관리</h2>
          <div className={styles.resultTypesContainer}>
            {Object.entries(formData.resultTypes).map(([typeId, resultType]) => (
              <div key={typeId} className={styles.resultTypeCard}>
                <div className={styles.resultTypeHeader}>
                  <h3>결과 타입 ID: {typeId}</h3>
                  <button 
                    type="button" 
                    onClick={() => deleteResultType(typeId)}
                    className={styles.deleteButton}
                  >
                    삭제
                  </button>
                </div>
                
                <div className={styles.formGroup}>
                  <label>결과 타입 ID *</label>
                  <input
                    type="text"
                    value={typeId}
                    onChange={(e) => {
                      // 입력값을 대문자로 변환하고 허용된 문자만 필터링
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '')
                      if (value !== typeId && value.length > 0) {
                        updateResultTypeId(typeId, value)
                      }
                    }}
                    placeholder="예: A, B, C, INTRO, EXTRO 등"
                    maxLength={20}
                    style={{
                      borderColor: /^[A-Z0-9_]+$/.test(typeId) ? '' : '#e74c3c'
                    }}
                  />
                  <p className={styles.helpText}>
                    영문 대문자, 숫자, 언더스코어만 사용 가능 (예: A, B, C, TYPE1, INTRO_TYPE)
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label>결과 타입 이름 *</label>
                  <input
                    type="text"
                    value={resultType.title}
                    onChange={(e) => updateResultType(typeId, 'title', e.target.value)}
                    placeholder="예: 외향적인 타입"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>결과 설명</label>
                  <textarea
                    value={resultType.description}
                    onChange={(e) => updateResultType(typeId, 'description', e.target.value)}
                    placeholder="결과에 대한 상세한 설명을 입력하세요"
                    rows={4}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>결과 이미지 URL</label>
                  <input
                    type="url"
                    value={resultType.image_url || ''}
                    onChange={(e) => updateResultType(typeId, 'image_url', e.target.value)}
                    placeholder="https://example.com/result-image.jpg"
                  />
                  {resultType.image_url && (
                    <div className={styles.imagePreview}>
                      <img src={resultType.image_url} alt="결과 이미지 미리보기" />
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>설명 이미지 URL</label>
                  <input
                    type="url"
                    value={resultType.description_url || ''}
                    onChange={(e) => updateResultType(typeId, 'description_url', e.target.value)}
                    placeholder="https://example.com/description-image.jpg"
                  />
                  {resultType.description_url && (
                    <div className={styles.imagePreview}>
                      <img src={resultType.description_url} alt="설명 이미지 미리보기" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addResultType}
              className={styles.addResultTypeButton}
            >
              결과 타입 추가
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
              <option value="modern">Modern - 모던하고 세련된 스타일</option>
              <option value="cute">Cute - 귀엽고 사랑스러운 스타일</option>
              <option value="dark">Dark - 다크하고 시크한 스타일</option>
              <option value="vibrant">Vibrant - 밝고 활기찬 스타일</option>
              <option value="minimal">Minimal - 심플하고 미니멀한 스타일</option>
              <option value="retro">Retro - 복고풍 스타일</option>
              <option value="medical">Medical - 병원 같은 깔끔하고 신뢰감 있는 스타일</option>
              <option value="soft">Soft - 부드럽고 온화한 파스텔 스타일</option>
              <option value="green">Green - 자연스럽고 편안한 녹색 스타일</option>
              <option value="brown">Brown - 따뜻하고 자연스러운 브라운 스타일</option>
              <option value="values">Values - 가치관 테스트용 지혜롭고 신뢰감 있는 스타일</option>
              <option value="blackwhite">Black & White - 블랙과 화이트의 세련된 테마</option>
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

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="enableRadarChart"
                checked={formData.enableRadarChart}
                onChange={handleChange}
              />
              레이더 차트 사용
            </label>
            <p className={styles.helpText}>
              결과 페이지에 레이더 차트를 표시합니다. 4-6개 영역으로 구성된 테스트에 적합합니다.
            </p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="enableBarChart"
                checked={formData.enableBarChart}
                onChange={handleChange}
              />
              막대 차트 사용
            </label>
            <p className={styles.helpText}>
              결과 페이지에 세로 막대 차트를 표시합니다. ABCD 영역별 점수 비교에 적합합니다.
            </p>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="showResultImage"
                  checked={formData.showResultImage}
                  onChange={handleChange}
                />
                결과 이미지 표시
              </label>
              <p className={styles.helpText}>
                결과 페이지에 메인 결과 이미지를 표시합니다.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="showTextImage"
                  checked={formData.showTextImage}
                  onChange={handleChange}
                />
                텍스트 이미지 표시
              </label>
              <p className={styles.helpText}>
                결과 페이지에 텍스트 설명 이미지를 표시합니다.
              </p>
            </div>
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