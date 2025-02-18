import { PRESENTATION_STATUS } from '@/constants/presentationStatus'
import { create } from 'zustand'

export interface QuestionCard {
  id: number
  content: string
}

interface PresentationStore {
  // 발표 진행 관련
  // 발표에 참여 해야하는 수
  targetConnectionCount: number
  setTargetConnectionCount: (targetConnectionCount: number) => void

  isAllConnection: boolean // 모든 참여자가 참여했는지 여부
  setIsAllConnection: (isAllConnection: boolean) => void

  // 발표자 정보
  presenterInfo: {
    name: string
    connectionId: string
  }
  setPresenterInfo: (presenterInfo: {
    name: string
    connectionId: string
  }) => void

  // 질문 답변자 정보
  questionAnswererInfo: {
    name: string
    connectionId: string
  }
  setQuestionAnswererInfo: (questionAnswererInfo: {
    name: string
    connectionId: string
  }) => void

  // 질문 카드 선택 여부
  isQuestionSelected: boolean // 현재 질문 카드 선택 여부
  selectedQuestion: QuestionCard | null // 현재 선택된 질문 카드
  selectedQuestionList: QuestionCard[] | null // 현재 선택된 질문 카드 목록
  setIsQuestionSelected: (isQuestionSelected: boolean) => void
  setSelectedQuestion: (selectedQuestion: QuestionCard | null) => void
  setSelectedQuestionList: (selectedQuestionList: QuestionCard[] | null) => void

  // 잘문 답변이 완료 되었는지 여부
  isQuestionCompleted: boolean
  setIsQuestionCompleted: (isQuestionCompleted: boolean) => void

  // 발표 채팅 관련
  isChatOpen: boolean
  questionCard: any[]

  // 발표 진행 관련 설정
  setIsChatOpen: (isChatOpen: boolean) => void
  setQuestionCard: (questionCard: any[]) => void
}

export const usePresentationStore = create<PresentationStore>((set) => ({
  // 발표 진행 관련
  isAllConnection: false,
  targetConnectionCount: 2,
  setTargetConnectionCount: (targetConnectionCount) =>
    set({ targetConnectionCount }),

  // 모든 참여자가 참여했는지 여부 설정
  setIsAllConnection: (isAllConnection) => set({ isAllConnection }),

  // 발표자 정보 설정
  presenterInfo: {
    name: '',
    connectionId: '',
  },
  setPresenterInfo: (presenterInfo) => set({ presenterInfo }),

  // 질문 답변자 정보 설정
  questionAnswererInfo: {
    name: '',
    connectionId: '',
  },
  setQuestionAnswererInfo: (questionAnswererInfo) =>
    set({ questionAnswererInfo }),

  // 질문 카드 선택 여부 설정
  isQuestionSelected: false,
  selectedQuestion: null,
  selectedQuestionList: [],
  setIsQuestionSelected: (isQuestionSelected) => set({ isQuestionSelected }),
  setSelectedQuestion: (selectedQuestion) => set({ selectedQuestion }),
  setSelectedQuestionList: (selectedQuestionList) =>
    set({ selectedQuestionList }),

  // 잘문 답변이 완료 되었는지 여부 설정
  isQuestionCompleted: false,
  setIsQuestionCompleted: (isQuestionCompleted) => set({ isQuestionCompleted }),

  // 발표 채팅 관련
  isChatOpen: false,
  questionCard: [],

  // 질문 카드 설정
  setQuestionCard: (questionCard) => set({ questionCard }),
  // 채팅 상태 설정
  setIsChatOpen: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
}))
