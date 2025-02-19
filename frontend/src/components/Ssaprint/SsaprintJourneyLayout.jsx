//@ts-nocheck
import { useState } from 'react'
import SprintProgressStatus from '@/components/SprintCommon/SprintProgressStatus'
import JoinSprintInfo from '@/components/SprintCommon/JoinSprintInfo'
import SprintDetail from '@/components/SprintCommon/SprintDetail'
import SprintToDoList from '@/components/SprintCommon/SprintToDoList'
import SprintPresentationSession from '@/components/SprintCommon/SprintPresentationSession'
import SprintCalendar from '@/components/SprintCommon/SprintCalendar'
import SprintQuestionCards from '@/components/SprintCommon/SprintQuestionCards'
import Button from '@/components/common/Button'
import { getActiveSsaprint } from '@/services/ssaprintService'

const SsaprintJourneyLayout = ({ sprintData }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [todoList, setTodoList] = useState(sprintData.todos || [])

  const benefits = [
    '📄 이전 참가자들의 노트 열람 가능 (총 10개 노트)',
    '🏅 우수 발표자 선정 시 100 피클 지급',
  ]

  // sprintData 또는 sprint 속성이 없는 경우 렌더링하지 않음
  if (!sprintData || !sprintData.sprint) return null

  const { sprint, categories, questionCards, team, diaries } = sprintData
  const isBeforeStart = sprint.status === 0 // 스프린트 시작 전 여부 체크

  // To-Do 추가 후 최신 데이터를 다시 불러옴
  const refreshTodos = async () => {
    try {
      const updatedData = await getActiveSsaprint(sprint.id, team.id)
      setTodoList(updatedData.todos) // 최신 To-Do 목록 갱신
    } catch (error) {
      alert('❌ 최신 To-Do 목록을 불러오는 데 실패했습니다.')
    }
  }

  // 싸프린트 학습 노트 열기 버튼 클릭 시 URL 이동
  const handleOpenNotion = () => {
    if (team?.notionUrl) {
      window.open(team.notionUrl, '_blank') // 새 탭에서 열기
    } else {
      alert('노트 URL이 없습니다.')
    }
  }

  return (
    <div className="mt-16 flex flex-col gap-4 items-start w-full px-0">
      {/* 첫 번째 줄 - JoinSprintInfo + SprintProgressStatus */}
      <div className="flex w-full gap-6">
        {/* 왼쪽 영역 - JoinSprintInfo + SprintDetail */}
        <div className="min-w-[42rem] w-full">
          <JoinSprintInfo
            sprintData={sprintData}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          {/* SprintDetail이 펼쳐질 때 높이를 조정하여 다른 컴포넌트와 겹치지 않도록 함 */}
          <div
            className={`transition-all duration-300 ${
              isOpen
                ? 'min-h-[300px] opacity-100'
                : 'h-0 opacity-0 overflow-hidden'
            }`}
          >
            <SprintDetail
              sprint={sprint}
              benefits={benefits}
              todos={sprintData.todos || []}
            />
          </div>
        </div>

        {/* 오른쪽 영역 - SprintProgressStatus */}
        <div className="min-w-[20rem] flex flex-col">
          <div className="mb-11">
            {/* '내 노트 공개' 토글 컴포넌트 추가 예정 */}
          </div>

          <div className="mt-10">
            <SprintProgressStatus sprint={sprint} />
          </div>

          <div className="mt-3 mb-1">
            {/* 노션 이동 버튼 */}
            <Button
              className="w-full"
              variant="notion"
              onClick={handleOpenNotion}
              disabled={isBeforeStart}
            >
              싸프린트 학습 노트 열기 📚
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t-4 border-gray-200 min-w-[63rem] w-full"></div>

      {/* 두 번째 줄 - 캘린더 + To-Do List */}
      <div className="flex w-full gap-5 mt-4 mb-4">
        {/* 캘린더 */}
        <div className="flex-1 min-w-[42rem] bg-white shadow-md rounded-lg p-4">
          <SprintCalendar sprint={sprint} diaries={diaries} />
        </div>

        {/* To-Do 리스트 및 발표 세션 */}
        <div className="min-w-[20rem]">
          <div
            className={`relative ${isBeforeStart ? 'opacity-30 pointer-events-none cursor-not-allowed' : ''}`}
          >
            <SprintPresentationSession sprint={sprint} />
          </div>
          <div
            className={`mt-6 relative ${isBeforeStart ? 'opacity-30 pointer-events-none cursor-not-allowed' : ''}`}
          >
            <SprintToDoList
              todos={todoList}
              teamId={team.id}
              refreshTodos={refreshTodos}
            />
          </div>
        </div>
      </div>

      {/* 질문카드 */}
      <div
        className={`flex w-full shadow-md rounded-lg p-4 mb-10 ${isBeforeStart ? 'opacity-30 pointer-events-none cursor-not-allowed' : ''}`}
        style={{ minWidth: '1020px' }}
      >
        <SprintQuestionCards sprintId={sprint.id} teamId={team?.id} />
      </div>
    </div>
  )
}

export default SsaprintJourneyLayout
