import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Question {
  id: string
  content: string
  type: 'single' | 'multiple'
  answerOptions: {
    id: string
    content: string
    value: string
    order: number
  }[]
}

interface QuizState {
  testId: string | null
  questions: Question[]
  currentQuestion: number
  answers: Record<string, string | string[]>
  startTime: number | null
  
  // Actions
  initializeQuiz: (testId: string, questions: Question[]) => void
  setAnswer: (questionId: string, answer: string | string[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  goToQuestion: (index: number) => void
  resetQuiz: () => void
  getProgress: () => number
  getAnsweredCount: () => number
  isQuestionAnswered: (questionId: string) => boolean
  getTimeElapsed: () => number
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      testId: null,
      questions: [],
      currentQuestion: 0,
      answers: {},
      startTime: null,

      initializeQuiz: (testId: string, questions: Question[]) => {
        const initialAnswers: Record<string, string | string[]> = {}
        questions.forEach(question => {
          initialAnswers[question.id] = question.type === 'multiple' ? [] : ''
        })
        
        set({
          testId,
          questions,
          currentQuestion: 0,
          answers: initialAnswers,
          startTime: Date.now()
        })
      },

      setAnswer: (questionId: string, answer: string | string[]) => {
        set(state => ({
          answers: {
            ...state.answers,
            [questionId]: answer
          }
        }))
      },

      nextQuestion: () => {
        set(state => ({
          currentQuestion: Math.min(state.currentQuestion + 1, state.questions.length - 1)
        }))
      },

      previousQuestion: () => {
        set(state => ({
          currentQuestion: Math.max(state.currentQuestion - 1, 0)
        }))
      },

      goToQuestion: (index: number) => {
        set(state => ({
          currentQuestion: Math.max(0, Math.min(index, state.questions.length - 1))
        }))
      },

      resetQuiz: () => {
        set({
          testId: null,
          questions: [],
          currentQuestion: 0,
          answers: {},
          startTime: null
        })
      },

      getProgress: () => {
        const state = get()
        return state.questions.length > 0 ? 
          ((state.currentQuestion + 1) / state.questions.length) * 100 : 0
      },

      getAnsweredCount: () => {
        const state = get()
        return Object.values(state.answers).filter(answer => {
          if (Array.isArray(answer)) {
            return answer.length > 0
          }
          return answer !== ''
        }).length
      },

      isQuestionAnswered: (questionId: string) => {
        const state = get()
        const answer = state.answers[questionId]
        if (Array.isArray(answer)) {
          return answer.length > 0
        }
        return answer !== ''
      },

      getTimeElapsed: () => {
        const state = get()
        return state.startTime ? Date.now() - state.startTime : 0
      }
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        testId: state.testId,
        answers: state.answers,
        currentQuestion: state.currentQuestion,
        startTime: state.startTime
      })
    }
  )
)