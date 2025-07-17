'use client'

import { useState, useEffect } from 'react'
import { useTestCreationStore } from '@/store/testCreationStore'
import styles from './Step2Questions.module.scss'

export default function Step2Questions() {
  const {
    questionCount,
    optionCount,
    questions,
    setQuestions
  } = useTestCreationStore()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

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

  const getCurrentQuestion = () => questions[currentQuestionIndex]
  const getCompletionStatus = () => {
    const completedQuestions = questions.filter(q => 
      q.content && q.options.every(o => o.content && typeof o.score === 'number')
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
    return current?.content && current.options.every(o => o.content && typeof o.score === 'number')
  }

  const getQuestionStatus = (index: number) => {
    const question = questions[index]
    if (!question) return 'empty'
    
    const hasContent = question.content.trim() !== ''
    const hasValidOptions = question.options.every(o => 
      o.content.trim() !== '' && typeof o.score === 'number'
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
                    <div className={styles.optionNumber}>
                      {String.fromCharCode(65 + optionIndex)}
                    </div>
                    <div className={styles.optionContent}>
                      <input
                        type="text"
                        value={option.content}
                        onChange={(e) => updateOption(currentQuestionIndex, optionIndex, 'content', e.target.value)}
                        placeholder={`선택지 ${String.fromCharCode(65 + optionIndex)} 내용`}
                        className={styles.optionInput}
                      />
                    </div>
                    <div className={styles.optionScore}>
                      <label className={styles.scoreLabel}>점수</label>
                      <input
                        type="number"
                        value={option.score}
                        onChange={(e) => updateOption(currentQuestionIndex, optionIndex, 'score', parseInt(e.target.value) || 0)}
                        className={styles.scoreInput}
                        min="0"
                        max="10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.questionSummary}>
              <div className={styles.summaryItem}>
                <span>현재 문제 최고 점수:</span>
                <span className={styles.summaryValue}>
                  {Math.max(...(getCurrentQuestion()?.options.map(o => o.score) || [0]))}점
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span>현재 문제 최저 점수:</span>
                <span className={styles.summaryValue}>
                  {Math.min(...(getCurrentQuestion()?.options.map(o => o.score) || [0]))}점
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
          <h4>전체 점수 범위</h4>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span>최고 점수:</span>
              <span className={styles.summaryValue}>
                {questions.reduce((total, q) => total + Math.max(...(q.options.map(o => o.score) || [0])), 0)}점
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>최저 점수:</span>
              <span className={styles.summaryValue}>
                {questions.reduce((total, q) => total + Math.min(...(q.options.map(o => o.score) || [0])), 0)}점
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>완료된 문제:</span>
              <span className={styles.summaryValue}>
                {questions.filter(q => q.content && q.options.every(o => o.content)).length}개
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}