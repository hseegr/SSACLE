import { usePresentationModalStateStore } from '@/store/usePresentationModalStateStore'
import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from 'react-router-dom'

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

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const leavePresentation = () => {
    // navigate('/main', { replace: true })
    setIsModalOpen(false)
  }

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
