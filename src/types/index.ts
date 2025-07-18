export interface Test {
  id: string
  title: string
  description?: string
  category: string
  thumbnailUrl?: string
  detailImageUrl?: string
  styleTheme?: string
  isActive: boolean
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
  responseData: any
  resultData?: any
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  createdAt: Date
}

export interface TestQuestion {
  id: string
  question: string
  options: string[]
  type: 'single' | 'multiple'
}

export interface TestResult {
  type: string
  title: string
  description: string
  score?: number
  percentage?: number
}