/**
 * 테스트 점수 계산 유틸리티
 */

export interface StressScores {
  A: number // 인지적 스트레스
  B: number // 정서적 스트레스  
  C: number // 신체적 스트레스
  D: number // 행동적 스트레스
}

export interface DetailedScores {
  cognitive: number
  emotional: number
  physical: number
  behavioral: number
  total: number
  maxTotal: number
  cognitivePercent: number
  emotionalPercent: number
  physicalPercent: number
  behavioralPercent: number
}

/**
 * 스트레스 테스트 상세 점수 계산 함수 (API용)
 * @param responseData 응답 데이터 (localStorage 또는 DB 형태)
 * @param testData 테스트 데이터 (questions 포함)
 * @param testId 테스트 ID
 * @returns DetailedScores
 */
export function calculateStressDetailedScores(responseData: any, testData: any, testId: string): DetailedScores {
  console.log('=== calculateStressDetailedScores 시작 ===')
  console.log('responseData:', responseData)
  console.log('testData.questions 길이:', testData.questions?.length)
  console.log('testId:', testId)
  
  const scores: StressScores = { A: 0, B: 0, C: 0, D: 0 }
  const questionsData = testData.questions as any[]
  
  // 실제 질문 구조를 사용하여 점수 계산
  // Q1-Q5: A영역 (인지적), Q6-Q10: B영역 (정서적)
  // Q11-Q15: C영역 (신체적), Q16-Q20: D영역 (행동적)
  
  for (const question of questionsData) {
    const responseItem = responseData[question.id]
    console.log(`Question ${question.id}: responseItem=`, responseItem)
    
    if (responseItem !== undefined && question.type === 'single') {
      let option = null
      
      // DB에서 온 데이터인지 localStorage에서 온 데이터인지 확인
      if (typeof responseItem === 'object' && responseItem.optionIndex !== undefined) {
        // DB에서 온 가공된 데이터 (answersFormatted 형태)
        const optionIndex = responseItem.optionIndex
        option = question.options[optionIndex]
        console.log(`DB 데이터 - Question ${question.id}: optionIndex=${optionIndex}, 선택된 옵션=`, option)
      } else {
        // localStorage에서 온 원시 데이터 (answers 형태)
        const answer = responseItem
        if (testId === 'stresscheck001test2025') {
          const optionIndex = parseInt(answer)
          option = question.options[optionIndex]
          console.log(`localStorage 스트레스 테스트 - Question ${question.id}: optionIndex=${optionIndex}, 선택된 옵션=`, option)
        } else {
          const orderValue = parseInt(answer)
          option = question.options.find((opt: any) => opt.order === orderValue)
          console.log(`localStorage 일반 테스트 - Question ${question.id}: orderValue=${orderValue}, 선택된 옵션=`, option)
        }
      }
      
      if (option && option.value) {
        // value 객체에서 A, B, C, D 점수 추출
        const scoreValues = option.value
        console.log(`Question ${question.id}: scoreValues=`, scoreValues)
        for (const [typeId, score] of Object.entries(scoreValues)) {
          if (typeof score === 'number' && ['A', 'B', 'C', 'D'].includes(typeId)) {
            scores[typeId as keyof StressScores] += score
            console.log(`${typeId} 점수 ${score} 추가, 현재 ${typeId}: ${scores[typeId as keyof StressScores]}`)
          }
        }
      }
    }
  }
  
  // 총점 계산 (각 영역 최대 25점, 총 100점)
  const total = scores.A + scores.B + scores.C + scores.D
  
  console.log('=== 최종 계산 결과 ===')
  console.log('scores:', scores)
  console.log('total:', total)
  
  const result: DetailedScores = {
    cognitive: scores.A,     // 인지적 스트레스 (A영역, 0-25점)
    emotional: scores.B,     // 정서적 스트레스 (B영역, 0-25점)
    physical: scores.C,      // 신체적 스트레스 (C영역, 0-25점)
    behavioral: scores.D,    // 행동적 스트레스 (D영역, 0-25점)
    total: total,           // 총점 (0-100점)
    maxTotal: 100,          // 최대 총점
    // 백분율 점수 추가 (레이더 차트용)
    cognitivePercent: Math.round((scores.A / 25) * 100),
    emotionalPercent: Math.round((scores.B / 25) * 100),
    physicalPercent: Math.round((scores.C / 25) * 100),
    behavioralPercent: Math.round((scores.D / 25) * 100)
  }
  
  console.log('=== 반환 결과 ===')
  console.log('result:', result)
  
  return result
}

/**
 * 일반 테스트 점수 계산 함수
 * @param responseData 응답 데이터
 * @param resultType 결과 타입 ID
 * @returns 해당 타입의 총점
 */
export function calculateGeneralScore(responseData: any, resultType: string): number {
  let totalScore = 0
  
  if (responseData && responseData.answers) {
    Object.values(responseData.answers).forEach((answer: any) => {
      if (answer.scores && answer.scores[resultType]) {
        totalScore += answer.scores[resultType]
      }
    })
  }
  
  return totalScore
}

/**
 * 일반 테스트용 ABCD 점수 계산 (막대 그래프용)
 * @param responseData 응답 데이터
 * @returns DetailedScores
 */
export function calculateGeneralDetailedScores(responseData: any): DetailedScores {
  console.log('=== calculateGeneralDetailedScores 시작 ===')
  console.log('responseData:', responseData)
  
  const scores: StressScores = { A: 0, B: 0, C: 0, D: 0 }

  // 모든 답변에서 A, B, C, D 점수 수집
  // responseData가 직접 답변 데이터인 경우와 answers 안에 있는 경우 모두 처리
  let answersData = responseData
  if (responseData && responseData.answers) {
    answersData = responseData.answers
    console.log('responseData.answers 사용:', answersData)
  } else if (responseData) {
    console.log('responseData 직접 사용:', answersData)
  } else {
    console.log('responseData가 없음')
    answersData = {}
  }

  Object.values(answersData).forEach((answer: any, index: number) => {
    console.log(`답변 ${index}:`, answer)
    if (answer && answer.scores) {
      console.log(`답변 ${index} 점수:`, answer.scores);
      (['A', 'B', 'C', 'D'] as const).forEach((type: 'A' | 'B' | 'C' | 'D') => {
        // answer.scores가 객체인지 확인하고 해당 타입이 존재하는지 체크
        if (answer.scores && typeof answer.scores === 'object' && answer.scores.hasOwnProperty(type)) {
          const scoreValue = answer.scores[type]
          if (typeof scoreValue === 'number') {
            scores[type] += scoreValue
            console.log(`${type} 점수 ${scoreValue} 추가, 현재 ${type}: ${scores[type]}`)
          }
        }
      })
    } else {
      console.log(`답변 ${index}에 scores 없음:`, answer)
    }
  })

  const total = scores.A + scores.B + scores.C + scores.D
  const maxPerCategory = Math.max(scores.A, scores.B, scores.C, scores.D) || 25 // 최대값 기준으로 설정

  console.log('=== 최종 점수 계산 결과 ===')
  console.log('scores:', scores)
  console.log('total:', total)
  console.log('maxPerCategory:', maxPerCategory)

  const result = {
    cognitive: scores.A,
    emotional: scores.B,
    physical: scores.C,
    behavioral: scores.D,
    total: total,
    maxTotal: maxPerCategory * 4,
    cognitivePercent: Math.round((scores.A / maxPerCategory) * 100),
    emotionalPercent: Math.round((scores.B / maxPerCategory) * 100),
    physicalPercent: Math.round((scores.C / maxPerCategory) * 100),
    behavioralPercent: Math.round((scores.D / maxPerCategory) * 100)
  }
  
  console.log('=== 반환 결과 ===')
  console.log('result:', result)
  
  return result
}

/**
 * 테스트가 스트레스 테스트인지 확인
 * @param testId 테스트 ID
 * @param testTitle 테스트 제목
 * @returns boolean
 */
export function isStressTest(testId: string, testTitle?: string): boolean {
  return testId === 'stresscheck001test2025' || Boolean(testTitle && testTitle.includes('스트레스'))
}

/**
 * 스트레스 테스트 영역별 점수 계산
 * Q1-Q5: A영역 (인지적), Q6-Q10: B영역 (정서적)
 * Q11-Q15: C영역 (신체적), Q16-Q20: D영역 (행동적)
 */
export function calculateStressScores(responses: Record<string, any>): StressScores {
  const scores: StressScores = { A: 0, B: 0, C: 0, D: 0 }
  
  for (let i = 1; i <= 20; i++) {
    const questionId = `q${i}`
    const answer = responses[questionId]
    
    if (answer !== undefined) {
      const answerValue = parseInt(answer) || 0
      
      if (i >= 1 && i <= 5) {
        scores.A += answerValue // 인지적 스트레스
      } else if (i >= 6 && i <= 10) {
        scores.B += answerValue // 정서적 스트레스  
      } else if (i >= 11 && i <= 15) {
        scores.C += answerValue // 신체적 스트레스
      } else if (i >= 16 && i <= 20) {
        scores.D += answerValue // 행동적 스트레스
      }
    }
  }
  
  return scores
}

/**
 * API 응답의 상세 점수를 사용하여 정규화된 점수 반환
 */
export function normalizeDetailedScores(detailedScores: DetailedScores): StressScores {
  return {
    A: detailedScores.cognitive,
    B: detailedScores.emotional,
    C: detailedScores.physical,
    D: detailedScores.behavioral
  }
}

/**
 * 총점에 따른 스트레스 레벨 결정
 */
export function getStressLevel(totalScore: number, maxScore: number = 100): string {
  const percentage = (totalScore / maxScore) * 100
  
  if (percentage >= 76) {
    return '매우 높은 스트레스 상태'
  } else if (percentage >= 51) {
    return '높은 스트레스 상태'
  } else if (percentage >= 26) {
    return '보통 스트레스 상태'
  } else {
    return '낮은 스트레스 상태'
  }
}

/**
 * 점수를 백분율로 변환
 */
export function scoreToPercentage(score: number, maxScore: number): number {
  return Math.round((score / maxScore) * 100)
}