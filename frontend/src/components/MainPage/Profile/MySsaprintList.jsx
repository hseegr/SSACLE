import { useNavigate } from 'react-router-dom'

const MySsaprintList = ({ currentSprintsData }) => {
  const navigate = useNavigate()

  const handleSprintClick = (sprintId, teamId) => {
    if (sprintId && teamId) {
      navigate(`/my-sprints/${sprintId}`, { state: { sprintId, teamId } })
    }
  }

  // 현재 날짜 기준으로 진행 중인 스프린트와 종료된 스프린트 분리
  const currentDate = new Date()
  const { activeSprints, completedSprints } = currentSprintsData.reduce(
    (acc, sprint) => {
      const endDate = new Date(sprint.endAt)
      if (currentDate <= endDate) {
        acc.activeSprints.push(sprint)
      } else {
        acc.completedSprints.push(sprint)
      }
      return acc
    },
    { activeSprints: [], completedSprints: [] }
  )

  // 진행 중인 스프린트는 종료일이 임박한 순으로 정렬
  const sortedActiveSprints = activeSprints.sort(
    (a, b) => new Date(a.endAt) - new Date(b.endAt)
  )

  // 종료된 스프린트는 최근 종료된 순으로 정렬
  const sortedCompletedSprints = completedSprints.sort(
    (a, b) => new Date(b.endAt) - new Date(a.endAt)
  )

  // 진행 중인 스프린트가 4개 미만일 경우, 종료된 스프린트로 채움
  const displaySprints = [
    ...sortedActiveSprints.slice(0, 4),
    ...sortedCompletedSprints.slice(0, 4 - sortedActiveSprints.length),
  ].slice(0, 4)

  return (
    <div className="bg-white w-full h-60 rounded-xl text-ssacle-black">
      {currentSprintsData.length === 0 ? (
        // 데이터가 없을 경우 표시할 메시지
        <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-xl">
          <p className="text-gray-300 text-center text-sm">
            참여 중인 스프린트가 없습니다. <br />
            지금 바로 참여해 보세요!
          </p>
        </div>
      ) : (
        <div className="flex flex-col pl-6 pt-4">
          {/* 제목 영역 */}
          <p className="tracking-tighter text-xl font-bold mb-6">
            나의 싸프린트 & 싸드컵 🌟
          </p>

          {/* currentSprintsData 배열을 순회하며 각 스프린트 정보 표시 */}
          {displaySprints.map((sprint) => {
            const currentDate = new Date()
            const endDate = new Date(sprint.endAt)
            const isActive = currentDate <= endDate // 현재 진행중이면 true

            // 상태에 따른 색상 설정 (진행중: 녹색, 종료: 회색)
            const statusColor = isActive ? 'bg-green-500' : 'bg-ssacle-gray'

            // 뱃지 너비 동적 설정
            const badgeWidth = sprint.type === '싸프린트' ? 'w-20' : 'w-16'
            const dateBadgeWidth = sprint.type.includes('싸프린트')
              ? 'w-10'
              : 'w-14'

            return (
              <div
                key={sprint.id}
                className="flex flex-row gap-x-2 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => {
                  handleSprintClick(sprint.id, sprint.teamId)
                }}
              >
                {/* 상태 표시 점 */}
                <div
                  className={`${statusColor} w-1.5 h-1.5 rounded-xl self-start`}
                ></div>

                {/* 스프린트 제목 */}
                <p className="tracking-tighter text-l font-medium mr-2">
                  {sprint.name}
                </p>

                {/* 분류 뱃지 */}
                <p
                  className={`${statusColor} ${badgeWidth} font-medium h-6 rounded-xl text-center text-white text-sm`}
                >
                  {sprint.type}
                </p>

                {/* 진행 기간 뱃지 */}
                <p
                  className={`${statusColor} ${dateBadgeWidth} font-medium h-6 rounded-xl text-center text-white text-sm`}
                >
                  {sprint.duration}
                  {sprint.type.includes('싸프린트') ? '일' : '개월'}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MySsaprintList
