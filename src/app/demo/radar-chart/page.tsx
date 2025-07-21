'use client'

import React, { useState } from 'react'
import RadarChart, { RadarData } from '@/components/ui/RadarChart'
import styles from './RadarChartDemo.module.scss'

// 예시 데이터들
const stressTestData: RadarData[] = [
  { subject: '인지적 스트레스', score: 65, fullMark: 100 },
  { subject: '정서적 스트레스', score: 45, fullMark: 100 },
  { subject: '신체적 스트레스', score: 80, fullMark: 100 },
  { subject: '행동적 스트레스', score: 55, fullMark: 100 }
]

const personalityTestData: RadarData[] = [
  { subject: '외향성', score: 75, fullMark: 100 },
  { subject: '성실성', score: 85, fullMark: 100 },
  { subject: '개방성', score: 60, fullMark: 100 },
  { subject: '친화성', score: 70, fullMark: 100 },
  { subject: '신경성', score: 40, fullMark: 100 }
]

const skillAssessmentData: RadarData[] = [
  { subject: '커뮤니케이션', score: 88, fullMark: 100 },
  { subject: '문제해결', score: 92, fullMark: 100 },
  { subject: '창의성', score: 75, fullMark: 100 },
  { subject: '리더십', score: 68, fullMark: 100 },
  { subject: '협업능력', score: 85, fullMark: 100 },
  { subject: '시간관리', score: 70, fullMark: 100 }
]

export default function RadarChartDemo() {
  const [selectedDemo, setSelectedDemo] = useState<'stress' | 'personality' | 'skill'>('stress')

  const getCurrentData = () => {
    switch (selectedDemo) {
      case 'stress':
        return stressTestData
      case 'personality':
        return personalityTestData
      case 'skill':
        return skillAssessmentData
      default:
        return stressTestData
    }
  }

  const getCurrentTitle = () => {
    switch (selectedDemo) {
      case 'stress':
        return '스트레스 지수 분석'
      case 'personality':
        return '성격 유형 분석'
      case 'skill':
        return '역량 평가 결과'
      default:
        return '테스트 결과'
    }
  }

  const getCurrentCenterText = () => {
    switch (selectedDemo) {
      case 'stress':
        return '스트레스 총점'
      case 'personality':
        return '종합 점수'
      case 'skill':
        return '평균 역량'
      default:
        return '총점'
    }
  }

  const currentData = getCurrentData()
  const averageScore = currentData.reduce((sum, item) => sum + item.score, 0) / currentData.length

  return (
    <div className={styles.demoContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>레이더 차트 컴포넌트 데모</h1>
        <p className={styles.description}>
          다양한 심리 테스트 결과를 시각화할 수 있는 레이더 차트 컴포넌트입니다.
        </p>
      </div>

      <div className={styles.controls}>
        <h2>데모 선택</h2>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.demoButton} ${selectedDemo === 'stress' ? styles.active : ''}`}
            onClick={() => setSelectedDemo('stress')}
          >
            스트레스 테스트
          </button>
          <button
            className={`${styles.demoButton} ${selectedDemo === 'personality' ? styles.active : ''}`}
            onClick={() => setSelectedDemo('personality')}
          >
            성격 테스트
          </button>
          <button
            className={`${styles.demoButton} ${selectedDemo === 'skill' ? styles.active : ''}`}
            onClick={() => setSelectedDemo('skill')}
          >
            역량 평가
          </button>
        </div>
      </div>

      <div className={styles.chartSection}>
        <RadarChart
          data={currentData}
          title={getCurrentTitle()}
          centerText={getCurrentCenterText()}
          centerValue={averageScore}
          width={500}
          height={400}
        />
      </div>

      <div className={styles.codeExample}>
        <h2>사용 예시</h2>
        <pre className={styles.codeBlock}>
{`import RadarChart, { RadarData } from '@/components/ui/RadarChart'

const data: RadarData[] = [
  { subject: '인지적 스트레스', score: 65, fullMark: 100 },
  { subject: '정서적 스트레스', score: 45, fullMark: 100 },
  { subject: '신체적 스트레스', score: 80, fullMark: 100 },
  { subject: '행동적 스트레스', score: 55, fullMark: 100 }
]

<RadarChart
  data={data}
  title="스트레스 지수 분석"
  centerText="스트레스 총점"
  centerValue={61}
  width={500}
  height={400}
/>`}
        </pre>
      </div>

      <div className={styles.propsInfo}>
        <h2>컴포넌트 Props</h2>
        <table className={styles.propsTable}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>타입</th>
              <th>필수</th>
              <th>기본값</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>data</td>
              <td>RadarData[]</td>
              <td>✓</td>
              <td>-</td>
              <td>차트에 표시할 데이터 배열</td>
            </tr>
            <tr>
              <td>title</td>
              <td>string</td>
              <td></td>
              <td>-</td>
              <td>차트 제목</td>
            </tr>
            <tr>
              <td>width</td>
              <td>number</td>
              <td></td>
              <td>400</td>
              <td>차트 너비</td>
            </tr>
            <tr>
              <td>height</td>
              <td>number</td>
              <td></td>
              <td>400</td>
              <td>차트 높이</td>
            </tr>
            <tr>
              <td>centerText</td>
              <td>string</td>
              <td></td>
              <td>-</td>
              <td>중앙에 표시할 텍스트</td>
            </tr>
            <tr>
              <td>centerValue</td>
              <td>number</td>
              <td></td>
              <td>-</td>
              <td>중앙에 표시할 값</td>
            </tr>
            <tr>
              <td>radarColor</td>
              <td>string</td>
              <td></td>
              <td>#8884d8</td>
              <td>레이더 선 색상</td>
            </tr>
            <tr>
              <td>fillColor</td>
              <td>string</td>
              <td></td>
              <td>rgba(136, 132, 216, 0.3)</td>
              <td>영역 채우기 색상</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}