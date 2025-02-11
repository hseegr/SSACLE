import SprintProgressStatus from '@/components/SprintCommon/SprintProgressStatus'
import JoinSprintInfo from '@/components/SprintCommon/JoinSprintInfo'
import SprintDetail from '@/components/SprintCommon/SprintDetail'
import { useState } from 'react'

const SsaprintJourneyLayout = ({ sprint }) => {
  const [isOpen, setIsOpen] = useState(false)

  const benefits = [
    '📄 이전 참가자들의 노트 열람 가능 (총 10개 노트)',
    '🏅 우수 발표자 선정 시 100 피클 지급',
  ]

  if (!sprint) return null

  return (
    <div className="mt-16 flex flex-col lg:flex-row gap-6 items-start w-full px-0">
      {/* 왼쪽 영역 - JoinSprintInfo + SprintDetail */}
      <div className="flex-1 min-w-[60%]">
        <JoinSprintInfo sprint={sprint} isOpen={isOpen} setIsOpen={setIsOpen} />
        {isOpen && <SprintDetail sprint={sprint.sprint} benefits={benefits} />}
      </div>

      {/* 오른쪽 영역 - SprintProgressStatus */}
      <div className="w-full lg:w-[33%] flex flex-col">
        <div className="mb-4">
          {/* 여기에 '내 노트 공개' 토글 컴포넌트 추가 예정 */}
        </div>

        <div className="mt-6">
          <SprintProgressStatus sprint={sprint} />
        </div>

        <div className="mt-6">
          {/* 여기에 '싸프린트 학습 노트 열기' 버튼 추가 예정 */}
        </div>
      </div>
    </div>
  )
}

export default SsaprintJourneyLayout
