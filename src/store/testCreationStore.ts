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
  
  // 결과 타입 정의 (1단계에서 미리 정의)
  resultTypes: {
    id: string
    name: string
    description: string
    imageUrl: string
    textImageUrl: string
  }[]
  
  // 2단계: 문제 및 선택지
  questions: {
    id: string
    content: string
    options: {
      id: string
      content: string
      scores: { [resultTypeId: string]: number } // 각 결과 타입별 점수
    }[]
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
  initializeQuestionsAndOptions: () => void
  initializeResultTypes: () => void
  addResultType: () => void
  removeResultType: (id: string) => void
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
            return !!(state.title && state.description && state.questionCount > 0 && state.optionCount > 0 && state.resultTypes.length >= 2)
          case 2:
            return state.questions.length === state.questionCount &&
                   state.questions.every(q => 
                     q.content && q.options.length === state.optionCount &&
                     q.options.every(o => o.content && Object.keys(o.scores).length > 0)
                   )
          case 3:
            return state.resultTypes.length >= 2 &&
                   state.resultTypes.every(r => 
                     r.name && r.description
                   )
          default:
            return false
        }
      },

      addResultType: () => {
        const state = get()
        const newId = `result_${Date.now()}`
        const newResultType = {
          id: newId,
          name: '',
          description: '',
          imageUrl: '',
          textImageUrl: ''
        }
        
        set((state) => ({
          ...state,
          resultTypes: [...state.resultTypes, newResultType]
        }))
      },

      removeResultType: (id) => {
        set((state) => ({
          ...state,
          resultTypes: state.resultTypes.filter(rt => rt.id !== id)
        }))
      },

      initializeQuestionsAndOptions: () => {
        const state = get()
        
        // 기본 점수 객체 생성 (모든 결과 타입에 대해 0점으로 초기화)
        const defaultScores = state.resultTypes.reduce((acc, rt) => {
          acc[rt.id] = 0
          return acc
        }, {} as { [key: string]: number })
        
        const questions = Array.from({ length: state.questionCount }, (_, i) => ({
          id: `q_${i + 1}`,
          content: '',
          options: Array.from({ length: state.optionCount }, (_, j) => ({
            id: `q_${i + 1}_o_${j + 1}`,
            content: '',
            scores: { ...defaultScores } // 각 결과 타입별 점수 객체
          }))
        }))
        
        set((state) => ({
          ...state,
          questions
        }))
      },

      initializeResultTypes: () => {
        // 기본 결과 타입이 없으면 기본값 설정
        set((state) => {
          if (state.resultTypes.length === 0) {
            const defaultResultTypes = [
              { id: 'type_A', name: 'A형', description: '', imageUrl: '', textImageUrl: '' },
              { id: 'type_B', name: 'B형', description: '', imageUrl: '', textImageUrl: '' },
              { id: 'type_C', name: 'C형', description: '', imageUrl: '', textImageUrl: '' },
              { id: 'type_D', name: 'D형', description: '', imageUrl: '', textImageUrl: '' }
            ]
            return { ...state, resultTypes: defaultResultTypes }
          }
          return state
        })
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
        resultTypes: state.resultTypes,
        currentStep: state.currentStep
      })
    }
  )
)