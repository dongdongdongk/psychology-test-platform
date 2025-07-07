'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { stressTestQuestions, calculateStressResult } from '@/data/stress-test'
import axios from 'axios'
import styles from './StressQuiz.module.scss'

export default function StressQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleAnswerSelect = (questionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }))
  }

  const handleNext = () => {
    if (currentQuestion < stressTestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const result = calculateStressResult(answers)
      
      // Save response to database
      await axios.post('/api/responses', {
        testId: 'stress-test',
        responseData: answers,
        resultData: result
      })
      
      // Navigate to result page
      router.push(`/tests/stress-test/result/${result.type}`)
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('테스트 제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / stressTestQuestions.length) * 100
  const currentQ = stressTestQuestions[currentQuestion]
  const isAnswered = answers[currentQ.id] !== undefined

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {currentQuestion + 1} / {stressTestQuestions.length}
          </span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.questionCard}>
          <h2 className={styles.questionTitle}>
            Q{currentQuestion + 1}. {currentQ.question}
          </h2>
          
          <div className={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.option} ${
                  answers[currentQ.id] === option.score ? styles.selected : ''
                }`}
                onClick={() => handleAnswerSelect(currentQ.id, option.score)}
              >
                {option.text}
              </button>
            ))}
          </div>
          
          <div className={styles.navigation}>
            {currentQuestion > 0 && (
              <button
                className={styles.backButton}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                이전
              </button>
            )}
            
            <button
              className={`${styles.nextButton} ${!isAnswered ? styles.disabled : ''}`}
              onClick={handleNext}
              disabled={!isAnswered || isSubmitting}
            >
              {isSubmitting ? '제출 중...' : 
               currentQuestion === stressTestQuestions.length - 1 ? '결과 보기' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}