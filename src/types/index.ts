export interface Test {
  id: string
  title: string
  description?: string
  category: string
  thumbnailUrl?: string
  detailImageUrl?: string
  styleTheme?: string
  isActive: boolean
  completionCount?: number
  shareCount?: number
  questions?: Question[]
  resultTypes?: TestResultTypes
  createdAt: Date
  updatedAt: Date
}

export interface Admin {
  id: string
  username: string
  email: string
  passwordHash: string
  createdAt: Date
}

export interface UserResponse {
  id: string
  testId: string
  responseData: ResponseData
  resultType?: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  createdAt: Date
}

export interface ResponseData {
  answers: Record<string, QuestionAnswer>
  metadata: ResponseMetadata
}

export interface QuestionAnswer {
  answer: string | string[] // 단일 선택 또는 다중 선택
  optionIndex: number | number[] // 선택한 옵션의 인덱스
  scores?: Record<string, number> // 계산된 점수
  answered_at: string // ISO timestamp
}

export interface ResponseMetadata {
  start_time: string // ISO timestamp
  completion_time: string // ISO timestamp
  browser_info?: string
  device_type?: string
  total_questions: number
}

export interface Question {
  id: string
  content: string
  order: number
  type: 'single' | 'multiple'
  options: AnswerOption[]
}

export interface AnswerOption {
  content: string
  value: Record<string, number> // {"A": -1, "B": 3, "C": 1} 형태
  order: number
}

export interface TestResultTypes {
  [key: string]: TestResultType // "A", "B", "C" 등의 키로 결과 타입 정의
}

export interface TestResultType {
  title: string
  description: string
  description_url?: string // 설명 이미지 URL (기존 TEXT_IMAGE)
  image_url?: string       // 메인 결과 이미지 URL
}

export interface TestResult {
  type: string
  title: string
  description: string
  score?: number
  percentage?: number
}

export interface TestResultData {
  testTitle: string
  title: string
  description: string
  type: string
  testId: string
  resultType: string
  detailedScores?: Record<string, number>
  resultTypes?: TestResultTypes
}