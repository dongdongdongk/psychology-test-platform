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
  enableRadarChart: boolean
  enableBarChart: boolean
  showResultImage: boolean
  showTextImage: boolean
  
  // 결과 타입 정의 (질문에서 점수 입력 시 동적 생성)
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
  generateResultTypesFromQuestions: () => void
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
  enableRadarChart: false,
  enableBarChart: false,
  showResultImage: true,
  showTextImage: true,
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
        set(() => ({
          ...get(),
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
                     q.options.every(o => o.content && o.scores && Object.keys(o.scores).length > 0)
                   )
          case 3:
            // 질문에서 생성된 결과 타입들이 모두 설정되어야 함
            const allTypeIds = new Set<string>()
            state.questions.forEach(q => {
              q.options.forEach(o => {
                if (o.scores) {
                  Object.keys(o.scores).forEach(typeId => allTypeIds.add(typeId))
                }
              })
            })
            return allTypeIds.size >= 2 &&
                   state.resultTypes.length >= allTypeIds.size &&
                   state.resultTypes.every(r => r.name && r.description)
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
        
        // 기존 질문이 있으면 유지, 없으면 새로 생성
        const questions = state.questions.length > 0 
          ? state.questions.map((q, i) => ({
              ...q,
              options: q.options.map((o, j) => ({
                ...o,
                scores: o.scores || {} // 기존 데이터에 scores가 없으면 빈 객체로 초기화
              }))
            }))
          : Array.from({ length: state.questionCount }, (_, i) => ({
              id: `q_${i + 1}`,
              content: '',
              options: Array.from({ length: state.optionCount }, (_, j) => ({
                id: `q_${i + 1}_o_${j + 1}`,
                content: '',
                scores: {} // 빈 점수 객체로 시작
              }))
            }))
        
        set((state) => ({
          ...state,
          questions
        }))
      },

      initializeResultTypes: () => {
        // 더 이상 기본 결과 타입을 생성하지 않음
        // 질문에서 점수 입력 시 동적으로 생성됨
      },

      generateResultTypesFromQuestions: () => {
        const state = get()
        const allTypeIds = new Set<string>()
        
        // 모든 질문의 선택지에서 사용된 타입 ID 수집
        state.questions.forEach(q => {
          q.options.forEach(o => {
            if (o.scores) {
              Object.keys(o.scores).forEach(typeId => allTypeIds.add(typeId))
            }
          })
        })
        
        // 기존 결과 타입 중 여전히 사용되는 것들 유지
        const existingTypes = state.resultTypes.filter(rt => allTypeIds.has(rt.id))
        const existingTypeIds = new Set(existingTypes.map(rt => rt.id))
        
        // 새로운 타입 ID들에 대해 결과 타입 생성
        const newTypes = Array.from(allTypeIds)
          .filter(typeId => !existingTypeIds.has(typeId))
          .map(typeId => ({
            id: typeId,
            name: `${typeId}형`,
            description: '',
            imageUrl: '',
            textImageUrl: ''
          }))
        
        set((state) => ({
          ...state,
          resultTypes: [...existingTypes, ...newTypes]
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
        enableRadarChart: state.enableRadarChart,
        showResultImage: state.showResultImage,
        showTextImage: state.showTextImage,
        questions: state.questions,
        resultTypes: state.resultTypes,
        currentStep: state.currentStep
      })
    }
  )
)