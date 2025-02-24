import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'

export const useModal = () => {
  const { isModalOpen, modalStep, setIsModalOpen, setModalStep } =
    usePresentationModalStateStore(
      useShallow((state) => ({
        isModalOpen: state.isModalOpen,
        modalStep: state.modalStep,
        setIsModalOpen: state.setIsModalOpen,
        setModalStep: state.setModalStep,
      }))
    )
  const navigate = useNavigate()

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  const leavePresentation = useCallback(() => {
    // navigate('/main', { replace: true })
    setIsModalOpen(false)
  }, [setIsModalOpen])

  return {
    //
    isModalOpen,
    modalStep,
    closeModal,
    openModal,
    setIsModalOpen,
    leavePresentation,
    setModalStep,
  }
}
