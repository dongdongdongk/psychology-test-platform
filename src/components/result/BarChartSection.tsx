'use client'

import { ResultData } from '@/hooks/useTestResult'
import BarChart from '@/components/ui/BarChart'
import styles from './BarChartSection.module.scss'

interface BarChartSectionProps {
  resultData: ResultData
  testId: string
}

export default function BarChartSection({ resultData, testId }: BarChartSectionProps) {
  // 막대 차트가 비활성화되어 있거나 상세 점수가 없으면 표시하지 않음
  console.log('BarChartSection - enableBarChart:', resultData.enableBarChart)
  console.log('BarChartSection - detailedScores:', resultData.detailedScores)
  console.log('BarChartSection - testId:', testId)
  
  // enableBarChart가 활성화되어 있고 detailedScores가 있으면 표시
  if (!resultData.enableBarChart || !resultData.detailedScores) {
    console.log('BarChart 비활성화 - enableBarChart:', resultData.enableBarChart, 'detailedScores:', !!resultData.detailedScores)
    return null
  }
  
  console.log('BarChart 렌더링 진행!')

  return (
    <div className={styles.barChartSection}>
      <BarChart 
        detailedScores={resultData.detailedScores}
        testId={testId}
        resultTypes={resultData.resultTypes}
        className={styles.barChart}
      />
    </div>
  )
}