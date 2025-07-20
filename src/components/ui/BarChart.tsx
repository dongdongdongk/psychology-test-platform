'use client'

import { DetailedScores } from '@/hooks/useTestResult'
import styles from './BarChart.module.scss'

interface BarChartProps {
  detailedScores: DetailedScores
  testId: string
  resultTypes?: any // result_types JSONB 데이터
  className?: string
}

interface BarData {
  label: string
  value: number
  maxValue: number
  color: string
  description: string
}

export default function BarChart({ detailedScores, testId, resultTypes, className = '' }: BarChartProps) {
  // 모든 테스트가 ABCD 점수를 가지므로 detailedScores는 항상 존재

  console.log('=== BarChart 디버깅 ===')
  console.log('testId:', testId)
  console.log('resultTypes:', resultTypes)
  console.log('resultTypes 타입:', typeof resultTypes)

  // 스트레스 테스트인지 확인하여 레이블 결정
  const isStressTestChart = testId === 'stresscheck001test2025' || testId.includes('stress')
  const maxValue = detailedScores.maxTotal ? detailedScores.maxTotal / 4 : 25

  // resultTypes에서 A, B, C, D에 해당하는 타입의 title 가져오기
  const getTypeTitle = (type: string): string => {
    console.log(`=== getTypeTitle(${type}) 호출 ===`)
    console.log('isStressTestChart:', isStressTestChart)
    
    if (isStressTestChart) {
      const stressLabels = {
        'A': '인지적 스트레스',
        'B': '정서적 스트레스', 
        'C': '신체적 스트레스',
        'D': '행동적 스트레스'
      }
      const result = stressLabels[type as keyof typeof stressLabels] || `${type} 유형`
      console.log(`스트레스 테스트 레이블: ${result}`)
      return result
    }

    if (resultTypes) {
      console.log('resultTypes 존재, 키 목록:', Object.keys(resultTypes))
      console.log('resultTypes 전체 데이터:', JSON.stringify(resultTypes, null, 2))
      
      // 다양한 키 패턴으로 시도
      const possibleKeys = [
        type.toLowerCase(), // a, b, c, d
        type.toUpperCase(), // A, B, C, D
        type, // A, B, C, D (원본)
      ]
      
      for (const key of possibleKeys) {
        const typeData = resultTypes[key]
        console.log(`키 "${key}"로 찾은 데이터:`, typeData)
        if (typeData && typeData.title) {
          console.log(`찾은 타이틀: ${typeData.title}`)
          return typeData.title
        }
      }
    }

    console.log(`기본값 반환: ${type} 유형`)
    return `${type} 유형`
  }

  // 막대 그래프 데이터 준비
  const barData: BarData[] = [
    {
      label: 'A',
      value: detailedScores.cognitive,
      maxValue: maxValue,
      color: '#6366f1', // 인디고
      description: getTypeTitle('A')
    },
    {
      label: 'B', 
      value: detailedScores.emotional,
      maxValue: maxValue,
      color: '#ec4899', // 핑크
      description: getTypeTitle('B')
    },
    {
      label: 'C',
      value: detailedScores.physical,
      maxValue: maxValue, 
      color: '#10b981', // 에메랄드
      description: getTypeTitle('C')
    },
    {
      label: 'D',
      value: detailedScores.behavioral,
      maxValue: maxValue,
      color: '#f59e0b', // 앰버
      description: getTypeTitle('D')
    }
  ]

  return (
    <div className={`${styles.barChart} ${className}`}>
      <h3 className={styles.title}>영역별 점수 분포</h3>
      
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <div className={styles.gridLines}>
            {[0, 25, 50, 75, 100].map(value => (
              <div 
                key={value} 
                className={styles.gridLine}
                style={{ left: `${(value / 100) * 100}%` }}
              />
            ))}
          </div>
          
          <div className={styles.bars}>
            {barData.map((bar, index) => {
              const width = (bar.value / bar.maxValue) * 100
              
              console.log(`막대 ${bar.label}: value=${bar.value}, maxValue=${bar.maxValue}, width=${width}%`)
              
              return (
                <div key={bar.label} className={styles.barContainer}>
                  <div className={styles.barLabel}>
                    <span className={styles.labelDescription}>{bar.description}</span>
                  </div>
                  
                  <div className={styles.barWrapper}>
                    <div 
                      className={styles.bar}
                      style={{ 
                        width: `${width}%`,
                        backgroundColor: bar.color,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className={styles.barValue}>
                        {bar.value}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className={styles.xAxis}>
          <div className={styles.xAxisTicks}>
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItems}>
          {barData.map(bar => (
            <div key={bar.label} className={styles.legendItem}>
              <div 
                className={styles.legendColor}
                style={{ backgroundColor: bar.color }}
              />
              <span className={styles.legendLabel}>
                {bar.description} ({bar.value}점)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}