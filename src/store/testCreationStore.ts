import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 테스트 생성 상태 관리
interface TestCreationData {
  // 1단계: 기본 설정
  title: string
  description: string
  category: string
  thumbnailUrl: string
  detailImageUrl: string
  questionCount: number
  optionCount: number
  styleTheme: string
  
  // 2단계: 문제 및 선택지
  questions: {
    id: string
    content: string
    options: {
      id: string
      content: string
      score: number
    }[]
  }[]
  
  // 3단계: 결과 타입
  resultCount: number
  resultTypes: {
    id: string
    name: string
    minScore: number
    maxScore: number
    imageUrl: string
    textImageUrl: string
    description: string
  }[]
  
  // 진행 상태
  currentStep: number
  isComplete: boolean
}

interface TestCreationState extends TestCreationData {
  // Actions
  setBasicInfo: (data: Partial<TestCreationData>) => void
  setQuestions: (questions: TestCreationData['questions']) => void
  setResultTypes: (resultTypes: TestCreationData['resultTypes']) => void
  setCurrentStep: (step: number) => void
  resetTestCreation: () => void
  validateStep: (step: number) => boolean
  getMaxPossibleScore: () => number
  getMinPossibleScore: () => number
  initializeQuestionsAndOptions: () => void
  initializeResultTypes: () => void
}

const initialState: TestCreationData = {
  title: '',
  description: '',
  category: '일반',
  thumbnailUrl: '',
  detailImageUrl: '',
  questionCount: 15,
  optionCount: 3,
  styleTheme: 'modern',
  questions: [],
  resultCount: 4,
  resultTypes: [],
  currentStep: 1,
  isComplete: false
}

export const useTestCreationStore = create<TestCreationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setBasicInfo: (data) => {
        set((state) => ({
          ...state,
          ...data
        }))
      },

      setQuestions: (questions) => {
        set((state) => ({
          ...state,
          questions
        }))
      },

      setResultTypes: (resultTypes) => {
        set((state) => ({
          ...state,
          resultTypes
        }))
      },

      setCurrentStep: (step) => {
        set((state) => ({
          ...state,
          currentStep: step
        }))
      },

      resetTestCreation: () => {
        set(initialState)
      },

      validateStep: (step) => {
        const state = get()
        
        switch (step) {
          case 1:
            return !!(state.title && state.description && state.questionCount > 0 && state.optionCount > 0)
          case 2:
            return state.questions.length === state.questionCount &&
                   state.questions.every(q => 
                     q.content && q.options.length === state.optionCount &&
                     q.options.every(o => o.content && typeof o.score === 'number')
                   )
          case 3:
            return state.resultTypes.length === state.resultCount &&
                   state.resultTypes.every(r => 
                     r.name && r.description && 
                     typeof r.minScore === 'number' && typeof r.maxScore === 'number'
                   )
          default:
            return false
        }
      },

      getMaxPossibleScore: () => {
        const state = get()
        return state.questions.reduce((total, question) => {
          const maxOptionScore = Math.max(...question.options.map(o => o.score))
          return total + maxOptionScore
        }, 0)
      },

      getMinPossibleScore: () => {
        const state = get()
        return state.questions.reduce((total, question) => {
          const minOptionScore = Math.min(...question.options.map(o => o.score))
          return total + minOptionScore
        }, 0)
      },

      initializeQuestionsAndOptions: () => {
        const state = get()
        const questions = Array.from({ length: state.questionCount }, (_, i) => ({
          id: `q_${i + 1}`,
          content: '',
          options: Array.from({ length: state.optionCount }, (_, j) => ({
            id: `q_${i + 1}_o_${j + 1}`,
            content: '',
            score: j // 기본 점수: 0, 1, 2, ...
          }))
        }))
        
        set((state) => ({
          ...state,
          questions
        }))
      },

      initializeResultTypes: () => {
        const state = get()
        const maxScore = state.getMaxPossibleScore()
        const minScore = state.getMinPossibleScore()
        const scoreRange = maxScore - minScore
        const scorePerResult = scoreRange / state.resultCount
        
        const resultTypes = Array.from({ length: state.resultCount }, (_, i) => ({
          id: `result_${i + 1}`,
          name: '',
          minScore: Math.floor(minScore + (scorePerResult * i)),
          maxScore: i === state.resultCount - 1 ? maxScore : Math.floor(minScore + (scorePerResult * (i + 1)) - 1),
          imageUrl: '',
          textImageUrl: '',
          description: ''
        }))
        
        set((state) => ({
          ...state,
          resultTypes
        }))
      }
    }),
    {
      name: 'test-creation-storage',
      partialize: (state) => ({
        title: state.title,
        description: state.description,
        category: state.category,
        thumbnailUrl: state.thumbnailUrl,
        detailImageUrl: state.detailImageUrl,
        questionCount: state.questionCount,
        optionCount: state.optionCount,
        styleTheme: state.styleTheme,
        questions: state.questions,
        resultCount: state.resultCount,
        resultTypes: state.resultTypes,
        currentStep: state.currentStep
      })
    }
  )
)