import { create } from 'zustand'
import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { useNavigate } from 'react-router-dom'

interface PresentationModalActions {
  closeModal: () => void
  openModal: () => void
  setModalStep: (modalStep: string) => void
}

export const usePresentationModalActions = create<PresentationModalActions>(
  (set) => {
    const setIsModalOpen =
      usePresentationModalStateStore.getState().setIsModalOpen
    const setModalStep = usePresentationModalStateStore.getState().setModalStep

    const closeModal = () => {
      setIsModalOpen(false)
    }

    const openModal = () => {
      setIsModalOpen(true)
    }

    return {
      closeModal,
      openModal,
      setModalStep,
    }
  }
)
