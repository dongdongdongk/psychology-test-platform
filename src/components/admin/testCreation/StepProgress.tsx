'use client'

import styles from './StepProgress.module.scss'

interface StepProgressProps {
  currentStep: number
}

const steps = [
  { number: 1, title: '기본 설정', description: '테스트 정보 및 구조 설정' },
  { number: 2, title: '문제 작성', description: '질문과 선택지 입력' },
  { number: 3, title: '결과 설정', description: '점수별 결과 타입 정의' }
]

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className={styles.container}>
      <div className={styles.progressLine}>
        <div 
          className={styles.progressFill}
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className={styles.steps}>
        {steps.map((step) => (
          <div
            key={step.number}
            className={`${styles.step} ${
              step.number === currentStep ? styles.active : ''
            } ${step.number < currentStep ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}>
              {step.number < currentStep ? '✓' : step.number}
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDescription}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}