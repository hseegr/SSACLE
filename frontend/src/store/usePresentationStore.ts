import { create } from 'zustand'

interface PresentationStore {
  isChatOpen: boolean
  questionCard: any[]
  setIsChatOpen: (isChatOpen: boolean) => void
  presentationStatus: string
  setQuestionCard: (questionCard: any[]) => void
  setPresentationStatus: (presentationStatus: string) => void
}

export const usePresentationStore = create<PresentationStore>((set) => ({
  isChatOpen: false,
  questionCard: [],
  presentationStatus: 'BEFORE_PRESENTATION',
  // 질문 카드 설정
  setQuestionCard: (questionCard) => set({ questionCard }),
  // 채팅 상태 설정
  setIsChatOpen: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  // 발표 상태 설정
  setPresentationStatus: (presentationStatus) => set({ presentationStatus }),
}))
