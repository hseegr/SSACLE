import {
  PRESENTATION_STATUS,
  PresentationStatus,
} from '@/constants/presentationStatus'

export const ModalSteps = {
  // 초기 모달
  INITIAL: {
    WELCOME: 'welcome',
    READY: 'ready',
    WAITING: 'waiting',
  },

  // 발표 모달
  PRESENTATION: {
    PRESENTER_BEN: 'presenter_ben',
    PRESENTER_SELECTING: 'presenter_selecting',
    PRESENTER_INTRODUCTION: 'presenter_introduction',
    PRESENTATION_WAITING: 'presentation_waiting',
    PRESENTATION_END_CONFIRM: 'presentation_end_confirm',
    PRESENTATION_END: 'presentation_end',
  },

  // 질문 카드 모달
  QUESTION: {
    SECTION_READY: 'question_section_ready',
    ANSWER_INTRODUCTION: 'question_answer_introduction',
    ANSWER_WAITING: 'question_answer_waiting',
    ANSWER_END_CONFIRM: 'question_answer_end_confirm',
    ANSWER_MIDDLE_END: 'question_answer_middle_end',
    ANSWER_END: 'question_answer_end',
  },

  // 투표 모달
  VOTE: {
    READY: 'vote_ready',
    START: 'vote_start',
    END: 'vote_end',
  },

  // 종료 모달
  ENDING: {
    SSAPLINT_END: 'ssaplint_end',
    SSADCUP_END: 'ssadcup_end',
    END_CAUTION: 'end_caution',
    END_COMPLETE: 'end_complete',
    WAITING_END: 'waiting_end',
  },

  // 경고 모달
  WARNING: {
    EFFECT_WARNING: 'effect_warning',
  },
}

const {
  INITIAL,
  PENDING_END_CONFIRM_3MIN,
  PENDING_END,
  QUESTION_INIT,
  QUESTION_END,
  VOTE_INIT,
  VOTE_START,
  VOTE_END,
  END,
} = PRESENTATION_STATUS

// 발표 상태에 따른 모달 상태
export const PRESENTATION_MODAL_STATUS = {
  [INITIAL]: ModalSteps.INITIAL.WELCOME,

  [PENDING_END_CONFIRM_3MIN]: ModalSteps.PRESENTATION.PRESENTATION_END_CONFIRM, // 수정 필
  [PENDING_END]: ModalSteps.PRESENTATION.PRESENTATION_END,
  [QUESTION_INIT]: ModalSteps.QUESTION.SECTION_READY,

  [QUESTION_END]: ModalSteps.QUESTION.SECTION_READY,
  [VOTE_INIT]: ModalSteps.VOTE.READY,
  [VOTE_START]: ModalSteps.VOTE.START,
  [VOTE_END]: ModalSteps.VOTE.END,
  [END]: ModalSteps.ENDING.END_COMPLETE,
}

export type ModalStep = keyof typeof ModalSteps
export type ModalStepValue = (typeof ModalSteps)[keyof typeof ModalSteps]

export const getModalStep = (status: PresentationStatus) => {
  return PRESENTATION_MODAL_STATUS[status]
}
