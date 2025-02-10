import { usePresentationModalStore } from '@/store/usePresentaionModalStore'

export const MODAL_STEP = {
  // 발표페이지 접속 환영 모달
  WELCOME: 'welcome',
  // 모든 참여자 접속 완료
  READY: 'ready',
  // 발표자 벤

  PRESENTER_BEN: 'presenter_ben',
  // 발표자 뽑기
  PRESENTER_SELECTING: 'presenter_selecting',
  // 발표자 소개
  PRESENTER_INTRODUCTION: 'presenter_introduction',
  // 발표 곧 시작 모달
  PRESENTATION_SOON: 'presentation_soon',
  // 발표 종료 확인 모달
  PRESENTATION_END_CONFIRM: 'presentation_end_confirm',
  // 질문 섹션 준비 모달
  QUESTION_SECTION_READY: 'question_section_ready',
  // 질문 답변 소개 모달
  QUESTION_ANSWER_INTRODUCTION: 'question_answer_introduction',
  // 질문 답변 종료 모달
  QUESTION_ANSWER_END: 'question_answer_end',
  // 싸프린트 종료 모달
  SSAPLINT_END: 'ssaplint_end',
  // 싸드컵 종료 모달
  SSADCUP_END: 'ssadcup_end',
  // 종료 주의 모달
  END_CAUTION: 'end_caution',
  // 종료 완료 모달
  END_COMPLETE: 'end_complete',
  // 종료 대기 모달
  WAITING_END: 'waiting_end',
}

export const MODAL_STEP_CONFIG = {
  // ? 발표페이지 접속 환영 모달
  [MODAL_STEP.WELCOME]: {
    title: {
      before: '환영합니다!',
    },
    description: {
      before: '비디오 및 음성 통화를 활성화 해주세요.',
    },
    buttons: [
      {
        text: '확인',
        onClick: usePresentationModalStore.getState().closeModal,
        style: '',
      },
    ],
  },
  // ? 모든 참여자 접속 완료

  [MODAL_STEP.READY]: {
    title: {
      before: '모든 참여자가 접속 완료하였습니다.',
      after: '준비완료',
    },
    description: {
      before: `준비가 완료되면 아래 [시작하기] 버튼을 눌러주세요.\n(모든 참가자가 [시작하기] 버튼을 누르면 싸프린트가 시작됩니다.)`,
      after: `다른 참가자들이 준비 중입니다..\n모든 참가자가 준비되면 곧 시작됩니다! 잠시만 기다려 주세요! ⏳`,
    },
    buttons: [
      {
        text: '시작하기',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // ? 발표자 벤 (싸드컵)
  [MODAL_STEP.PRESENTER_BEN]: {
    title: {
      before: '발표자 벤 뽑기',
    },
    description: {
      before: '상태팀에서 발표를 금지할 참가자를 뽑습니다.',
    },
    buttons: [],
  },
  // ? 발표자 소개 모달 (발표자 전용)
  [MODAL_STEP.PRESENTER_INTRODUCTION]: {
    title: {
      before: (/** @type {String} */ name) => `발표자 ${name}님 입니다.`,
    },
    description: {
      before: `발표 준비가 완료되면 아래 [확인] 버튼을 눌러 발표를 시작해주세요.`,
    },
    buttons: [
      {
        text: '확인',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // ? 발표 곧 시작 모달
  [MODAL_STEP.PRESENTATION_SOON]: {
    title: {
      before: '발표가 곧 시작됩니다!',
    },
    description: {
      before: '발표를 집중해서 들어주세요!',
    },
    buttons: [],
  },
  // ? 발표 종료 확인 모달
  [MODAL_STEP.PRESENTATION_END_CONFIRM]: {
    title: {
      before: '발표가 종료되었습니다.',
    },
    description: {
      before: '다음 질문 섹션으로 넘어갑니다.',
    },
    buttons: [
      {
        text: '확인',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // * 질문 섹션 준비 모달
  [MODAL_STEP.QUESTION_SECTION_READY]: {
    title: {
      before: '질문 섹션이 준비되었습니다.',
      after: '',
    },
    description: {
      before: '모든 참여자가 준비되면 질문 섹션이 시작됩니다.',
      after: '잠시만 기다려 주세요! ⏳',
    },
    buttons: [
      {
        text: '확인',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
      {
        text: '준비 완료',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // * 질문 답변 소개 모달
  [MODAL_STEP.QUESTION_ANSWER_INTRODUCTION]: {
    title: {
      before: '',
    },
    description: {
      before: (/** @type {String} */ name) =>
        `이번 질문의 답변자는 ${name}님 입니다. \n 잠시후 답변이 시작됩니다.`,
    },
    buttons: [],
  },
  // * 질문 답변 종료 모달
  [MODAL_STEP.QUESTION_ANSWER_END]: {
    title: {
      before: '답변이 종료되었습니다.',
      after: '',
    },
    description: {
      before: '다음 질문자가 준비되면 질문 섹션이 시작됩니다.',
      after: '잠시만 기다려 주세요! ⏳',
    },
    buttons: [
      {
        text: '확인',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
      {
        text: '준비 완료',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // ! 질문 섹션 종료
  [MODAL_STEP.QUESTION_SECTION_END]: {
    title: {
      before: '질문 섹션이 종료되었습니다.',
    },
    description: {
      before: `잠시후 마지막 평가가 진행됩니다. \n 참여자들과 인사를 해주세요.`,
    },
    buttons: [
      {
        text: '확인',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // ! 싸프린트 종료 모달
  [MODAL_STEP.SSAPLINT_END]: {
    title: {
      before: '싸프린트가 종료되었습니다.',
    },
    description: {
      before: `참여해주셔서 감사드립니다. \n 더욱 더 성장하는 개발자로 성장하길 응원합니다.♥️`,
    },
    buttons: [
      {
        text: '나가기',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // ! 싸드컵 종료 모달
  [MODAL_STEP.SSADCUP_END]: {
    title: {
      before: '싸드컵이 종료되었습니다.',
    },
    description: {
      before: `참여해주셔서 감사드립니다. \n 더욱 더 성장하는 개발자로 성장하길 응원합니다.♥️`,
    },
    buttons: [
      {
        text: '나가기',
        onClick: (/** @type {() => void} */ func) => func(),
        style: '',
      },
    ],
  },
  // ! 종료 주의 모달
  [MODAL_STEP.END_CAUTION]: {
    title: {
      before: '아직 싸프린트가 진행되고 있습니다.',
      after: '',
    },
    description: {
      before: '진행 중에 나가면 패널티가 부여됩니다.',
      after: '',
    },
    buttons: [
      {
        text: '나가기',
        onClick: (/** @type {() => void} */ func) => func(),
        style: 'danger',
      },
      {
        text: '계속 진행',
        onClick: (/** @type {() => void} */ func) => func(),
        style: 'primary',
      },
    ],
  },
}
