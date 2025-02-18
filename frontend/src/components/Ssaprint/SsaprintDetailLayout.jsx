// @ts-nocheck
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SprintBasicInfo from '@/components/SprintCommon/SprintBasicInfo'
import SprintSummary from '@/components/SprintCommon/SprintSummary'
import SprintParticipationModal from '@/components/SprintCommon/SprintParticipationModal'
import Button from '@/components/common/Button'
import SprintDetail from '@/components/SprintCommon/SprintDetail'

const SsaprintDetailLayout = ({ sprintData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // localStorage에서 초기값 불러오기
  const sprintId = sprintData?.sprint?.id
  const [isJoined, setIsJoined] = useState(() => {
    return localStorage.getItem(`isJoined-${sprintId}`) === 'true'
  })

  const [teamId, setTeamId] = useState(() => {
    return localStorage.getItem(`teamId-${sprintId}`) || null
  })

  // `isJoined`과 `teamId`가 변경될 때 localStorage에 저장
  useEffect(() => {
    if (sprintId) {
      localStorage.setItem(`isJoined-${sprintId}`, isJoined)
      if (teamId) {
        localStorage.setItem(`teamId-${sprintId}`, teamId)
      }
    }
  }, [isJoined, teamId, sprintId])

  useEffect(() => {
    // console.log('✅ [레이아웃] 현재 teamId 상태:', teamId);
  }, [teamId])

  if (!sprintData || !sprintData.sprint) {
    return (
      <p className="text-gray-500 text-center">
        싸프린트 정보를 불러오는 중...
      </p>
    )
  }

  const { sprint, todos, categories } = sprintData
  const benefits = [
    '📄 이전 참가자들의 노트 열람 가능 (총 10개 노트)',
    '🏅 우수 발표자 선정 시 100 피클 지급',
  ]

  const handleMoveToSprint = () => {
    if (sprintId && teamId) {
      navigate(`/my-sprints/${sprintId}`, { state: { sprintId, teamId } })
    }
  }

  return (
    <div className="mt-16 flex flex-col gap-4">
      <h2 className="text-lg font-semibold flex items-center gap-2 pb-2 border-b-4 border-gray-200 min-w-[1000px] max-w-full flex-shrink-0">
        싸프린트 Info 💡
      </h2>

      <div className="flex gap-4 md:flex-row">
        <div className="w-full md:flex-1 min-w-[42rem] min-h-[16rem]">
          <SprintBasicInfo sprint={sprint} categories={categories} />
        </div>

        <div className="flex-shrink-0 min-w-[30%]">
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

        <div className="min-w-[20rem] flex-shrink-0">
          {isJoined ? (
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleMoveToSprint}
            >
              내 싸프린트 노트 열기
            </Button>
          ) : (
            <Button className="w-full" onClick={() => setIsOpen(true)}>
              싸프린트 참여하기
            </Button>
          )}
        </div>
      </div>

      {isOpen && (
        <SprintParticipationModal
          sprintId={sprint.id}
          onClose={() => setIsOpen(false)}
          setIsJoined={setIsJoined}
          setTeamId={setTeamId}
        />
      )}
    </div>
  )
}

export default SsaprintDetailLayout
