'use client'

import { useState } from 'react'
import { useTestCreationStore } from '@/store/testCreationStore'
import styles from './Step3ResultTypes.module.scss'

export default function Step3ResultTypes() {
  const {
    resultCount,
    resultTypes,
    setResultTypes,
    setBasicInfo,
    getMaxPossibleScore,
    getMinPossibleScore
  } = useTestCreationStore()

  const [currentResultIndex, setCurrentResultIndex] = useState(0)

  const maxScore = getMaxPossibleScore()
  const minScore = getMinPossibleScore()

  const updateResultType = (resultIndex: number, field: string, value: string | number) => {
    const updatedResults = [...resultTypes]
    updatedResults[resultIndex] = {
      ...updatedResults[resultIndex],
      [field]: value
    }
    setResultTypes(updatedResults)
  }

  const handleResultCountChange = (newCount: number) => {
    setBasicInfo({ resultCount: newCount })
    
    // 결과 개수 변경 시 결과 타입 재초기화
    const scoreRange = maxScore - minScore
    const scorePerResult = scoreRange / newCount
    
    const newResultTypes = Array.from({ length: newCount }, (_, i) => {
      const existingResult = resultTypes[i]
      return {
        id: existingResult?.id || `result_${i + 1}`,
        name: existingResult?.name || '',
        minScore: Math.floor(minScore + (scorePerResult * i)),
        maxScore: i === newCount - 1 ? maxScore : Math.floor(minScore + (scorePerResult * (i + 1)) - 1),
        imageUrl: existingResult?.imageUrl || '',
        textImageUrl: existingResult?.textImageUrl || '',
        description: existingResult?.description || ''
      }
    })
    
    setResultTypes(newResultTypes)
    
    // 현재 인덱스 조정
    if (currentResultIndex >= newCount) {
      setCurrentResultIndex(Math.max(0, newCount - 1))
    }
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
    return `${completedResults}/${resultCount}`
  }

  const isCurrentResultValid = () => {
    const current = getCurrentResult()
    return current?.name && current?.description
  }

  const goToResult = (index: number) => {
    setCurrentResultIndex(index)
  }

  const goToNextResult = () => {
    if (currentResultIndex < resultCount - 1) {
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
          <p>결과 타입을 초기화하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>3단계: 결과 타입 설정</h2>
        <p>점수 구간별 결과 타입을 정의해주세요</p>
        <div className={styles.progress}>
          <span className={styles.progressText}>진행률: {getCompletionStatus()}</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(resultTypes.filter(r => r.name && r.description).length / resultCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.scoreInfo}>
        <div className={styles.scoreItem}>
          <span>전체 점수 범위:</span>
          <span className={styles.scoreValue}>{minScore}점 ~ {maxScore}점</span>
        </div>
        <div className={styles.resultCountSetting}>
          <label>결과 개수:</label>
          <select
            value={resultCount}
            onChange={(e) => handleResultCountChange(parseInt(e.target.value))}
            className={styles.resultCountSelect}
          >
            {[3, 4, 5, 6, 7, 8].map(count => (
              <option key={count} value={count}>{count}개</option>
            ))}
          </select>
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
                  <div className={styles.resultScore}>
                    {result.minScore}~{result.maxScore}점
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.resultHeader}>
            <h3>결과 타입 {currentResultIndex + 1}</h3>
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
                disabled={currentResultIndex === resultCount - 1}
                className={styles.navButton}
              >
                다음 →
              </button>
            </div>
          </div>

          <div className={styles.resultForm}>
            <div className={styles.scoreRange}>
              <h4>점수 범위</h4>
              <div className={styles.scoreInputs}>
                <div className={styles.scoreInput}>
                  <label>최소 점수</label>
                  <input
                    type="number"
                    value={getCurrentResult()?.minScore || 0}
                    onChange={(e) => updateResultType(currentResultIndex, 'minScore', parseInt(e.target.value) || 0)}
                    min={minScore}
                    max={maxScore}
                    className={styles.input}
                  />
                </div>
                <div className={styles.scoreInput}>
                  <label>최대 점수</label>
                  <input
                    type="number"
                    value={getCurrentResult()?.maxScore || 0}
                    onChange={(e) => updateResultType(currentResultIndex, 'maxScore', parseInt(e.target.value) || 0)}
                    min={minScore}
                    max={maxScore}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                결과 이름 *
              </label>
              <input
                type="text"
                value={getCurrentResult()?.name || ''}
                onChange={(e) => updateResultType(currentResultIndex, 'name', e.target.value)}
                placeholder="예: 파스타형, 외향적 성격, 높은 스트레스 등"
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
              <span>결과 개수:</span>
              <span className={styles.summaryValue}>{resultCount}개</span>
            </div>
            <div className={styles.summaryItem}>
              <span>완료된 결과:</span>
              <span className={styles.summaryValue}>
                {resultTypes.filter(r => r.name && r.description).length}개
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>점수 범위:</span>
              <span className={styles.summaryValue}>{minScore}~{maxScore}점</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}