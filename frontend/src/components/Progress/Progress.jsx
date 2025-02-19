import { PRESENTATION_STATUS } from '@/constants/presentationStatus'
import { CheckIcon, Circle } from 'lucide-react'
import { useMemo } from 'react'

const Progress = ({
  activeStep, // 현재 진행 단계
  activeColor = 'bg-gray-400', // 현재 진행 단계 색상
  completedColor = 'bg-ssacle-blue', // 완료 단계 색상
  inactiveColor = 'bg-white', // 미완료 단계 색상
  lineColor = 'bg-gray-700', // 선 색상
  className = '',
}) => {
  const steps = [
    { step: '준비', status: PRESENTATION_STATUS.READY },
    { step: '발표', status: PRESENTATION_STATUS.START },
    { step: '질문', status: PRESENTATION_STATUS.QUESTION_INIT },
    { step: '평가', status: PRESENTATION_STATUS.VOTE_INIT },
    { step: '완료', status: PRESENTATION_STATUS.END },
  ]

  // 현재 진행 단계 인덱스 찾기
  const activeStepIndex = useMemo(() => {
    return steps.findIndex((step) => step.status === activeStep)
  }, [activeStep])

  return (
    <div className={`flex items-center ${className} gap-16`}>
      {steps.map((step, idx) => (
        <div key={idx} className="relative flex items-center justify-center ">
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
