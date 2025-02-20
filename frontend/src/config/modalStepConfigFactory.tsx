import PresenterBen from '@/components/PresentationPage/PresenterBen/PresenterBen'
import QuestionCardSection from '@/components/PresentationPage/QuestionCardSection/QuestionCardSection'
import SsaprintVoteContainer from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteContainer'
import SsaprintVoteDataWrapper from '@/components/PresentationPage/SsaprintVoteContainer/SsaprintVoteDataWrapper'
import { ModalSteps } from '@/constants/modalStep'
import { PRESENTATION_STATUS } from '@/constants/presentationStatus'
import httpCommon from '@/services/http-common'
import { Session } from 'openvidu-browser'
import { ReactNode } from 'react'
import { useParams } from 'react-router-dom'

export interface ModalButton {
  text: string
  onClick: () => void
  style?: string
  variant?: string
}

export interface ModalStepConfig {
  title: ReactNode | ((...args: any[]) => ReactNode)
  description?: ReactNode
  buttons?: ReactNode | ModalButton[]
}

export interface CreateModalStepConfigProps {
  closeModal: () => void
  navigate: (url: string) => void
  leaveSession: () => Promise<void>
  session: Session
  setModalStep: (step: string) => void
  presenterInfo: {
    name: string
    connectionId: string
  }
  isQuestionSelected: boolean
  selectedQuestion: {
    id: number
    content: string
  }
  isQuestionCompleted: boolean
  setIsQuestionSelected: (isQuestionSelected: boolean) => void
  startScreenShare: () => Promise<void>
  stopScreenShare: () => Promise<void>
  setPresenterInfo: (presenterInfo: {
    connectionId: string
    username: string
  }) => void
  presentationStatus: string
}

export const createModalStepConfig = ({
  closeModal,
  navigate,
  leaveSession,
  session,
  setModalStep,
  presenterInfo,
  isQuestionSelected,
  isQuestionCompleted,
  startScreenShare,
  stopScreenShare,
  selectedQuestion,
  setIsQuestionSelected,
  setPresenterInfo,
  presentationStatus,
}: CreateModalStepConfigProps): Record<string, ModalStepConfig> => {
  const { presentationType, roomId } = useParams()
  const leavePresentation = async () => {
    try {
      await leaveSession()
      console.log('세션 해제 성공')
    } catch (error) {
      console.error('❌ 세션 해제 실패:', error)
    } finally {
      navigate('/main')
      closeModal()
    }
  }

  const sendStatusSignal = (data: string, option?: unknown) => {
    session?.signal({
      data: JSON.stringify({ data, option }),
      type: 'presentationStatus',
    })
  }

  // 준비 완료 시그널 보내기 - 발표자 전용
  const sendReadySignal = (data: string) => {
    session?.signal({
      data: JSON.stringify({ data }),
      type: 'ready',
    })
  }

  const sendEndSignal = (data: string) => {
    session?.signal({
      data: JSON.stringify({ data }),
      type: 'end',
    })
  }

  const CommonButtons: Record<string, ModalButton> = {
    CONFIRM: {
      text: '확인',
      onClick: closeModal,
      style: '',
      variant: '',
    },
    CANCEL: {
      text: '취소',
      onClick: closeModal,
      style: '',
      variant: '',
    },
    EXIT: {
      text: '나가기',
      onClick: async () => {
        // 미디어 트랙해제
        const track = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        track.getTracks().map((track) => track.stop())

        await leaveSession()
        navigate('/main')
        closeModal()
      },
      style: '',
      variant: 'destructive',
    },
  }

  const MODAL_STEP_CONFIG: Record<
    string,
    ModalStepConfig | ((...args: any[]) => void)
  > = {
    // ? 발표페이지 접속 환영 모달 ✅
    [ModalSteps.INITIAL.WELCOME]: {
      title: ['🤗 환영합니다! 🤗'],
      description: (
        <>
          <span>발표에는 비디오 및 음성을 사용합니다.</span>
          <span>비디오 및 음성 통화를 활성화 해주세요.</span>
        </>
      ),
      buttons: [CommonButtons.CONFIRM],
    },
    // ? 모든 참여자 접속 완료 ✅
    [ModalSteps.INITIAL.READY]: {
      title: ['모든 참여자가 접속 완료하였습니다. 👌'],
      description: (
        <>
          <span>
            준비가 완료되면 아래 <span className="font-bold">[시작하기]</span>
            버튼을 눌러주세요.
          </span>
          <span>
            모든 참가자가 준비가 완료되면{' '}
            {presentationType === 'ssaprint' ? '싸프린트가' : '싸드컵이'}
            시작됩니다.
          </span>
        </>
      ),
      buttons: [
        {
          text: '시작하기',
          onClick: () => {
            presentationType === 'ssaprint'
              ? sendStatusSignal(PRESENTATION_STATUS.READY)
              : sendStatusSignal(PRESENTATION_STATUS.READY_SSADCUP)
            setModalStep(ModalSteps.INITIAL.WAITING)
          },
          style: '',
        },
      ],
    },
    [ModalSteps.INITIAL.WAITING]: {
      title: ['준비를 완료 하였습니다!'],
      description: (
        <>
          <span>다른 참가자들이 준비 중입니다...</span>
          <span>
            모든 참가자가 준비되면 곧 시작됩니다! 잠시만 기다려 주세요!
          </span>
          <span className="text-4xl font-bold animate-spin">⏳</span>
        </>
      ),
      buttons: [],
    },
    // ? 발표자 벤 (싸드컵) ❌
    [ModalSteps.PRESENTATION.PRESENTER_BEN]: {
      title: ['🚫 상대팀 발표자 벤 🚫'],
      description: (
        <>
          <PresenterBen />
        </>
      ),
      buttons: [],
    },
    // ? 발표자 소개 모달 (발표자 전용) ✅
    [ModalSteps.PRESENTATION.PRESENTER_INTRODUCTION]: {
      title: (
        <>
          <span>
            <span className="font-bold text-ssacle-black">
              ✨{presenterInfo.name}✨
            </span>
            이 발표자가 되었습니다.
          </span>
          <span className="text-ssacle-blue">
            발표시간은 총 ⏱️ 10분 입니다.
          </span>
        </>
      ),
      description: (
        <>
          <span>화면 공유 버튼을 눌러 발표를 시작해주세요.</span>
        </>
      ),
      buttons: [
        {
          text: '화면 공유하기',
          onClick: async () => {
            await startScreenShare()
            // 다음 스텝으로 넘어가기 위한 시그널 보내기
            sendReadySignal(PRESENTATION_STATUS.ING)
          },
          style: '',
        },
      ],
    },
    // ? 발표 곧 시작 모달 (참여자 전용) ✅
    [ModalSteps.PRESENTATION.PRESENTATION_WAITING]: {
      title: '발표가 곧 시작됩니다!',
      description: (
        <>
          <span>발표자는 "{presenterInfo.name}"님 입니다.</span>
          <span>발표자가 준비하는 시간을 조금만 기다려주세요.</span>
          <span className="font-bold text-ssacle-blue">
            발표시간은 총 ⏱️ 10분 입니다.
          </span>
          <span className="italic">
            발표를 집중해서 들어주시면 감사하겠습니다 :)
          </span>
        </>
      ),
      buttons: (
        <>
          <span className="text-4xl font-bold animate-spin">⏳</span>
        </>
      ),
    },
    [ModalSteps.PRESENTATION.PRESENTATION_END_CONFIRM]: {
      title: ['⚠️ 발표를 완료하시겠습니까? ⚠️'],
      description: (
        <>
          <span>발표를 완료하시면 질문 섹션으로 넘어갑니다.</span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            sendEndSignal(PRESENTATION_STATUS.PENDING_END)
            closeModal()
          },
        },
        {
          text: '계속',
          onClick: () => {
            closeModal()
          },
          style: 'bg-ssacle-blue/70 hover:bg-ssacle-blue/30',
        },
      ],
    },
    // ? 발표 종료 확인 모달 ✅
    [ModalSteps.PRESENTATION.PRESENTATION_END]: {
      title: ['✅ 발표가 종료되었습니다. ✅'],
      description: (
        <>
          <span>발표 내용에 대한 메모를 남겨주세요.</span>
          <span>
            확인을 누르면 잠시 후{' '}
            <span className="font-bold text-ssacle-blue">질문 섹션</span> 으로
            넘어갑니다.
          </span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            // 다음 스템으로 넘어가기 위한 시그널 보내기
            sendStatusSignal(PRESENTATION_STATUS.QUESTION_INIT)
            stopScreenShare()
            closeModal()
            // 발표 종료 모달 띄우면 발표자 정보 초기화
            setPresenterInfo({
              connectionId: '',
              username: '',
            })
          },
          style: '',
        },
      ],
    },
    // * 질문 섹션 준비 모달 ✅
    [ModalSteps.QUESTION.SECTION_READY]: {
      title: '📝 이번 순서는 "질문 답변" 시간입니다. 📝',
      description: (
        <>
          <span>사전에 기록해둔 질문을 랜덤으로 뽑아 답변합니다.</span>
          <span>모든 참여자가 순서대로 참여합니다.</span>
          <span>
            <span className="italic font-bold text-ssacle-blue/80">
              답변 순서는 랜덤으로 정해집니다.
            </span>
          </span>
          <span className="text-sm">
            (모든 참여자가 <span className="font-bold">[확인]</span>을 누르면
            시작됩니다.)
          </span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            // 질문 섹션 시작 시그널 보내기
            setModalStep(ModalSteps.INITIAL.WAITING) // 질문 준비 모달로 이동
            setTimeout(() => {
              // 신호 전달 후 모달 close and 다음 상태로 변경
              sendStatusSignal(PRESENTATION_STATUS.QUESTION_READY)
            }, 1000)
          },
          style: '',
        },
      ],
    },

    // read -> intro -> stepComponent ->

    // * 질문 답변 소개 모달 (발표자 전용) ⚠️
    [ModalSteps.QUESTION.ANSWER_INTRODUCTION]: {
      title: (
        <>
          <span>
            이번 질문의 답변자는{' '}
            <span className=" text-ssacle-black">{presenterInfo.name}</span> 님
            입니다.
          </span>
        </>
      ),
      description: (
        <>
          <div className="flex flex-col gap-4">
            <div className="font-bold">
              <QuestionCardSection />
            </div>
            <div className="text-base">
              질문 카드를 선택 후 [준비 완료] 버튼을 눌러주세요.
            </div>
          </div>
        </>
      ),
      buttons: [
        {
          text: '준비 완료',
          onClick: () => {
            // 질문 카드를 선택한 경우
            if (isQuestionSelected) {
              session?.signal({
                data: JSON.stringify({
                  data: PRESENTATION_STATUS.QUESTION_ANSWER,
                  selectedQuestion,
                  presenterInfo,
                }),
                type: 'ready',
              })
              closeModal()
            } else {
              // 질문 카드를 선택하지 않은 경우
              alert('질문 카드를 선택해주세요.')
            }
          },
          style: isQuestionSelected ? '' : 'opacity-50 pointer-events-none ',
        },
      ],
    },
    // * 질문 답변 준비 모달 (참여자 전용) ⚠️
    [ModalSteps.QUESTION.ANSWER_WAITING]: {
      title: '질문 답변이 곧 시작됩니다!',
      description: (
        <>
          <span>이번 답변자는 "{presenterInfo.name}"님 입니다.</span>
          <span>답변자 준비하는 시간을 조금만 기다려주세요.</span>
          <span className="italic">답변자가 답변을 선택하고 있습니다.</span>
        </>
      ),
      buttons: (
        <>
          <span className="text-4xl font-bold animate-spin">⏳</span>
        </>
      ),
    },

    // * 질문 종료 확인 모달
    [ModalSteps.QUESTION.ANSWER_END_CONFIRM]: {
      title: ['⚠️ 답변을 완료하시겠습니까? ⚠️'],
      description: (
        <>
          <span>발표를 완료하시면 다음 답변자에게 턴이 넘어갑니다.</span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            sendEndSignal(PRESENTATION_STATUS.QUESTION_ANSWER_MIDDLE_END)
            closeModal()
          },
        },
        {
          text: '계속',
          onClick: () => {
            closeModal()
          },
          style: 'bg-ssacle-blue/70 hover:bg-ssacle-blue/30',
        },
      ],
    },

    // * 질문 답변 중간 종료 모달
    [ModalSteps.QUESTION.ANSWER_MIDDLE_END]: {
      title: (
        <>
          <span>✨ {presenterInfo.name} ✨이 답변을 완료했습니다. </span>
        </>
      ),
      description: (
        <>
          {isQuestionCompleted ? (
            <span>
              수고하셨습니다. 모든 사람들의 질문 답변이 완료되었습니다.👍🏻
            </span>
          ) : (
            <span>다음 단계로 넘어갑니다.</span>
          )}
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            // 모든 참여자가 완료 했을 경우, 질문 카드 종료 시그널 보내기
            !isQuestionCompleted // ! 임시로 질문 한번만 보내기
              ? sendEndSignal(PRESENTATION_STATUS.QUESTION_END)
              : sendStatusSignal(PRESENTATION_STATUS.QUESTION_ANSWER_CONTINUE)
            closeModal()
            // 질문 중간 종료 모달 띄우면 발표자 정보 초기화
            setPresenterInfo({
              connectionId: '',
              username: '',
            })
            setIsQuestionSelected(false)
          },
        },
      ],
    },

    // ! 질문 섹션 종료
    [ModalSteps.QUESTION.ANSWER_END]: {
      title: ['✨ 질문 섹션이 종료되었습니다. ✨ '],
      description: (
        <>
          <span>
            잠시후 ⏱️ 1분 후{' '}
            <span className="font-bold text-ssacle-blue">평가</span>가
            진행됩니다.
          </span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            setTimeout(() => {
              sendStatusSignal(PRESENTATION_STATUS.VOTE_INIT)
            }, 1000)
            setIsQuestionSelected(false)
            closeModal()
          },
          style: '',
        },
      ],
    },

    // ! 투표 소개 모달
    [ModalSteps.VOTE.READY]: {
      title: ['🥇 평가가 시작됩니다. 🥇'],
      description: (
        <>
          <span>잠시후 싸프린트 평가를 진행합니다.</span>
          <span>발표, 질문 답변, 태도 등 종합적으로 평가를 진행합니다.</span>
          <span className="italic font-bold text-ssacle-blue/80">
            ⏱️ 평가 시간은 최대 5분입니다.
          </span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            sendStatusSignal(PRESENTATION_STATUS.VOTE_START)
            closeModal()
          },
          style: '',
        },
      ],
    },

    // ! 투표 시작 모달
    [ModalSteps.VOTE.START]: {
      title: ['✨ 싸프린트 평가 ✨'],
      description: (
        <>
          <SsaprintVoteDataWrapper>
            <SsaprintVoteContainer
              session={session}
              sendStatusSignal={sendStatusSignal}
              closeModal={closeModal}
            />
          </SsaprintVoteDataWrapper>
        </>
      ),
      buttons: [],
    },

    // ! 투표 종료 모달
    [ModalSteps.VOTE.END]: {
      title: ['🎊 평가가 완료되었습니다. 🎊'],
      description: (
        <>
          <span>잠시 후 1분 후 결과가 공개됩니다.</span>
          <span>마지막으로 참여자들과 인사를 나눠주세요!</span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: () => {
            sendStatusSignal(PRESENTATION_STATUS.END)
            closeModal()
          },
          style: '',
        },
      ],
    },

    [ModalSteps.ENDING.END_COMPLETE]: {
      title: ['✨ 싸프린트가 종료되었습니다. ✨'],
      description: (
        <>
          <span>지금까지 열심히 발표하시느라 고생 많으셨습니다.</span>
          <span>오늘의 경험이 더 큰 성장의 발판이 되길 바랍니다.</span>
          <span className="italic">
            "언제나 <span className="font-bold text-ssacle-blue">SSACLE</span>{' '}
            이 여러분을 응원합니다."
          </span>
        </>
      ),
      buttons: [
        {
          text: '결과 확인하기',
          onClick: async () => {
            await leaveSession()
            // 피글 부여
            // httpCommon.post(`/sprints/${sprintId}/users/${userId}/score`)

            // sprint 권한 변경
            // await httpCommon.patch(`/api/v1/ssaprint/${roomId}/presentation-status`)

            // 결과 페이지로 이동
            navigate(`/ssaprint/${roomId}/result`)
            closeModal()
          },
          style: '',
        },
      ],
    },

    // ! 싸프린트 종료 모달
    [ModalSteps.ENDING.SSAPLINT_END]: {
      title: ['✨ 싸프린트가 종료되었습니다. ✨'],
      description: (
        <>
          <span>지금까지 열심히 발표하시느라 고생 많으셨습니다.</span>
          <span>오늘의 경험이 더 큰 성장의 발판이 되길 바랍니다.</span>
          <span className="italic">
            "언제나 <span className="font-bold text-ssacle-blue">SSACLE</span>{' '}
            이 여러분을 응원합니다."
          </span>
        </>
      ),
      buttons: [
        {
          text: '결과 확인하기',
          onClick: async () => {
            // 결과 확인 시그널 보내기
            // 투표 종료 시그널 보내기
            // sendSignal(PRESENTATION_STATUS.QUESTION_READY)
            // 여기서 다른 곳으로 이동하기
            await leaveSession()
            navigate(`/ssaprint/${roomId}/result`) // 결과 페이지로 이동
            closeModal()
          },
          style: '',
        },
      ],
    },
    // ! 싸드컵 종료 모달
    [ModalSteps.ENDING.SSADCUP_END]: {
      title: ['✨ 싸드컵이 종료되었습니다. ✨'],
      description: (
        <>
          <span>지금까지 열심히 발표하시느라 고생 많으셨습니다.</span>
          <span>오늘의 경험이 더 큰 성장의 발판이 되길 바랍니다.</span>
          <span className="italic">
            "언제나 <span className="font-bold text-ssacle-blue">SSACLE</span>{' '}
            이 여러분을 응원합니다."
          </span>
        </>
      ),
      buttons: [
        {
          text: '결과 확인하기',
          onClick: () => {
            // 결과 확인 시그널 보내기
            // sendSignal(PRESENTATION_STATUS.QUESTION_READY)
            leaveSession()
            closeModal()
          },
          style: '',
        },
      ],
    },
    // ! 종료 주의 모달
    [ModalSteps.ENDING.END_CAUTION]: {
      title: ['⚠️ 아직 싸프린트가 진행되고 있습니다. ⚠️'],
      description: (
        <>
          <span>진행 중에 나가면 패널티가 부여됩니다.</span>
        </>
      ),
      buttons: [
        CommonButtons.EXIT,
        {
          text: '계속 진행',
          onClick: closeModal,
          style: 'bg-ssacle-blue hover:bg-ssacle-blue/70',
          variant: '',
        },
      ],
    },

    [ModalSteps.WARNING.EFFECT_WARNING]: {
      title: ['⚠️ 아직 준비중입니다 ⚠️'],
      description: (
        <>
          <span>빠른 실내에 제공될 수 있도록 준비중입니다.</span>
        </>
      ),
      buttons: [
        {
          text: '확인',
          onClick: closeModal,
        },
      ],
    },
  }

  return MODAL_STEP_CONFIG
}
