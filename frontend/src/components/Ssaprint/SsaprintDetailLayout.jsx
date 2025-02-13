// @ts-nocheck
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

  const { sprint, todos, categories } = sprintData // 데이터 구조 분해 할당
  const benefits = [
    '📄 이전 참가자들의 노트 열람 가능 (총 10개 노트)',
    '🏅 우수 발표자 선정 시 100 피클 지급',
  ]

  return (
    <div className="mt-16 flex flex-col gap-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 pb-2 border-b-4 border-gray-200 w-full">
        싸프린트 Info 💡
      </h2>

      <div className="flex justify-between items-stretch gap-4 h-auto">
        <div className="flex-1 h-auto">
          <SprintBasicInfo sprint={sprint} categories={categories} />
        </div>

        <div className="w-[18rem] flex-shrink-0 h-auto flex">
          <SprintSummary
            recommendedFor={sprint.recommendedFor}
            benefits={benefits}
            participation={sprint.currentMembers}
            recruit={sprint.maxMembers}
          />
        </div>
      </div>

      <div className="flex justify-between items-start gap-4 h-auto">
        <div className="flex-1">
          <SprintDetail sprint={sprint} benefits={benefits} todos={todos} />
        </div>

        <div className="w-[17rem] flex-shrink-0">
          <Button className="w-full" onClick={() => setIsOpen(true)}>
            스프린트 참여하기
          </Button>
        </div>
      </div>

      {isOpen && (
        <SprintParticipationModal
          sprintId={sprint.id}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default SsaprintDetailLayout
