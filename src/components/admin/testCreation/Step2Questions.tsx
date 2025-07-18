'use client'

import { useState, useEffect } from 'react'
import { useTestCreationStore } from '@/store/testCreationStore'
import styles from './Step2Questions.module.scss'

export default function Step2Questions() {
  const {
    questionCount,
    optionCount,
    questions,
    resultTypes,
    setQuestions,
    generateResultTypesFromQuestions
  } = useTestCreationStore()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})

  const getInputKey = (questionIndex: number, optionIndex: number) => 
    `q_${questionIndex}_o_${optionIndex}`

  // 컴포넌트 마운트 시 scores 객체 초기화 확인 및 input values 설정
  useEffect(() => {
    if (questions.length > 0) {
      const needsInitialization = questions.some(q => 
        q.options.some(o => !o.scores)
      )
      
      if (needsInitialization) {
        const updatedQuestions = questions.map(q => ({
          ...q,
          options: q.options.map(o => ({
            ...o,
            scores: o.scores || {} // 빈 객체로 초기화
          }))
        }))
        
        setQuestions(updatedQuestions)
      }
      
      // input values 초기화
      const newInputValues: { [key: string]: string } = {}
      questions.forEach((q, qIndex) => {
        q.options.forEach((o, oIndex) => {
          const key = getInputKey(qIndex, oIndex)
          newInputValues[key] = getScoreString(o)
        })
      })
      setInputValues(newInputValues)
    }
  }, [questions])

  const updateQuestion = (questionIndex: number, field: string, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    }
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, field: string, value: string | number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value
    }
    setQuestions(updatedQuestions)
  }

  const updateOptionScore = (questionIndex: number, optionIndex: number, resultTypeId: string, score: number) => {
    const updatedQuestions = [...questions]
    const option = updatedQuestions[questionIndex].options[optionIndex]
    
    // scores 객체가 없으면 초기화
    if (!option.scores) {
      option.scores = {}
    }
    
    option.scores = {
      ...option.scores,
      [resultTypeId]: score
    }
    
    setQuestions(updatedQuestions)
  }

  const updateOptionScoreString = (questionIndex: number, optionIndex: number, scoreString: string) => {
    console.log('updateOptionScoreString called:', { questionIndex, optionIndex, scoreString })
    
    const updatedQuestions = [...questions]
    const option = updatedQuestions[questionIndex].options[optionIndex]
    
    console.log('Current option:', option)
    
    // scores 객체가 없으면 초기화
    if (!option.scores) {
      option.scores = {}
    }
    
    // 문자열 파싱: "A:2, B:1, C:0" -> {A: 2, B: 1, C: 0}
    const scores: { [key: string]: number } = {}
    
    if (scoreString.trim()) {
      const parts = scoreString.split(',').map(s => s.trim())
      console.log('Parts:', parts)
      
      for (const part of parts) {
        const [typeId, scoreStr] = part.split(':').map(s => s.trim())
        console.log('Processing part:', { typeId, scoreStr })
        
        if (typeId && scoreStr) {
          const score = parseInt(scoreStr)
          if (!isNaN(score)) {
            scores[typeId] = score
          }
        }
      }
    }
    
    console.log('Final scores:', scores)
    option.scores = scores
    setQuestions(updatedQuestions)
    
    // 점수 입력 시 결과 타입 동적 생성
    generateResultTypesFromQuestions()
  }

  const getScoreString = (option: any): string => {
    console.log('getScoreString called with option:', option)
    
    if (!option.scores) {
      console.log('No scores found')
      return ''
    }
    
    // 점수가 0인 항목들은 제외하고 실제 점수가 있는 것만 표시
    const result = Object.entries(option.scores)
      .filter(([typeId, score]) => score !== 0)
      .map(([typeId, score]) => `${typeId}:${score}`)
      .join(', ')
    
    console.log('getScoreString result:', result)
    return result
  }

  const getCurrentQuestion = () => questions[currentQuestionIndex]
  const getCompletionStatus = () => {
    const completedQuestions = questions.filter(q => 
      q.content && q.options.every(o => o.content && o.scores && Object.keys(o.scores).length > 0)
    ).length
    return `${completedQuestions}/${questionCount}`
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questionCount - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const isCurrentQuestionValid = () => {
    const current = getCurrentQuestion()
    return current?.content && current.options.every(o => o.content && o.scores && Object.keys(o.scores).length > 0)
  }

  const getQuestionStatus = (index: number) => {
    const question = questions[index]
    if (!question) return 'empty'
    
    const hasContent = question.content.trim() !== ''
    const hasValidOptions = question.options.every(o => 
      o.content.trim() !== '' && o.scores && Object.keys(o.scores).length > 0
    )
    
    if (hasContent && hasValidOptions) return 'completed'
    if (hasContent || question.options.some(o => o.content.trim() !== '')) return 'partial'
    return 'empty'
  }

  if (!questions.length) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>질문을 초기화하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>2단계: 문제 및 선택지 입력</h2>
        <p>각 문제의 질문과 선택지를 입력해주세요</p>
        <div className={styles.progress}>
          <span className={styles.progressText}>진행률: {getCompletionStatus()}</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(questions.filter(q => q.content && q.options.every(o => o.content)).length / questionCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <h3>문제 목록</h3>
          <div className={styles.questionList}>
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`${styles.questionItem} ${
                  index === currentQuestionIndex ? styles.active : ''
                } ${styles[getQuestionStatus(index)]}`}
              >
                <span className={styles.questionNumber}>{index + 1}</span>
                <span className={styles.questionStatus}>
                  {getQuestionStatus(index) === 'completed' ? '✓' : 
                   getQuestionStatus(index) === 'partial' ? '⚠' : '○'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.questionHeader}>
            <h3>문제 {currentQuestionIndex + 1}</h3>
            <div className={styles.navigation}>
              <button 
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={styles.navButton}
              >
                ← 이전
              </button>
              <button 
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questionCount - 1}
                className={styles.navButton}
              >
                다음 →
              </button>
            </div>
          </div>

          <div className={styles.questionForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                질문 내용 *
              </label>
              <textarea
                value={getCurrentQuestion()?.content || ''}
                onChange={(e) => updateQuestion(currentQuestionIndex, 'content', e.target.value)}
                placeholder="질문을 입력하세요..."
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.optionsSection}>
              <h4>선택지 ({optionCount}개)</h4>
              <div className={styles.optionsList}>
                {getCurrentQuestion()?.options.map((option, optionIndex) => (
                  <div key={option.id} className={styles.optionItem}>
                    <div className={styles.optionHeader}>
                      <div className={styles.optionNumber}>
                        {optionIndex + 1}
                      </div>
                      <div className={styles.optionTitle}>
                        선택지 {optionIndex + 1}
                      </div>
                    </div>
                    
                    <div className={styles.optionContent}>
                      <input
                        type="text"
                        value={option.content}
                        onChange={(e) => updateOption(currentQuestionIndex, optionIndex, 'content', e.target.value)}
                        placeholder={`선택지 ${optionIndex + 1} 내용을 입력하세요`}
                        className={styles.optionInput}
                      />
                    </div>
                    
                    <div className={styles.optionScores}>
                      <h5>결과 타입별 점수</h5>
                      <div className={styles.scoreStringInput}>
                        <input
                          type="text"
                          value={inputValues[getInputKey(currentQuestionIndex, optionIndex)] || ''}
                          onChange={(e) => {
                            console.log('Input onChange triggered:', e.target.value)
                            const key = getInputKey(currentQuestionIndex, optionIndex)
                            const value = e.target.value
                            setInputValues(prev => ({ ...prev, [key]: value }))
                            
                            // 실시간으로 점수 업데이트하지 않고 onBlur에서 처리
                          }}
                          onBlur={(e) => {
                            console.log('Input onBlur triggered:', e.target.value)
                            updateOptionScoreString(currentQuestionIndex, optionIndex, e.target.value)
                          }}
                          placeholder="A:2, B:1, C:0 (타입:점수 형태로 입력)"
                          className={styles.scoreStringField}
                        />
                        <p className={styles.scoreHelp}>
                          예시: A:3, B:1, C:0 → A타입 3점, B타입 1점, C타입 0점
                        </p>
                      </div>
                      
                      {/* 현재 설정된 점수 표시 */}
                      {option.scores && Object.keys(option.scores).length > 0 && (
                        <div className={styles.scorePreview}>
                          <span>현재 점수:</span>
                          <div className={styles.scorePreviewItems}>
                            {Object.entries(option.scores).map(([typeId, score]) => (
                              <span key={typeId} className={styles.scorePreviewItem}>
                                {typeId}: {score}점
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.questionSummary}>
              <div className={styles.summaryItem}>
                <span>현재 문제 상태:</span>
                <span className={styles.summaryValue}>
                  {getQuestionStatus(currentQuestionIndex) === 'completed' ? '완료' : 
                   getQuestionStatus(currentQuestionIndex) === 'partial' ? '진행중' : '미완료'}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span>설정된 타입별 점수:</span>
                <span className={styles.summaryValue}>
                  {resultTypes.length}개 타입
                </span>
              </div>
            </div>

            {isCurrentQuestionValid() && (
              <div className={styles.validationSuccess}>
                ✓ 이 문제가 완료되었습니다!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalSummary}>
          <h4>전체 진행 상황</h4>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span>완료된 문제:</span>
              <span className={styles.summaryValue}>
                {questions.filter(q => q.content && q.options.every(o => o.content && o.scores && Object.keys(o.scores).length > 0)).length}개
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>전체 문제:</span>
              <span className={styles.summaryValue}>
                {questionCount}개
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>결과 타입:</span>
              <span className={styles.summaryValue}>
                {resultTypes.length}개
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}