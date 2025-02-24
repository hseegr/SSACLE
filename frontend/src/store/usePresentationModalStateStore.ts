import { ModalSteps } from '@/constants/modalStep'
import { create } from 'zustand'

interface PresentationModalStateStore {
  modalStep: string // 보여줄 모달 상태
  isModalOpen: boolean // 모달 열림 여부
  setModalStep: (modalStep: string) => void // 모달 상태 설정
  setIsModalOpen: (isModalOpen: boolean) => void // 모달 열림 여부 설정
}

export const usePresentationModalStateStore =
  create<PresentationModalStateStore>((set) => ({
    // 모달 상태
    modalStep: ModalSteps.INITIAL.WELCOME, // 초기 모달 상태
    // modalStep: ModalSteps.QUESTION.ANSWER_INTRODUCTION, // 테스트 모달
    isModalOpen: true,

    // 모달 상태 설정
    setModalStep: (modalStep) => set({ modalStep }),
    setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  }))
