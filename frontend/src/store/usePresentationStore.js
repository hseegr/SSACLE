import { create } from 'zustand'

export const usePresentationStore = create((set) => ({
  isChatOpen: false,
  questionCard: [],

  // 질문 카드 설정
  setQuestionCard: (questionCard) => set({ questionCard }),

  // 채팅 상태 설정
  setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
}))
