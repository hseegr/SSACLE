import { useState } from 'react'
import SprintBasicInfo from '@/components/SprintCommon/SprintBasicInfo'
import SprintSummary from '@/components/SprintCommon/SprintSummary'
import SprintParticipationModal from '@/components/SprintCommon/SprintParticipationModal'
import Button from '@/components/common/Button'
import SprintDetail from '@/components/SprintCommon/SprintDetail'

const SsaprintDetailLayout = ({ sprintData }) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!sprintData || !sprintData.sprint) {
    return (
      <p className="text-gray-500 text-center">
        스프린트 정보를 불러오는 중...
      </p>
    )
  }

  const benefits = [
    '📄 이전 참가자들의 노트 열람 가능 (총 10개 노트)',
    '🏅 우수 발표자 선정 시 100 피클 지급',
  ]

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
            recommendedFor={sprintData.sprint.recommendedFor}
            benefits={benefits}
            participation={sprintData.sprint.currentMembers}
            recruit={sprintData.sprint.maxMembers}
          />
        </div>
      </div>

      <div className="flex justify-between items-start gap-4 h-auto">
        {/* 상세 정보 */}
        <div className="flex-1">
          <SprintDetail
            sprint={sprintData.sprint}
            benefits={benefits}
            todos={sprintData.todos}
          />
        </div>

        {/* 참여 버튼 */}
        <div className="w-[17rem] flex-shrink-0">
          <Button className="w-full" onClick={() => setIsOpen(true)}>
            스프린트 참여하기
          </Button>
        </div>
      </div>

      {/* 모달 표시 */}
      {isOpen && (
        <SprintParticipationModal
          sprintId={sprintData.sprint.id}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default SsaprintDetailLayout
