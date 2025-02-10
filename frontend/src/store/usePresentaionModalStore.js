import { create } from 'zustand'

export const usePresentationModalStore = create((set) => ({
  // 모달 상태
  modalStep: 'welcome', // 초기 모달 상태
  isModalOpen: true,

  // 모달 상태 설정
  setModalStep: (modalStep) => set({ modalStep }),
  // nextStep: () => set({ modalStep: modalStep + 1 }),

  // 모달 open 상태 설정
  closeModal: () => set({ isModalOpen: false }),
  openModal: () => set({ isModalOpen: true }),
}))
