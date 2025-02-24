import { PRESENTATION_STATUS } from '@/constants/presentationStatus'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { CheckIcon, Circle } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

const Progress = ({
  activeStep, // 현재 진행 단계
  activeColor = 'bg-gray-400', // 현재 진행 단계 색상
  completedColor = 'bg-ssacle-blue', // 완료 단계 색상
  inactiveColor = 'bg-white', // 미완료 단계 색상
  lineColor = 'bg-gray-700', // 선 색상
  className = '',
}) => {
  const session = useOpenviduStateStore((state) => state.session)

  const sessionRef = useRef(session)
  useEffect(() => {
    sessionRef.current = session
  }, [session])

  const sendSignal = (data) => {
    sessionRef.current?.signal({
      data: JSON.stringify({ data }),
      type: 'test',
    })
  }

  const steps = [
    { step: '준비', status: PRESENTATION_STATUS.READY, onClick: () => {} },
    {
      step: '발표',
      status: PRESENTATION_STATUS.START,
      onClick: () => {
        // 발표 시작
        sendSignal(PRESENTATION_STATUS.READY)
        console.log('발표 시작')
      },
    },
    {
      step: '질문',
      status: PRESENTATION_STATUS.QUESTION_ANSWER,
      onClick: () => {
        // 질문 시작
        sendSignal(PRESENTATION_STATUS.QUESTION_READY)
        console.log('질문 시작')
      },
    },
    {
      step: '평가',
      status: PRESENTATION_STATUS.VOTE_START,
      onClick: () => {
        // 평가 시작
        sendSignal(PRESENTATION_STATUS.VOTE_INIT)
        console.log('평가 시작')
      },
    },
    {
      step: '완료',
      status: PRESENTATION_STATUS.VOTE_START,
      onClick: () => {
        // 완료
        sendSignal(PRESENTATION_STATUS.VOTE_END)
        console.log('완료')
      },
    },
  ]

  // 현재 진행 단계 인덱스 찾기
  const activeStepIndex = useMemo(() => {
    return steps.findIndex((step) => step.status === activeStep)
  }, [activeStep])

  return (
    <div className={`flex items-center ${className} gap-16`}>
      {steps.map((step, idx) => (
        <div
          onClick={step.onClick}
          key={idx}
          className="relative flex items-center justify-center cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center
                ${
                  idx < activeStepIndex // 완료 단계
                    ? completedColor
                    : idx === activeStepIndex // 진행 단계
                      ? activeColor
                      : inactiveColor // 미완료 단계
                }`}
            >
              {/* 완료 단계 */}
              {idx < activeStepIndex && <CheckIcon size={16} />}
              {/* 진행 단계 */}
              {idx === activeStepIndex && <Circle size={16} />}
            </div>
            <span className="text-sm text-gray-500">{step.step}</span>
          </div>
          {/* 선 */}
          {idx < steps.length - 1 && (
            <div
              className={`w-16 h-1 ${lineColor} absolute left-full top-2`}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Progress
