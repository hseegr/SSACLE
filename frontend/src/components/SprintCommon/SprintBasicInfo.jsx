const SprintBasicInfo = ({ sprint }) => {
  if (!sprint) {
    return <p className="text-gray-500">데이터를 불러오는 중...</p>
  }

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  // 모집 상태 결정
  const getRecruitStatus = (participation, recruit) => {
    if (participation === recruit) {
      return {
        label: '모집 마감',
        bgColor: 'bg-gray-300 text-gray-800',
        emoji: '🔒',
      }
    } else if (participation === recruit - 1) {
      return {
        label: '마감 임박',
        bgColor: 'bg-red-100 text-red-800',
        emoji: '🔥',
      }
    } else {
      return {
        label: '모집 중',
        bgColor: 'bg-blue-100 text-blue-800',
        emoji: '👥',
      }
    }
  }

  // 진행 기간 계산
  const durationDays = Math.ceil(
    (new Date(sprint.endAt).getTime() - new Date(sprint.startAt).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  // 모집 상태 가져오기
  const recruitStatus = getRecruitStatus(sprint.participation, sprint.recruit)

  // 태그 배열 변환
  const tags = sprint.tags
    ? sprint.tags.split(',').map((tag) => tag.trim())
    : []

  return (
    <div className="p-5 border rounded-xl shadow-md flex flex-col bg-white relative min-h-[7rem] w-[52rem] flex-grow-0 flex-shrink-0 gap-2.5 h-full">
      {/* 스프린트 제목 및 설명 */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold">
          {sprint.name || '스프린트 이름 없음'}
        </h3>
        <p className="text-xs text-gray-600">
          {sprint.description || '설명 없음'}
        </p>
      </div>

      {/* 진행 기간 및 모집 정보 */}
      <div className="flex flex-col gap-1">
        {/* 진행 기간 */}
        <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
          📅 <span className="font-semibold">진행 기간</span>
          <span>
            {formatDate(sprint.startAt)} ~ {formatDate(sprint.endAt)}
          </span>
          <span className="min-w-16 px-2 py-0.5 rounded-md text-xs font-semibold bg-green-100 text-green-800 text-center">
            {durationDays}일
          </span>
        </div>

        {/* 모집 정보 */}
        <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
          {recruitStatus.emoji} <span className="font-semibold">모집 인원</span>
          <span>
            {sprint.participation ?? '0'}명 / {sprint.recruit ?? '0'}명
          </span>
          <span
            className={`min-w-16 px-2 py-0.5 rounded-md text-xs font-semibold ${recruitStatus.bgColor} text-center`}
          >
            {recruitStatus.label}
          </span>
        </div>
      </div>

      {/* 태그 표시 */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 rounded-full text-xs font-medium px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 썸네일 이미지 */}
      {sprint.thumbnail && (
        <img
          src={sprint.thumbnail}
          alt="Sprint Thumbnail"
          className="absolute bottom-3 right-3 w-10 h-10 opacity-80"
        />
      )}
    </div>
  )
}

export default SprintBasicInfo
