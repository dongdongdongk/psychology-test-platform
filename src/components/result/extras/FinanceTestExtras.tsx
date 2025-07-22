'use client'

import { ResultData } from '@/hooks/useTestResult'
import styles from './FinanceTestExtras.module.scss'
import { 
  FaCreditCard, 
  FaPiggyBank, 
  FaChartLine, 
  FaBullseye,
  FaMobileAlt,
  FaBook,
  FaLightbulb,
  FaSearch,
  FaStar,
  FaThumbsUp,
  FaMeh,
  FaArrowUp,
  FaExclamationTriangle
} from 'react-icons/fa'

interface FinanceTestExtrasProps {
  resultData: ResultData
}

export default function FinanceTestExtras({ resultData }: FinanceTestExtrasProps) {
  // 영역별 정보 정의
  const areaInfo = {
    A: { name: '재정 관리', icon: <FaCreditCard />, description: '가계부, 지출관리, 신용관리 등 기본적인 돈 관리 능력' },
    B: { name: '저축 습관', icon: <FaPiggyBank />, description: '정기적인 저축과 목표 달성을 위한 저축 실행력' },
    C: { name: '투자 지식', icon: <FaChartLine />, description: '금융상품 이해도와 투자 경험 및 리스크 관리 능력' },
    D: { name: '미래 계획', icon: <FaBullseye />, description: '은퇴 준비, 보험, 장기 재정 목표 설정 능력' }
  }

  // 점수별 등급 및 색상 반환 (더 구별되는 색상으로 변경)
  const getGradeInfo = (score: number) => {
    if (score >= 20) return { grade: '우수', icon: <FaStar />, color: '#059669', bgColor: 'rgba(5, 150, 105, 0.15)' }
    if (score >= 15) return { grade: '양호', icon: <FaThumbsUp />, color: '#2563eb', bgColor: 'rgba(37, 99, 235, 0.15)' }
    if (score >= 10) return { grade: '보통', icon: <FaMeh />, color: '#d97706', bgColor: 'rgba(217, 119, 6, 0.15)' }
    if (score >= 5) return { grade: '부족', icon: <FaArrowUp />, color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.15)' }
    return { grade: '매우 부족', icon: <FaExclamationTriangle />, color: '#991b1b', bgColor: 'rgba(153, 27, 27, 0.15)' }
  }

  // 총점 기반 전체 등급 (더 구별되는 색상으로 변경)
  const getTotalGradeInfo = (totalScore: number) => {
    if (totalScore >= 80) return { grade: '우수', description: '전반적인 재정관리 능력이 매우 뛰어납니다', color: '#059669' }
    if (totalScore >= 60) return { grade: '양호', description: '재정관리 능력이 양호하며 일부 영역 개선이 필요합니다', color: '#2563eb' }
    if (totalScore >= 40) return { grade: '보통', description: '기본적인 재정관리는 되고 있으나 전반적인 개선이 필요합니다', color: '#d97706' }
    if (totalScore >= 20) return { grade: '부족', description: '재정관리 능력 향상을 위한 체계적인 학습과 실천이 필요합니다', color: '#dc2626' }
    return { grade: '매우 부족', description: '재정관리에 대한 기본 지식부터 체계적으로 학습해야 합니다', color: '#991b1b' }
  }

  // 영역별 개선 방안
  const getImprovementTips = (area: string, score: number) => {
    const tips: Record<string, { low: string[], medium: string[], high: string[] }> = {
      A: {
        low: [
          '가계부 앱을 활용해 매일 지출을 기록하세요',
          '월급의 10% 이상을 비상자금으로 먼저 저축하세요',
          '신용카드 사용을 현금 범위 내로 제한하세요',
          '자동이체로 공과금을 관리하세요'
        ],
        medium: [
          '지출 카테고리별 예산을 설정하고 관리하세요',
          '비상자금을 월급의 3-6개월치까지 늘려나가세요',
          '신용등급을 정기적으로 확인하고 관리하세요'
        ],
        high: [
          '더욱 세밀한 지출 분석으로 절약 포인트를 찾아보세요',
          '다양한 금융상품을 비교해 더 유리한 조건을 찾아보세요'
        ]
      },
      B: {
        low: [
          '월급의 20% 이상 정기저축을 시작하세요',
          '자동이체로 저축을 의무화하세요',
          '구체적인 저축 목표 금액과 기간을 설정하세요',
          '용돈 기입장으로 소비 패턴을 파악하세요'
        ],
        medium: [
          '저축률을 점진적으로 늘려나가세요',
          '목표별로 저축 계좌를 분리해 관리하세요',
          '적금이나 예금 상품을 비교해서 선택하세요'
        ],
        high: [
          '저축 효율성을 높이기 위해 다양한 금융상품을 활용하세요',
          '세제혜택이 있는 저축상품을 적극 활용하세요'
        ]
      },
      C: {
        low: [
          '예금, 적금부터 시작해 금융상품 기초를 익히세요',
          '경제 뉴스를 매일 10분씩 읽는 습관을 만드세요',
          '소액으로 펀드 투자를 시작해 경험을 쌓으세요',
          '투자 기초 서적이나 강의를 수강하세요'
        ],
        medium: [
          '다양한 투자 상품의 특성을 공부하세요',
          '본격적인 투자 전에 가상투자로 연습하세요',
          '경제 지표와 투자의 관계를 이해하세요'
        ],
        high: [
          '포트폴리오 다양화를 통해 리스크를 관리하세요',
          '해외투자나 대체투자까지 영역을 확장해보세요'
        ]
      },
      D: {
        low: [
          '연금저축이나 IRP 가입을 우선적으로 고려하세요',
          '실손보험과 종신보험 가입을 검토하세요',
          '10년, 20년 후 목표를 구체적으로 설정하세요',
          '목돈 마련 계획을 세워 실행하세요'
        ],
        medium: [
          '은퇴 후 필요 자금을 구체적으로 계산해보세요',
          '보험 상품을 정기적으로 점검하고 조정하세요',
          '중장기 재정 목표를 단계별로 세분화하세요'
        ],
        high: [
          '은퇴 준비 전략을 더욱 정교화하세요',
          '다양한 노후 준비 상품을 비교해 최적화하세요'
        ]
      }
    }

    if (score < 10) return tips[area].low
    if (score < 20) return tips[area].medium
    return tips[area].high
  }

  // detailedScores에서 ABCD 점수 추출 (다양한 데이터 구조 대응)
  let areaScores = { A: 0, B: 0, C: 0, D: 0 }
  
  console.log('FinanceTestExtras - resultData:', resultData)
  console.log('FinanceTestExtras - detailedScores:', resultData.detailedScores)
  console.log('FinanceTestExtras - resultTypes:', resultData.resultTypes)
  
  if (resultData.detailedScores) {
    // 방법 1: 직접 ABCD 필드가 있는 경우
    if (typeof resultData.detailedScores.A === 'number') {
      areaScores = {
        A: Math.round(Math.min(resultData.detailedScores.A, 25)),
        B: Math.round(Math.min(resultData.detailedScores.B || 0, 25)),
        C: Math.round(Math.min(resultData.detailedScores.C || 0, 25)),
        D: Math.round(Math.min(resultData.detailedScores.D || 0, 25))
      }
      console.log('방법 1 사용 - 직접 ABCD:', areaScores)
    }
    // 방법 2: cognitive/emotional/physical/behavioral 형태인 경우 (일반 테스트용)
    else if (typeof resultData.detailedScores.cognitive === 'number') {
      areaScores = {
        A: Math.round(Math.min(resultData.detailedScores.cognitive, 25)),
        B: Math.round(Math.min(resultData.detailedScores.emotional, 25)),
        C: Math.round(Math.min(resultData.detailedScores.physical, 25)),
        D: Math.round(Math.min(resultData.detailedScores.behavioral, 25))
      }
      console.log('방법 2 사용 - cognitive/emotional/physical/behavioral:', areaScores)
    }
    // 방법 3: 백분율로 저장된 경우 (0-100 범위를 0-25로 변환)
    else if (resultData.detailedScores.A && resultData.detailedScores.A > 25) {
      areaScores = {
        A: Math.round((resultData.detailedScores.A || 0) * 25 / 100),
        B: Math.round((resultData.detailedScores.B || 0) * 25 / 100),
        C: Math.round((resultData.detailedScores.C || 0) * 25 / 100),
        D: Math.round((resultData.detailedScores.D || 0) * 25 / 100)
      }
      console.log('방법 3 사용 - 백분율 변환:', areaScores)
    }
  }
  
  // 방법 4: resultTypes에서 점수 추출 (detailedScores가 없거나 점수가 모두 0인 경우)
  if ((areaScores.A + areaScores.B + areaScores.C + areaScores.D === 0) && resultData.resultTypes) {
    const scores = resultData.resultTypes
    areaScores = {
      A: Math.round(Math.min(scores.A?.score || 0, 25)),
      B: Math.round(Math.min(scores.B?.score || 0, 25)),
      C: Math.round(Math.min(scores.C?.score || 0, 25)),
      D: Math.round(Math.min(scores.D?.score || 0, 25))
    }
    console.log('방법 4 사용 - resultTypes에서 추출:', areaScores)
  }
  
  console.log('최종 areaScores:', areaScores)

  const totalScore = areaScores.A + areaScores.B + areaScores.C + areaScores.D
  const totalGradeInfo = getTotalGradeInfo(totalScore)

  return (
    <div className={styles.financeExtras}>
      {/* 총점 및 전체 등급 */}
      <div className={styles.totalScoreSection}>
        <h3>재정관리 능력 종합 평가</h3>
        <div 
          className={styles.totalScoreCard}
          style={{ borderColor: totalGradeInfo.color }}
        >
          <div className={styles.totalScoreDisplay}>
            <div 
              className={styles.totalScoreNumber}
              style={{ color: totalGradeInfo.color }}
            >
              {totalScore}
              <span className={styles.maxScore}>/100</span>
            </div>
            <div 
              className={styles.totalGrade}
              style={{ backgroundColor: totalGradeInfo.color }}
            >
              {totalGradeInfo.grade}
            </div>
          </div>
          <p className={styles.totalDescription}>{totalGradeInfo.description}</p>
        </div>
      </div>

      {/* 영역별 상세 점수 */}
      <div className={styles.areaScoresSection}>
        <h3>영역별 세부 평가</h3>
        <div className={styles.areaGrid}>
          {Object.entries(areaScores).map(([area, score]) => {
            const info = areaInfo[area as keyof typeof areaInfo]
            const gradeInfo = getGradeInfo(score)
            
            return (
              <div key={area} className={styles.areaCard}>
                <div className={styles.areaHeader}>
                  <div className={styles.areaIcon}>{info.icon}</div>
                  <div className={styles.areaTitle}>
                    <h4>{info.name}</h4>
                    <p>{info.description}</p>
                  </div>
                </div>
                
                <div className={styles.areaScore}>
                  <div 
                    className={styles.scoreDisplay}
                    style={{ color: gradeInfo.color }}
                  >
                    {score}
                    <span className={styles.maxScore}>/25</span>
                  </div>
                  <div 
                    className={styles.gradeDisplay}
                    style={{ 
                      backgroundColor: gradeInfo.color,
                      color: 'white'
                    }}
                  >
                    <span className={styles.gradeIcon}>{gradeInfo.icon}</span> {gradeInfo.grade}
                  </div>
                </div>

                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: `${(score / 25) * 100}%`,
                      backgroundColor: gradeInfo.color
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 개선이 필요한 영역 */}
      <div className={styles.improvementSection}>
        <h3>개선 포인트 및 실행 방안</h3>
        {Object.entries(areaScores)
          .sort(([,a], [,b]) => a - b) // 점수가 낮은 순으로 정렬
          .slice(0, 2) // 하위 2개 영역만
          .map(([area, score]) => {
            const info = areaInfo[area as keyof typeof areaInfo]
            const tips = getImprovementTips(area, score)
            const gradeInfo = getGradeInfo(score)
            
            return (
              <div key={area} className={styles.improvementCard}>
                <div className={styles.improvementHeader}>
                  <div className={styles.improvementIcon}>{info.icon}</div>
                  <div className={styles.improvementTitle}>
                    <h4>{info.name} 개선 방안</h4>
                    <span 
                      className={styles.currentScore}
                      style={{ color: gradeInfo.color }}
                    >
                      현재 {score}점 ({gradeInfo.grade})
                    </span>
                  </div>
                </div>
                
                <div className={styles.tipsList}>
                  {tips.map((tip, index) => (
                    <div key={index} className={styles.tipItem}>
                      <div 
                        className={styles.tipNumber}
                        style={{ backgroundColor: gradeInfo.color }}
                      >
                        {index + 1}
                      </div>
                      <span className={styles.tipText}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
      </div>

      {/* 재정관리 추천 리소스 */}
      <div className={styles.resourcesSection}>
        <h3>재정관리 도움 리소스</h3>
        <div className={styles.resourceGrid}>
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}><FaMobileAlt /></div>
            <h4>가계부 앱</h4>
            <p>토스, 뱅크샐러드 등으로 손쉬운 지출 관리</p>
          </div>
          
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}><FaBook /></div>
            <h4>금융 교육</h4>
            <p>금융감독원 금융교육센터에서 무료 강의 수강</p>
          </div>
          
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}><FaLightbulb /></div>
            <h4>재정 설계</h4>
            <p>은행이나 증권사에서 무료 재정설계 상담 받기</p>
          </div>
          
          <div className={styles.resourceCard}>
            <div className={styles.resourceIcon}><FaSearch /></div>
            <h4>금융상품 비교</h4>
            <p>금융상품통합비교공시에서 최적 상품 찾기</p>
          </div>
        </div>
      </div>

      {/* 최종 정리 및 격려 메시지 */}
      <div className={styles.finalSummarySection}>
        <div className={styles.summaryCard}>
          <h3>재정관리 여정의 시작</h3>
          <div className={styles.summaryContent}>
            <p>
              재정관리는 하루아침에 완성되는 것이 아닙니다. 
              오늘의 작은 실천이 내일의 큰 변화를 만들어냅니다.
            </p>
            <p>
              현재 점수: <span className={styles.currentScoreHighlight} style={{ color: totalGradeInfo.color }}>
                {totalScore}점 ({totalGradeInfo.grade})
              </span>
            </p>
            <p>
              위의 개선 방안들을 하나씩 실천해나가며, 
              3개월 후 다시 테스트해보세요. 분명한 성장을 경험하실 수 있을 것입니다.
            </p>
          </div>
          
          <div className={styles.motivationQuote}>
            <div className={styles.quoteIcon}>💡</div>
            <blockquote>
              "재정적 자유는 꿈이 아닌 계획입니다. 
              지금 시작하는 작은 습관들이 미래의 큰 자산이 됩니다."
            </blockquote>
          </div>

          <div className={styles.actionButtons}>
            <div className={styles.actionButton}>
              <FaBook />
              <span>금융 교육 시작하기</span>
            </div>
            <div className={styles.actionButton}>
              <FaPiggyBank />
              <span>저축 계획 세우기</span>
            </div>
            <div className={styles.actionButton}>
              <FaChartLine />
              <span>투자 공부하기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}