'use client'

import { TestResultData } from '@/types'
import styles from './ValuesTestExtras.module.scss'

interface ValuesTestExtrasProps {
  resultData: TestResultData
}

export default function ValuesTestExtras({ resultData }: ValuesTestExtrasProps) {
  // 가치관별 상세 정보 (A, B, C, D 타입에 맞춤)
  const getValueDetails = (resultType: string) => {
    const details: Record<string, {
      icon: string;
      color: string;
      description: string;
      characteristics: string[];
      growthTips: string[];
      practicalActions: string[];
    }> = {
      'A': {
        icon: '🏆',
        color: '#f59e0b',
        description: '목표 달성과 성공을 통해 만족을 얻으며, 경쟁과 도전을 즐기는 성취지향형입니다.',
        characteristics: [
          '명확한 목표를 설정하고 달성하려 노력합니다',
          '경쟁적인 환경에서 뛰어난 성과를 발휘합니다',
          '강한 추진력과 리더십을 보여줍니다',
          '결과 중심적이고 효율성을 추구합니다'
        ],
        growthTips: [
          '단기 목표와 장기 목표의 균형을 맞춰보세요',
          '과정에서의 배움과 성장도 중요하게 여겨보세요',
          '팀원들과의 협력을 통한 시너지를 추구해보세요',
          '성공뿐만 아니라 실패에서도 교훈을 얻어보세요'
        ],
        practicalActions: [
          'SMART 목표 설정법 활용',
          '성과 측정 시스템 구축',
          '리더십 역량 개발',
          '경쟁력 분석 및 개선'
        ]
      },
      'B': {
        icon: '🛡️',
        color: '#3b82f6',
        description: '예측 가능하고 안정적인 환경을 선호하며, 질서와 전통을 중시하는 안정지향형입니다.',
        characteristics: [
          '체계적이고 계획적으로 일을 처리합니다',
          '안정적이고 지속가능한 성장을 추구합니다',
          '신중하고 책임감 있는 의사결정을 합니다',
          '전통과 규칙을 존중하며 따릅니다'
        ],
        growthTips: [
          '때로는 계산된 위험을 감수해보세요',
          '새로운 시도와 변화에 열린 마음을 가져보세요',
          '안정성과 성장의 균형점을 찾아보세요',
          '점진적인 변화를 통해 발전해나가세요'
        ],
        practicalActions: [
          '단계별 계획 수립',
          '리스크 관리 시스템 구축',
          '안정적인 관계 네트워크 형성',
          '지속적인 자기계발'
        ]
      },
      'C': {
        icon: '🦋',
        color: '#10b981',
        description: '독립성과 자율성을 중시하며, 창의적이고 모험적인 삶을 추구하는 자유지향형입니다.',
        characteristics: [
          '독창적이고 창의적인 아이디어를 제시합니다',
          '자유로운 환경에서 최고의 성과를 발휘합니다',
          '모험적이고 새로운 경험을 즐깁니다',
          '획일화된 규칙보다는 유연성을 선호합니다'
        ],
        growthTips: [
          '자유로운 환경을 만들되 기본적인 구조도 갖춰보세요',
          '창의성을 발휘할 수 있는 분야를 찾아보세요',
          '혼자만의 시간과 타인과의 협력 시간의 균형을 맞춰보세요',
          '모험과 안전의 적절한 조화를 추구해보세요'
        ],
        practicalActions: [
          '창의적 프로젝트 시작',
          '새로운 취미나 기술 도전',
          '자유로운 작업 환경 조성',
          '다양한 경험 축적'
        ]
      },
      'D': {
        icon: '🤝',
        color: '#ef4444',
        description: '타인과의 관계와 소속감을 중시하며, 협력과 조화를 추구하는 관계지향형입니다.',
        characteristics: [
          '뛰어난 공감 능력과 소통 능력을 가지고 있습니다',
          '팀워크와 협력을 통해 시너지를 창출합니다',
          '타인을 배려하고 도움을 주려고 노력합니다',
          '화목한 분위기 조성에 기여합니다'
        ],
        growthTips: [
          '타인을 배려하되 자신의 의견도 명확히 표현해보세요',
          '갈등 상황에서 중재 역할을 적극적으로 수행해보세요',
          '관계의 질을 높이는데 집중해보세요',
          '개인의 성장도 함께 추구해보세요'
        ],
        practicalActions: [
          '소통 기술 향상',
          '팀빌딩 활동 참여',
          '사회적 네트워크 확장',
          '봉사활동 참여'
        ]
      }
    }
    return details[resultType] || details['A']
  }

  const valueDetail = getValueDetails(resultData.resultType || '')

  return (
    <div className={styles.valuesExtras}>
      {/* 핵심 가치관 상세 설명 */}
      <div className={styles.valueDetail}>
        <h3>당신의 핵심 가치관 깊이보기</h3>
        <div 
          className={styles.valueCard}
          style={{ borderTopColor: valueDetail.color }}
        >
          <div 
            className={styles.valueIcon}
            style={{ backgroundColor: valueDetail.color }}
          >
            {valueDetail.icon}
          </div>
          <h4 style={{ color: valueDetail.color }}>{resultData.title}</h4>
          <p className={styles.valueDescription}>{valueDetail.description}</p>
        </div>
      </div>

      {/* 특성 분석 */}
      <div className={styles.characteristicsSection}>
        <h3>당신의 주요 특성</h3>
        <div className={styles.characteristicsList}>
          {valueDetail.characteristics.map((characteristic, index) => (
            <div key={index} className={styles.characteristicItem}>
              <div 
                className={styles.checkIcon}
                style={{ backgroundColor: valueDetail.color }}
              >
                ✓
              </div>
              <span>{characteristic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 성장 가이드 */}
      <div className={styles.growthSection}>
        <h3>성장을 위한 가이드</h3>
        <div className={styles.growthTips}>
          {valueDetail.growthTips.map((tip, index) => (
            <div key={index} className={styles.growthTip}>
              <div 
                className={styles.tipNumber}
                style={{ backgroundColor: valueDetail.color }}
              >
                {index + 1}
              </div>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 실천 방법 */}
      <div className={styles.practiceSection}>
        <h3>구체적인 실천 방법</h3>
        <div className={styles.practiceGrid}>
          {valueDetail.practicalActions.map((action, index) => (
            <div key={index} className={styles.practiceCard}>
              <div 
                className={styles.practiceIcon}
                style={{ backgroundColor: valueDetail.color }}
              >
                {index + 1}
              </div>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 가치관 실현 로드맵 */}
      <div className={styles.roadmapSection}>
        <h3>가치관 실현 로드맵</h3>
        <div className={styles.roadmapContainer}>
          <div className={styles.roadmapStep}>
            <div className={styles.stepNumber} style={{ backgroundColor: valueDetail.color }}>1</div>
            <div className={styles.stepContent}>
              <h4>현재 상태 파악</h4>
              <p>자신의 현재 상황과 가치관 실현 정도를 정직하게 평가해보세요.</p>
            </div>
          </div>
          
          <div className={styles.roadmapStep}>
            <div className={styles.stepNumber} style={{ backgroundColor: valueDetail.color }}>2</div>
            <div className={styles.stepContent}>
              <h4>목표 설정</h4>
              <p>가치관에 맞는 구체적이고 달성 가능한 목표를 설정하세요.</p>
            </div>
          </div>
          
          <div className={styles.roadmapStep}>
            <div className={styles.stepNumber} style={{ backgroundColor: valueDetail.color }}>3</div>
            <div className={styles.stepContent}>
              <h4>행동 계획</h4>
              <p>목표 달성을 위한 구체적인 행동 계획을 세우고 실행하세요.</p>
            </div>
          </div>
          
          <div className={styles.roadmapStep}>
            <div className={styles.stepNumber} style={{ backgroundColor: valueDetail.color }}>4</div>
            <div className={styles.stepContent}>
              <h4>지속적 성찰</h4>
              <p>정기적으로 자신의 행동과 가치관의 일치도를 점검하세요.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 관련 명언 */}
      <div className={styles.quoteSection}>
        <h3>당신의 가치관과 어울리는 명언</h3>
        <div className={styles.quoteCard} style={{ borderLeftColor: valueDetail.color }}>
          <div className={styles.quoteText}>
            {resultData.resultType === 'A' && '"성공은 준비와 기회가 만나는 지점에서 일어난다." - 세네카'}
            {resultData.resultType === 'B' && '"천천히 가더라도 꾸준히 가는 자가 경주에서 이긴다." - 이솝'}
            {resultData.resultType === 'C' && '"자유란 두려움으로부터의 해방이다." - 넬슨 만델라'}
            {resultData.resultType === 'D' && '"혼자 가면 빠르지만, 함께 가면 멀리 갈 수 있다." - 아프리카 속담'}
            {!['A', 'B', 'C', 'D'].includes(resultData.resultType || '') && 
              '"가치관은 우리가 어떤 사람이 되고 싶은지를 보여주는 나침반이다." - 익명'}
          </div>
        </div>
      </div>
    </div>
  )
}