import { useConnect } from '@/hooks/useConnect'
import { create } from 'zustand'

interface PresentationModalStateStore {
  modalStep: string
  isModalOpen: boolean
  setModalStep: (modalStep: string) => void
  setIsModalOpen: (isModalOpen: boolean) => void
}

export const usePresentationModalStateStore =
  create<PresentationModalStateStore>((set) => ({
    // 모달 상태
    modalStep: 'welcome', // 초기 모달 상태
    isModalOpen: true,
    // 모달 상태 설정
    setModalStep: (modalStep) => set({ modalStep }),
    setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  }))
