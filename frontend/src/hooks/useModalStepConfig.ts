import { ModalSteps } from '@/constants/modalStep'
import { usePresentationModalActions } from '@/store/usePresentationModalActions'
import { useNavigate } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

const useModalStepConfig = () => {
  const { closeModal, setModalStep } = usePresentationModalActions(
    useShallow((state) => ({
      closeModal: state.closeModal,
      setModalStep: state.setModalStep,
    }))
  )
  const navigate = useNavigate()
  const leavePresentation = () => {
    navigate('/main', { replace: true })
    closeModal()
  }

  const CommonButtons = {
    CONFIRM: {
      text: '확인',
      onClick: closeModal,
      style: 'bg-ssacle-blue',
      variant: '',
    },
    CANCEL: {
      text: '취소',
      onClick: closeModal,
      style: 'bg-ssacle-blue',
      variant: '',
    },
    EXIT: {
      text: '나가기',
      onClick: leavePresentation,
      style: '',
      variant: 'destructive',
    },
  }

  const MODAL_STEP_CONFIG = {
    // ? 발표페이지 접속 환영 모달
    [ModalSteps.INITIAL.WELCOME]: {
      title: ['환영합니다!'],
      description: [
        '발표에는 비디오 및 음성을 사용합니다.',
        '비디오 및 음성 통화를 활성화 해주세요.',
      ],
      buttons: [CommonButtons.CONFIRM],
    },
    // ? 모든 참여자 접속 완료
    [ModalSteps.INITIAL.READY]: {
      title: ['모든 참여자가 접속 완료하였습니다.', '준비완료'],
      description: [
        `준비가 완료되면 아래 [시작하기] 버튼을 눌러주세요.\n(모든 참가자가 [시작하기] 버튼을 누르면 싸프린트가 시작됩니다.)`,
        `다른 참가자들이 준비 중입니다..\n모든 참가자가 준비되면 곧 시작됩니다! 잠시만 기다려 주세요! ⏳`,
      ],
      buttons: [
        {
          text: '시작하기',
          onClick: () => {},
          style: '',
        },
      ],
    },
    // ? 발표자 벤 (싸드컵)
    [ModalSteps.PRESENTATION.PRESENTER_BEN]: {
      title: ['발표자 벤 뽑기'],
      description: ['상태팀에서 발표를 금지할 참가자를 뽑습니다.'],
      buttons: [],
    },
    // ? 발표자 소개 모달 (발표자 전용)
    [ModalSteps.PRESENTATION.PRESENTER_INTRODUCTION]: {
      title: [(name: string) => `발표자 ${name}님 입니다.`],
      description: [
        `발표 준비가 완료되면 아래 [확인] 버튼을 눌러 발표를 시작해주세요.`,
      ],
      buttons: [CommonButtons.CONFIRM],
    },
    // ? 발표 곧 시작 모달
    [ModalSteps.PRESENTATION.PRESENTATION_SOON]: {
      title: ['발표가 곧 시작됩니다!'],
      description: ['발표를 집중해서 들어주세요!'],
      buttons: [],
    },
    // ? 발표 종료 확인 모달
    [ModalSteps.PRESENTATION.PRESENTATION_END_CONFIRM]: {
      title: ['발표가 종료되었습니다.'],
      description: ['다음 질문 섹션으로 넘어갑니다.'],
      buttons: [CommonButtons.CONFIRM],
    },
    // * 질문 섹션 준비 모달
    [ModalSteps.QUESTION.SECTION_READY]: {
      title: ['질문 섹션이 준비되었습니다.'],
      description: [
        '모든 참여자가 준비되면 질문 섹션이 시작됩니다.',
        '잠시만 기다려 주세요! ⏳',
      ],
      buttons: [CommonButtons.CONFIRM, CommonButtons.CANCEL],
    },
    // * 질문 답변 소개 모달
    [ModalSteps.QUESTION.ANSWER_INTRODUCTION]: {
      title: [
        (name: string) =>
          `이번 질문의 답변자는 ${name}님 입니다. \n 잠시후 답변이 시작됩니다.`,
      ],
      buttons: [],
    },
    // * 질문 답변 종료 모달
    [ModalSteps.QUESTION.ANSWER_END]: {
      title: ['답변이 종료되었습니다.'],
      description: [
        '다음 질문자가 준비되면 질문 섹션이 시작됩니다.',
        '잠시만 기다려 주세요! ⏳',
      ],
      buttons: [
        {
          text: '확인',
          onClick: () => {},
          style: '',
        },
        {
          text: '준비 완료',
          onClick: () => {},
          style: '',
        },
      ],
    },
    // ! 질문 섹션 종료
    [ModalSteps.QUESTION.ANSWER_END]: {
      title: ['질문 섹션이 종료되었습니다.'],
      description: [
        `잠시후 마지막 평가가 진행됩니다. \n 참여자들과 인사를 해주세요.`,
      ],
      buttons: [CommonButtons.CONFIRM],
    },
    // ! 싸프린트 종료 모달
    [ModalSteps.ENDING.SSAPLINT_END]: {
      title: ['싸프린트가 종료되었습니다.'],
      description: [
        `참여해주셔서 감사드립니다. \n 더욱 더 성장하는 개발자로 성장하길 응원합니다.♥️`,
      ],
      buttons: [CommonButtons.EXIT],
    },
    // ! 싸드컵 종료 모달
    [ModalSteps.ENDING.SSADCUP_END]: {
      title: ['싸드컵이 종료되었습니다.'],
      description: [
        `참여해주셔서 감사드립니다. \n 더욱 더 성장하는 개발자로 성장하길 응원합니다.♥️`,
      ],
      buttons: [CommonButtons.EXIT],
    },
    // ! 종료 주의 모달
    [ModalSteps.ENDING.END_CAUTION]: {
      title: ['⚠️ 아직 싸프린트가 진행되고 있습니다.'],
      description: ['진행 중에 나가면 패널티가 부여됩니다.'],
      buttons: [
        CommonButtons.EXIT,
        {
          text: '계속 진행',
          onClick: closeModal,
          style: 'bg-ssacle-blue',
          variant: '',
        },
      ],
    },
    // 새로운 모달 스텝 추가
    [ModalSteps.ENDING.NAVIGATION_BLOCK]: {
      title: ['⚠️ 페이지를 벗어나시겠습니까?'],
      description: ['진행 중에 페이지를 벗어나면 패널티가 부여됩니다.'],
      buttons: [
        CommonButtons.EXIT,
        {
          text: '계속 진행',
          onClick: closeModal,
          style: 'bg-ssacle-blue',
          variant: '',
        },
      ],
    },
  }

  return { MODAL_STEP_CONFIG }
}

export default useModalStepConfig
