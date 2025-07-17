'use client'

import { useState } from 'react'
import { useTestCreationStore } from '@/store/testCreationStore'
import styles from './Step3ResultTypes.module.scss'

export default function Step3ResultTypes() {
  const {
    resultTypes,
    setResultTypes
  } = useTestCreationStore()

  const [currentResultIndex, setCurrentResultIndex] = useState(0)

  const updateResultType = (resultIndex: number, field: string, value: string) => {
    const updatedResults = [...resultTypes]
    updatedResults[resultIndex] = {
      ...updatedResults[resultIndex],
      [field]: value
    }
    setResultTypes(updatedResults)
  }

  const getCurrentResult = () => resultTypes[currentResultIndex]

  const getResultStatus = (index: number) => {
    const result = resultTypes[index]
    if (!result) return 'empty'
    
    const hasName = result.name.trim() !== ''
    const hasDescription = result.description.trim() !== ''
    
    if (hasName && hasDescription) return 'completed'
    if (hasName || hasDescription) return 'partial'
    return 'empty'
  }

  const getCompletionStatus = () => {
    const completedResults = resultTypes.filter(r => 
      r.name && r.description
    ).length
    return `${completedResults}/${resultTypes.length}`
  }

  const isCurrentResultValid = () => {
    const current = getCurrentResult()
    return current?.name && current?.description
  }

  const goToResult = (index: number) => {
    setCurrentResultIndex(index)
  }

  const goToNextResult = () => {
    if (currentResultIndex < resultTypes.length - 1) {
      setCurrentResultIndex(currentResultIndex + 1)
    }
  }

  const goToPreviousResult = () => {
    if (currentResultIndex > 0) {
      setCurrentResultIndex(currentResultIndex - 1)
    }
  }

  if (!resultTypes.length) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>결과 타입을 먼저 1단계에서 정의해주세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>3단계: 결과 타입 상세 설정</h2>
        <p>각 결과 타입의 상세 정보를 설정해주세요</p>
        <div className={styles.progress}>
          <span className={styles.progressText}>진행률: {getCompletionStatus()}</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(resultTypes.filter(r => r.name && r.description).length / resultTypes.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.typeInfo}>
        <div className={styles.infoItem}>
          <span>전체 결과 타입:</span>
          <span className={styles.infoValue}>{resultTypes.length}개</span>
        </div>
        <div className={styles.infoItem}>
          <span>완료된 타입:</span>
          <span className={styles.infoValue}>{resultTypes.filter(r => r.name && r.description).length}개</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <h3>결과 타입 목록</h3>
          <div className={styles.resultList}>
            {resultTypes.map((result, index) => (
              <button
                key={result.id}
                onClick={() => goToResult(index)}
                className={`${styles.resultItem} ${
                  index === currentResultIndex ? styles.active : ''
                } ${styles[getResultStatus(index)]}`}
              >
                <div className={styles.resultHeader}>
                  <span className={styles.resultNumber}>{index + 1}</span>
                  <span className={styles.resultStatus}>
                    {getResultStatus(index) === 'completed' ? '✓' : 
                     getResultStatus(index) === 'partial' ? '⚠' : '○'}
                  </span>
                </div>
                <div className={styles.resultInfo}>
                  <div className={styles.resultName}>
                    {result.name || `결과 ${index + 1}`}
                  </div>
                  <div className={styles.resultId}>
                    {result.id}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.resultHeader}>
            <h3>결과 타입: {getCurrentResult()?.name || `타입 ${currentResultIndex + 1}`}</h3>
            <div className={styles.navigation}>
              <button 
                onClick={goToPreviousResult}
                disabled={currentResultIndex === 0}
                className={styles.navButton}
              >
                ← 이전
              </button>
              <button 
                onClick={goToNextResult}
                disabled={currentResultIndex === resultTypes.length - 1}
                className={styles.navButton}
              >
                다음 →
              </button>
            </div>
          </div>

          <div className={styles.resultForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                결과 타입 이름 *
              </label>
              <input
                type="text"
                value={getCurrentResult()?.name || ''}
                onChange={(e) => updateResultType(currentResultIndex, 'name', e.target.value)}
                placeholder="예: A형, 외향형, 리더형 등"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                결과 설명 *
              </label>
              <textarea
                value={getCurrentResult()?.description || ''}
                onChange={(e) => updateResultType(currentResultIndex, 'description', e.target.value)}
                placeholder="이 결과에 대한 자세한 설명을 입력하세요..."
                className={styles.textarea}
                rows={5}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                결과 이미지 URL
              </label>
              <input
                type="url"
                value={getCurrentResult()?.imageUrl || ''}
                onChange={(e) => updateResultType(currentResultIndex, 'imageUrl', e.target.value)}
                placeholder="https://example.com/result-image.jpg"
                className={styles.input}
              />
              <p className={styles.help}>결과 페이지에서 표시될 이미지</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                결과 텍스트 이미지 URL
              </label>
              <input
                type="url"
                value={getCurrentResult()?.textImageUrl || ''}
                onChange={(e) => updateResultType(currentResultIndex, 'textImageUrl', e.target.value)}
                placeholder="https://example.com/result-text.jpg"
                className={styles.input}
              />
              <p className={styles.help}>결과 설명과 함께 표시될 텍스트 이미지</p>
            </div>

            {isCurrentResultValid() && (
              <div className={styles.validationSuccess}>
                ✓ 이 결과 타입이 완료되었습니다!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalSummary}>
          <h4>전체 결과 설정 요약</h4>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span>결과 타입 수:</span>
              <span className={styles.summaryValue}>{resultTypes.length}개</span>
            </div>
            <div className={styles.summaryItem}>
              <span>완료된 결과:</span>
              <span className={styles.summaryValue}>
                {resultTypes.filter(r => r.name && r.description).length}개
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>시스템 방식:</span>
              <span className={styles.summaryValue}>타입별 점수 방식</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}