'use client'

import { useState } from 'react'
import { useTestCreationStore } from '@/store/testCreationStore'
import Step1BasicSettings from '@/components/admin/testCreation/Step1BasicSettings'
import Step2Questions from '@/components/admin/testCreation/Step2Questions'
import Step3ResultTypes from '@/components/admin/testCreation/Step3ResultTypes'
import StepProgress from '@/components/admin/testCreation/StepProgress'
import styles from './CreateTest.module.scss'

export default function CreateTestPage() {
  const { 
    currentStep, 
    setCurrentStep, 
    validateStep, 
    resetTestCreation,
    isComplete 
  } = useTestCreationStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        // 1단계에서 2단계로 넘어갈 때 질문 초기화
        useTestCreationStore.getState().initializeQuestionsAndOptions()
      } else if (currentStep === 2) {
        // 2단계에서 3단계로 넘어갈 때 결과 타입 초기화
        useTestCreationStore.getState().initializeResultTypes()
      }
      setCurrentStep(currentStep + 1)
    } else {
      alert('필수 항목을 모두 입력해주세요.')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      alert('모든 항목을 완료해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const store = useTestCreationStore.getState()
      
      // API에 전달할 데이터 구조화
      const testData = {
        title: store.title,
        description: store.description,
        category: store.category,
        thumbnailUrl: store.thumbnailUrl,
        detailImageUrl: store.detailImageUrl,
        questionCount: store.questionCount,
        optionCount: store.optionCount,
        styleTheme: store.styleTheme,
        questions: store.questions,
        resultTypes: store.resultTypes
      }
      
      // API 호출로 테스트 데이터 저장
      const response = await fetch('/api/admin/tests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '테스트 생성에 실패했습니다.')
      }

      const result = await response.json()
      alert(`테스트가 성공적으로 생성되었습니다! ID: ${result.test.id}`)
      
      // 성공 시 초기화하고 관리자 페이지로 이동
      resetTestCreation()
      window.location.href = '/admin/tests'
    } catch (error) {
      console.error('테스트 생성 실패:', error)
      alert(error instanceof Error ? error.message : '테스트 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicSettings />
      case 2:
        return <Step2Questions />
      case 3:
        return <Step3ResultTypes />
      default:
        return <Step1BasicSettings />
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>새 테스트 생성</h1>
        <p>3단계로 나누어 체계적으로 테스트를 생성합니다</p>
      </div>

      <StepProgress currentStep={currentStep} />

      <div className={styles.content}>
        {renderCurrentStep()}
      </div>

      <div className={styles.actions}>
        {currentStep > 1 && (
          <button 
            onClick={handlePrevious}
            className={styles.prevButton}
          >
            이전 단계
          </button>
        )}
        
        <div className={styles.rightActions}>
          <button 
            onClick={resetTestCreation}
            className={styles.resetButton}
          >
            처음부터 다시
          </button>
          
          {currentStep < 3 ? (
            <button 
              onClick={handleNext}
              className={styles.nextButton}
              disabled={!validateStep(currentStep)}
            >
              다음 단계
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className={styles.submitButton}
              disabled={!validateStep(3) || isSubmitting}
            >
              {isSubmitting ? '생성 중...' : '테스트 생성 완료'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}