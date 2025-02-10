import { useState } from 'react'
import SprintBasicInfo from '@/components/SprintCommon/SprintBasicInfo'
import SprintSummary from '@/components/SprintCommon/SprintSummary'
import SprintParticipationModal from '@/components/SprintCommon/SprintParticipationModal'
import Button from '@/components/common/Button'
import SprintDetail from "@/components/SprintCommon/SprintDetail";

const SsaprintDetailLayout = ({ sprintData }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!sprintData || !sprintData.sprint) {
    return (
      <p className="text-gray-500 text-center">
        스프린트 정보를 불러오는 중...
      </p>
    )
  }

  return (
    <div className="mt-16 flex flex-col gap-4">
      {/* 싸프린트 Info 제목 + 두꺼운 선 */}
      <h2 className="text-lg font-semibold flex items-center gap-2 pb-2 border-b-4 border-gray-200 w-full">
        싸프린트 Info{' '}
        <span role="img" aria-label="lightbulb">
          💡
        </span>
      </h2>

      <div className="flex justify-between items-stretch gap-4 h-auto">
        {/* 기본 정보 */}
        <div className="flex-1 h-auto">
          <SprintBasicInfo sprint={sprintData.sprint} />
        </div>

        {/* 요약 정보 */}
        <div className="w-[18rem] flex-shrink-0 h-auto flex">
          <SprintSummary
            recommendedFor={sprintData.recommended_for}
            benefits={sprintData.benefits}
            participation={sprintData.sprint.participation}
            recruit={sprintData.sprint.recruit}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-start gap-4 h-auto">
        {/* 상세 정보 */}
        <div className="flex-1">
          <SprintDetail sprint={sprintData.sprint} />
        </div>

        {/* 참여 버튼 */}
        <div className="w-[18rem] flex-shrink-0">
          <Button className="w-full" onClick={() => setIsOpen(true)}>
            스프린트 참여하기
          </Button>
        </div>
      </div>

      {/* 모달 표시 */}
      {isOpen && (
        <SprintParticipationModal
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            setIsOpen(false)
            // eslint-disable-next-line no-console
            console.log('스프린트 참여 완료!') // 참여중 페이지로 이동할 예정
          }}
        />
      )}
    </div>
  )
}

export default SsaprintDetailLayout
