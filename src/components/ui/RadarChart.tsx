'use client'

import React from 'react'
import { Radar, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import styles from './RadarChart.module.scss'

// 레이더 차트 데이터 타입
export interface RadarData {
  subject: string     // 축 라벨 (예: "인지적 스트레스")
  score: number      // 점수 (0-100)
  fullMark: number   // 최대 점수 (보통 100)
}

// 컴포넌트 Props 타입
interface RadarChartProps {
  data: RadarData[]
  title?: string
  width?: number
  height?: number
  showLegend?: boolean
  showTooltip?: boolean
  radarColor?: string
  fillColor?: string
  strokeWidth?: number
  className?: string
  centerText?: string
  centerValue?: number
}

// 기본값 설정
const defaultProps: Partial<RadarChartProps> = {
  width: 400,
  height: 400,
  showLegend: true,
  showTooltip: true,
  radarColor: '#8884d8',
  fillColor: 'rgba(136, 132, 216, 0.3)',
  strokeWidth: 2
}

const RadarChart: React.FC<RadarChartProps> = ({
  data,
  title,
  width = defaultProps.width,
  height = defaultProps.height,
  showLegend = defaultProps.showLegend,
  showTooltip = defaultProps.showTooltip,
  radarColor = defaultProps.radarColor,
  fillColor = defaultProps.fillColor,
  strokeWidth = defaultProps.strokeWidth,
  className,
  centerText,
  centerValue
}) => {
  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipValue}>
            점수: {payload[0].value}점
          </p>
        </div>
      )
    }
    return null
  }

  // 평균 점수 계산
  const averageScore = data.reduce((sum, item) => sum + item.score, 0) / data.length

  return (
    <div className={`${styles.radarChartContainer} ${className || ''}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width={width} height={height}>
          <RechartsRadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="subject" 
              className={styles.angleAxis}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              className={styles.radiusAxis}
              tick={{ fontSize: 10, fill: '#888' }}
            />
            <Radar
              name="점수"
              dataKey="score"
              stroke={radarColor}
              fill={fillColor}
              strokeWidth={strokeWidth}
              dot={{ fill: radarColor, strokeWidth: 2, r: 4 }}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
          </RechartsRadarChart>
        </ResponsiveContainer>

        {/* 중앙 텍스트 표시 (옵션) */}
        {(centerText || centerValue !== undefined) && (
          <div className={styles.centerText}>
            {centerText && <div className={styles.centerLabel}>{centerText}</div>}
            {centerValue !== undefined && (
              <div className={styles.centerValue}>{Math.round(centerValue)}점</div>
            )}
          </div>
        )}
      </div>

      {/* 평균 점수 표시 */}
      <div className={styles.summary}>
        <div className={styles.averageScore}>
          평균 점수: <span className={styles.scoreValue}>{Math.round(averageScore)}점</span>
        </div>
        
        {/* 점수별 색상 범례 */}
        <div className={styles.scoreRange}>
          <div className={styles.rangeItem}>
            <div className={styles.colorBox} style={{ backgroundColor: '#4ade80' }}></div>
            <span>0-25: 양호</span>
          </div>
          <div className={styles.rangeItem}>
            <div className={styles.colorBox} style={{ backgroundColor: '#fbbf24' }}></div>
            <span>26-50: 주의</span>
          </div>
          <div className={styles.rangeItem}>
            <div className={styles.colorBox} style={{ backgroundColor: '#fb923c' }}></div>
            <span>51-75: 관리 필요</span>
          </div>
          <div className={styles.rangeItem}>
            <div className={styles.colorBox} style={{ backgroundColor: '#ef4444' }}></div>
            <span>76-100: 즉시 관리</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RadarChart