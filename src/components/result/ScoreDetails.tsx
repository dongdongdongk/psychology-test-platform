import { ResultData } from '@/hooks/useTestResult'
import styles from './ScoreDetails.module.scss'

interface ScoreDetailsProps {
  resultData: ResultData
  testId: string
}

// 각 스트레스 영역별 상세 정보
const stressAreaDetails = {
  cognitive: {
    title: '인지적 스트레스',
    description: '집중력, 기억력, 사고력 등 인지 기능에 미치는 스트레스',
    symptoms: [
      '집중력이 떨어지고 산만해짐',
      '기억력 저하, 깜빡하는 일이 증가',
      '결정을 내리기 어려워함',
      '부정적인 생각이 반복됨',
      '업무나 학습 능력이 감소함'
    ],
    management: [
      '명상이나 마음챙김 연습하기',
      '충분한 휴식과 수면 확보',
      '체계적인 일정 관리와 우선순위 설정',
      '복잡한 일을 단순하게 나누어 처리',
      '정신적 자극을 주는 활동 제한'
    ]
  },
  emotional: {
    title: '정서적 스트레스',
    description: '감정 조절, 기분 상태, 심리적 안정에 미치는 스트레스',
    symptoms: [
      '불안감이나 초조함을 자주 느낌',
      '기분 변화가 심하고 예측하기 어려움',
      '우울감이나 무기력감 경험',
      '짜증이나 분노가 쉽게 유발됨',
      '감정 조절이 어려워짐'
    ],
    management: [
      '감정을 인식하고 표현하는 연습',
      '신뢰할 수 있는 사람과 대화하기',
      '취미 활동이나 즐거운 일 찾기',
      '규칙적인 운동으로 스트레스 해소',
      '필요시 전문가 상담 받기'
    ]
  },
  physical: {
    title: '신체적 스트레스',
    description: '몸의 생리적 반응과 신체 증상으로 나타나는 스트레스',
    symptoms: [
      '두통이나 목, 어깨 결림',
      '소화불량, 복통 등 위장 장애',
      '수면 장애 (잠들기 어려움, 자주 깸)',
      '식욕 변화 (과식하거나 식욕 부진)',
      '피로감과 에너지 부족'
    ],
    management: [
      '규칙적인 운동으로 몸의 긴장 완화',
      '깊은 호흡이나 이완 기법 연습',
      '충분한 수면과 규칙적인 생활 패턴',
      '균형 잡힌 영양 섭취',
      '필요시 의료진 상담'
    ]
  },
  behavioral: {
    title: '행동적 스트레스',
    description: '일상 행동 패턴과 사회활동에 미치는 스트레스',
    symptoms: [
      '수면 패턴의 변화 (불면이나 과수면)',
      '식사 패턴의 변화 (과식, 폭식, 거식)',
      '사회활동 회피나 고립',
      '업무나 책임을 미루는 경향',
      '흡연, 음주 등 부적절한 대처 행동'
    ],
    management: [
      '규칙적인 일상 루틴 만들기',
      '건강한 스트레스 해소 방법 찾기',
      '사회적 관계 유지하고 도움 요청하기',
      '목표를 세분화하여 실행 가능한 단위로 나누기',
      '부적절한 습관을 건강한 활동으로 대체'
    ]
  }
}

// 개별 영역 스트레스 수준 평가 함수
function getAreaStressLevel(score: number) {
  if (score <= 6) return { level: '낮음', className: 'low' }
  else if (score <= 12) return { level: '보통', className: 'moderate' }
  else if (score <= 18) return { level: '높음', className: 'high' }
  else return { level: '매우 높음', className: 'very-high' }
}

// 전체 스트레스 수준 평가 함수
function getStressLevel(totalScore: number) {
  if (totalScore <= 25) {
    return {
      level: '낮음',
      className: 'low',
      description: '현재 스트레스 수준이 낮습니다. 전반적으로 안정적인 상태를 유지하고 있습니다.',
      recommendations: [
        '현재의 건강한 생활 패턴을 유지하세요',
        '정기적인 운동과 충분한 휴식을 지속하세요',
        '스트레스 예방을 위한 취미 활동을 즐기세요'
      ]
    }
  } else if (totalScore <= 50) {
    return {
      level: '보통',
      className: 'moderate',
      description: '일상적인 수준의 스트레스를 경험하고 있습니다. 관리 가능한 범위이지만 주의가 필요합니다.',
      recommendations: [
        '규칙적인 생활 패턴을 유지하세요',
        '스트레스 해소법을 찾아 실천하세요',
        '충분한 수면과 영양 섭취에 신경 쓰세요',
        '가벼운 운동이나 명상을 시도해보세요'
      ]
    }
  } else if (totalScore <= 75) {
    return {
      level: '높음',
      className: 'high',
      description: '상당한 수준의 스트레스를 경험하고 있습니다. 적극적인 관리가 필요한 상태입니다.',
      recommendations: [
        '스트레스 원인을 파악하고 해결 방안을 모색하세요',
        '전문가 상담을 고려해보세요',
        '업무량 조절이나 휴식 시간 확보가 필요합니다',
        '가족이나 친구들과의 대화 시간을 늘리세요',
        '정기적인 운동과 이완 기법을 실천하세요'
      ]
    }
  } else {
    return {
      level: '매우 높음',
      className: 'very-high',
      description: '매우 높은 수준의 스트레스 상태입니다. 즉시 전문적인 도움과 관리가 필요합니다.',
      recommendations: [
        '전문 상담사나 의료진과 상담을 받으세요',
        '업무나 학업 부담을 즉시 줄이세요',
        '충분한 휴식과 회복 시간을 확보하세요',
        '신뢰할 수 있는 사람들의 도움을 요청하세요',
        '정신건강 전문기관 방문을 고려하세요'
      ]
    }
  }
}

export default function ScoreDetails({ resultData, testId }: ScoreDetailsProps) {
  // 스트레스 테스트가 아니거나 상세 점수가 없으면 표시하지 않음
  const isStressTest = testId === 'stresscheck001test2025' || resultData.testTitle.includes('스트레스')
  
  if (!isStressTest || !resultData.detailedScores) {
    return null
  }

  const scores = resultData.detailedScores

  return (
    <div className={styles.scoreDetails}>
      <h3>영역별 점수</h3>
      <div className={styles.scoreGrid}>
        <div className={styles.scoreItem}>
          <div className={styles.scoreLabel}>
            <span>인지적 스트레스</span>
          </div>
          <span>{scores.cognitive}/25점</span>
        </div>
        <div className={styles.scoreItem}>
          <div className={styles.scoreLabel}>
            <span>정서적 스트레스</span>
          </div>
          <span>{scores.emotional}/25점</span>
        </div>
        <div className={styles.scoreItem}>
          <div className={styles.scoreLabel}>
            <span>신체적 스트레스</span>
          </div>
          <span>{scores.physical}/25점</span>
        </div>
        <div className={styles.scoreItem}>
          <div className={styles.scoreLabel}>
            <span>행동적 스트레스</span>
          </div>
          <span>{scores.behavioral}/25점</span>
        </div>
        <div className={`${styles.scoreItem} ${styles.total}`}>
          <span>총점:</span>
          <span>{scores.total}/100점</span>
        </div>
      </div>
      
      {/* 각 영역별 상세 설명 */}
      <div className={styles.areaDetails}>
        <h4>영역별 상세 분석</h4>
        <div className={styles.areaGrid}>
          {Object.entries(stressAreaDetails).map(([key, area]) => {
            const score = scores[key as keyof typeof scores]
            const level = getAreaStressLevel(score)
            
            return (
              <div key={key} className={`${styles.areaCard} ${level.className}`}>
                <div className={styles.areaHeader}>
                  <h5>{area.title}</h5>
                  <div className={styles.areaScore}>
                    <span className={styles.levelBadge}>{level.level}</span>
                    <span className={styles.scoreValue}>{score}/25점</span>
                  </div>
                </div>
                
                <p className={styles.areaDescription}>
                  {area.description}
                </p>
                
                <div className={styles.symptomsSection}>
                  <h6>주요 증상</h6>
                  <ul className={styles.symptomsList}>
                    {area.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.managementSection}>
                  <h6>관리 방법</h6>
                  <ul className={styles.managementList}>
                    {area.management.map((method, index) => (
                      <li key={index}>{method}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 전체 평가 */}
      <div className={styles.overallAssessment}>
        <h4>전체 스트레스 수준 평가</h4>
        <div className={`${styles.assessmentCard} ${getStressLevel(scores.total).className}`}>
          <div className={styles.assessmentHeader}>
            <span className={styles.levelBadge}>{getStressLevel(scores.total).level}</span>
            <span className={styles.scoreRange}>{scores.total}/100점</span>
          </div>
          <p className={styles.assessmentDescription}>
            {getStressLevel(scores.total).description}
          </p>
          <div className={styles.recommendationList}>
            <strong>권장사항:</strong>
            <ul>
              {getStressLevel(scores.total).recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}