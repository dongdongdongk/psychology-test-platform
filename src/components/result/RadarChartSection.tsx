import { ResultData } from '@/hooks/useTestResult'
import { useRadarChart } from '@/hooks/useRadarChart'
import RadarChart from '@/components/ui/RadarChart'
import ScoreDetails from './ScoreDetails'
import styles from './RadarChartSection.module.scss'

interface RadarChartSectionProps {
  resultData: ResultData
  testId: string
}

export default function RadarChartSection({ resultData, testId }: RadarChartSectionProps) {
  const radarData = useRadarChart(resultData, testId)
  
  if (!resultData.enableRadarChart) {
    return null
  }

  return (
    <div className={styles.radarSection}>
      <RadarChart
        data={radarData}
        title="스트레스 영역별 분석"
        centerText="총점"
        centerValue={resultData.totalScore || 0}
        width={450}
        height={350}
      />
      
      <ScoreDetails 
        resultData={resultData} 
        testId={testId} 
      />
    </div>
  )
}