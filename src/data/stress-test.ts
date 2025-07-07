export interface StressQuestion {
  id: string
  question: string
  options: {
    text: string
    score: number
  }[]
}

export const stressTestQuestions: StressQuestion[] = [
  {
    id: '1',
    question: '최근 일주일간 잠들기 어려웠던 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '2',
    question: '일이나 학업에 대한 걱정으로 괴로웠던 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '3',
    question: '쉽게 짜증이 나거나 화가 난 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '4',
    question: '집중하기 어려웠던 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '5',
    question: '몸이 피곤하거나 무기력함을 느낀 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '6',
    question: '두통이나 목, 어깨 결림을 경험한 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '7',
    question: '식욕이 없거나 너무 많이 먹은 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '8',
    question: '사람들과 만나기 싫거나 혼자 있고 싶었던 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '9',
    question: '불안하거나 초조함을 느낀 적이 있나요?',
    options: [
      { text: '전혀 없었다', score: 0 },
      { text: '가끔 있었다', score: 1 },
      { text: '자주 있었다', score: 2 },
      { text: '거의 매일 있었다', score: 3 }
    ]
  },
  {
    id: '10',
    question: '전반적으로 자신의 현재 상황에 대해 어떻게 느끼시나요?',
    options: [
      { text: '매우 만족한다', score: 0 },
      { text: '대체로 만족한다', score: 1 },
      { text: '보통이다', score: 2 },
      { text: '불만족한다', score: 3 }
    ]
  }
]

export interface StressResult {
  type: 'low' | 'medium' | 'high'
  title: string
  description: string
  advice: string
  score: number
  maxScore: number
}

export function calculateStressResult(answers: Record<string, number>): StressResult {
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
  const maxScore = 30 // 10 questions × 3 max score each
  const percentage = (totalScore / maxScore) * 100

  if (totalScore <= 10) {
    return {
      type: 'low',
      title: '낮은 스트레스 수준',
      description: '현재 스트레스 수준이 비교적 낮은 상태입니다. 전반적으로 안정적인 정신 상태를 유지하고 있습니다.',
      advice: '현재 상태를 잘 유지하며, 규칙적인 생활 패턴과 건강한 취미활동을 지속하세요. 예방적 차원에서 스트레스 관리법을 미리 익혀두는 것도 좋습니다.',
      score: totalScore,
      maxScore
    }
  } else if (totalScore <= 20) {
    return {
      type: 'medium',
      title: '보통 스트레스 수준',
      description: '일상적인 스트레스를 경험하고 있는 상태입니다. 적절한 관리가 필요한 시점입니다.',
      advice: '충분한 휴식과 수면을 취하고, 규칙적인 운동을 통해 스트레스를 해소하세요. 취미활동이나 명상, 친구들과의 만남 등을 통해 긍정적인 에너지를 충전하는 것이 좋습니다.',
      score: totalScore,
      maxScore
    }
  } else {
    return {
      type: 'high',
      title: '높은 스트레스 수준',
      description: '현재 높은 수준의 스트레스를 경험하고 있습니다. 적극적인 관리와 도움이 필요한 상태입니다.',
      advice: '전문가의 도움을 받는 것을 고려해보세요. 일상생활에서 스트레스 요인을 파악하고 줄여나가며, 충분한 휴식과 전문적인 스트레스 관리 프로그램 참여를 권장합니다.',
      score: totalScore,
      maxScore
    }
  }
}