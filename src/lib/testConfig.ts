// 테스트별 설정 관리
export interface TestConfig {
  showTitle?: boolean      // 결과 페이지에서 제목 표시 여부
  layout?: 'default' | 'custom'  // 레이아웃 타입 (향후 확장용)
  theme?: string          // 테마 설정 (향후 확장용)
}

// 테스트 ID별 설정
export const testConfigs: Record<string, TestConfig> = {
  // 돈 관리 테스트 - 제목 숨김
  'cmd9un7aq0006ut7b7p9s40q0': {
    showTitle: false,
    layout: 'custom'
  },
  
  // 스트레스 테스트 - 제목 표시
  'stresscheck001test2025': {
    showTitle: true,
    layout: 'default'
  },
  
  // 가치관 테스트 - 제목 표시  
  'valuetest2025': {
    showTitle: true,
    layout: 'default'
  },

  // 점심 테스트 - 제목 숨김 
  'cmd9un7aq0006ut7b7p9s40q9': {
    showTitle: false,
    layout: 'default'
  }
}

// 테스트 설정 가져오기 함수
export function getTestConfig(testId: string): TestConfig {
  return testConfigs[testId] || {
    showTitle: true,  // 기본값: 제목 표시
    layout: 'default'
  }
}

// 제목 표시 여부 확인 함수
export function shouldShowTitle(testId: string): boolean {
  const config = getTestConfig(testId)
  return config.showTitle !== false  // undefined인 경우 true로 처리
}