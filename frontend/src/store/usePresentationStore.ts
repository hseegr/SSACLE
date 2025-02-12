import { create } from 'zustand'

interface PresentationStore {
  isChatOpen: boolean
  questionCard: any[]
  setQuestionCard: (questionCard: any[]) => void
  setIsChatOpen: (isChatOpen: boolean) => void
}

export const usePresentationStore = create<PresentationStore>((set) => ({
  isChatOpen: false,
  questionCard: [],

  // 질문 카드 설정
  setQuestionCard: (questionCard) => set({ questionCard }),

  // 채팅 상태 설정
  setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
}))
