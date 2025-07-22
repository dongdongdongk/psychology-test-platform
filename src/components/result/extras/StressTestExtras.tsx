'use client'

import { TestResultData } from '@/types'
import styles from './StressTestExtras.module.scss'

interface StressTestExtrasProps {
  resultData: TestResultData
}

export default function StressTestExtras({ resultData }: StressTestExtrasProps) {
  // 스트레스 레벨별 관리법 추천
  const getStressManagementTips = (resultType: string) => {
    const tips: Record<string, { level: string; color: string; tips: string[] }> = {
      'LOW': {
        level: '낮음',
        color: '#10b981',
        tips: [
          '현재 스트레스 수준이 낮아 건강한 상태입니다',
          '꾸준한 운동과 규칙적인 생활 패턴을 유지하세요',
          '주변 사람들과 좋은 관계를 지속하세요',
          '스트레스 예방을 위한 취미 활동을 늘려보세요'
        ]
      },
      'MEDIUM': {
        level: '보통',
        color: '#f59e0b',
        tips: [
          '적정 수준의 스트레스로 주의가 필요합니다',
          '명상이나 요가 같은 이완 활동을 시도해보세요',
          '업무와 휴식의 균형을 맞추려 노력하세요',
          '충분한 수면과 규칙적인 식사를 유지하세요',
          '스트레스 원인을 파악하고 해결방안을 모색하세요'
        ]
      },
      'HIGH': {
        level: '높음',
        color: '#ef4444',
        tips: [
          '높은 스트레스 수준으로 적극적인 관리가 필요합니다',
          '전문가 상담을 고려해보세요',
          '충분한 수면과 균형 잡힌 식단을 우선시하세요',
          '스트레스 해소를 위한 운동을 시작해보세요',
          '친구나 가족과의 시간을 늘려보세요',
          '업무량 조절을 고려해보세요'
        ]
      },
      'VERY_HIGH': {
        level: '매우 높음',
        color: '#dc2626',
        tips: [
          '매우 높은 스트레스로 즉시 관리가 필요합니다',
          '심리상담사나 의료진과 상담을 받으세요',
          '일시적으로 업무량을 줄이는 것을 고려하세요',
          '스트레스 해소를 위한 전문 프로그램에 참여해보세요',
          '가족이나 친구들에게 적극적으로 도움을 요청하세요',
          '충분한 휴식과 회복 시간을 확보하세요'
        ]
      }
    }
    return tips[resultType] || tips['MEDIUM']
  }

  const stressInfo = getStressManagementTips(resultData.resultType || '')

  return (
    <div className={styles.stressExtras}>
      {/* 스트레스 수준 표시 */}
      <div className={styles.stressLevel}>
        <h3>현재 스트레스 수준</h3>
        <div className={styles.levelContainer}>
          <div 
            className={styles.levelIndicator}
            style={{ backgroundColor: stressInfo.color }}
          >
            <span className={styles.levelText}>{stressInfo.level}</span>
          </div>
          <p className={styles.resultTitle}>{resultData.title}</p>
        </div>
      </div>

      {/* 맞춤 관리법 추천 */}
      <div className={styles.managementSection}>
        <h3>맞춤 스트레스 관리법</h3>
        <div className={styles.tipsContainer}>
          {stressInfo.tips.map((tip, index) => (
            <div key={index} className={styles.tipItem}>
              <div 
                className={styles.tipNumber}
                style={{ backgroundColor: stressInfo.color }}
              >
                {index + 1}
              </div>
              <p className={styles.tipText}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 추가 리소스 */}
      <div className={styles.resourcesSection}>
        <h3>도움이 되는 리소스</h3>
        <div className={styles.resourceCards}>
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>🧘‍♀️</div>
            <h4>명상 및 마음챙김</h4>
            <p>하루 10분 명상으로 마음의 평온을 찾아보세요</p>
            <ul>
              <li>명상 앱: 헤드스페이스, 캄</li>
              <li>요가 클래스 참여</li>
              <li>심호흡 연습</li>
            </ul>
          </div>

          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>💪</div>
            <h4>규칙적인 운동</h4>
            <p>운동은 스트레스 호르몬을 줄이는 가장 효과적인 방법입니다</p>
            <ul>
              <li>주 3회 이상 유산소 운동</li>
              <li>걷기, 조깅, 수영</li>
              <li>근력 운동 병행</li>
            </ul>
          </div>

          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>🤝</div>
            <h4>사회적 지지</h4>
            <p>가족, 친구들과의 소통은 스트레스 해소에 큰 도움이 됩니다</p>
            <ul>
              <li>정기적인 만남 약속</li>
              <li>고민 나누기</li>
              <li>취미 활동 함께하기</li>
            </ul>
          </div>

          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}>📞</div>
            <h4>전문가 도움</h4>
            <p>심각한 스트레스는 전문가와 상담하는 것이 중요합니다</p>
            <ul>
              <li>심리상담센터</li>
              <li>정신건강복지센터</li>
              <li>온라인 상담 서비스</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 생활 습관 체크리스트 */}
      <div className={styles.habitSection}>
        <h3>건강한 생활 습관 체크리스트</h3>
        <div className={styles.habitGrid}>
          <div className={styles.habitCategory}>
            <h4>💤 수면</h4>
            <ul>
              <li>매일 7-8시간 수면</li>
              <li>일정한 취침 시간</li>
              <li>취침 전 스마트폰 사용 줄이기</li>
            </ul>
          </div>
          
          <div className={styles.habitCategory}>
            <h4>🍽️ 식사</h4>
            <ul>
              <li>규칙적인 식사 시간</li>
              <li>균형 잡힌 영양소 섭취</li>
              <li>카페인 섭취 줄이기</li>
            </ul>
          </div>

          <div className={styles.habitCategory}>
            <h4>⏰ 시간 관리</h4>
            <ul>
              <li>우선순위 정하기</li>
              <li>적절한 휴식 시간</li>
              <li>업무와 개인시간 분리</li>
            </ul>
          </div>

          <div className={styles.habitCategory}>
            <h4>😊 긍정적 사고</h4>
            <ul>
              <li>감사 일기 쓰기</li>
              <li>부정적 생각 줄이기</li>
              <li>성취감 느끼기</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}