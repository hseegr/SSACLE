// @ts-nocheck
import { useNavigate } from 'react-router-dom'

const ItemCard = ({ item, domain }) => {
  const navigate = useNavigate()

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/${domain}/${item.id}`)
  }

  // 진행 기간 포맷팅
  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  // 모집 상태 결정
  const getRecruitStatus = (current, max) => {
    if (current >= max) {
      return {
        label: '모집 완료',
        bgColor: 'bg-gray-300 text-gray-800',
        emoji: '🔒',
        cardBg: 'bg-[#F4F4F4]',
      }
    } else if (current === max - 1) {
      return {
        label: '마감 임박',
        bgColor: 'bg-red-100 text-red-800',
        emoji: '🔥',
        cardBg: 'bg-white',
      }
    } else {
      return {
        label: '모집 중',
        bgColor: 'bg-blue-100 text-blue-800',
        emoji: '👥',
        cardBg: 'bg-white',
      }
    }
  }

  // 진행 기간 색상 결정
  const getDurationStatus = (days) => {
    if (days === 7) {
      return 'bg-green-100 text-green-800'
    } else if (days === 2) {
      return 'bg-yellow-100 text-yellow-800'
    } else {
      return 'bg-gray-100 text-gray-800'
    }
  }

  // 모집 상태 가져오기
  const recruitStatus =
    domain === 'ssaprint'
      ? getRecruitStatus(item.currentMembers, item.maxMembers)
      : getRecruitStatus(item.currentTeams, item.maxTeams)

  // 진행 기간 계산
  const durationDays = Math.ceil(
    (new Date(item.endAt).getTime() - new Date(item.startAt).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  const durationStatus = getDurationStatus(durationDays)

  // 카테고리 태그 최대 2개만 표시
  const categoryTags = (item.categories || []).slice(0, 2)

  // 썸네일 이미지 (categories 중 image가 있는 첫 번째 것)
  const thumbnail =
    (item.categories || []).find((cat) => cat.image)?.image || ''

  return (
    <div
      className={`p-5 pt-6 pb-4 border rounded-xl shadow-md flex flex-col relative w-full cursor-pointer ${recruitStatus.cardBg}`}
      onClick={handleCardClick}
    >
      {/* 제목 & 설명 */}
      <div className="flex flex-col">
        <h3 className="text-[16px] font-bold leading-tight">{item.name}</h3>
        <p className="text-[10px] text-gray-600 leading-tight mt-1">
          {item.basicDescription}
        </p>
      </div>

      {/* 진행 기간 (싸프린트 & 싸드컵 공통) */}
      <div className="flex items-center gap-1 text-[10px] font-medium text-gray-700">
        📅 <span className="font-semibold">진행 기간:</span>
        <span className="mx-1">
          {formatDate(item.startAt)} ~ {formatDate(item.endAt)}
        </span>
        <span
          className={`mx-1 px-2 py-0.5 rounded-md text-[9px] font-semibold ${durationStatus}`}
        >
          {durationDays}일
        </span>
      </div>

      {/* 모집 정보 (싸프린트 vs 싸드컵) */}
      <div className="mt-2 flex flex-col gap-1">
        {domain === 'ssaprint' ? (
          <>
            {/* 모집 인원 */}
            <div className="flex items-center gap-1 text-[10px] font-medium text-gray-700">
              👥 <span className="font-semibold">모집 인원:</span>
              <span className="mx-1">
                {item.currentMembers}명 / {item.maxMembers}명
              </span>
              <span
                className={`mx-1 px-2 py-0.5 rounded-md text-[9px] font-semibold ${recruitStatus.bgColor}`}
              >
                {recruitStatus.label}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* 모집 팀 수 */}
            <div className="flex items-center gap-1 text-[10px] font-medium text-gray-700">
              🏆 <span className="font-semibold">모집 팀 수:</span>
              <span className="mx-1">
                {item.currentTeams}팀 / {item.maxTeams}팀
              </span>
              <span
                className={`mx-1 px-2 py-0.5 rounded-md text-[9px] font-semibold ${recruitStatus.bgColor}`}
              >
                {recruitStatus.label}
              </span>
            </div>

            {/* 팀당 인원 */}
            <div className="flex items-center gap-1 text-[10px] font-medium text-gray-700">
              👤 <span className="font-semibold">팀 당 인원:</span>
              <span className="mx-1">{item.maxMembers}명</span>
            </div>
          </>
        )}
      </div>

      {/* 태그 (포지션, 기술 스택) */}
      <div className="mt-3 flex flex-col gap-1">
        {categoryTags.map((cat, index) => (
          <span
            key={cat.id || `category-${index}`}
            className="bg-blue-100 text-blue-800 px-3 py-0.5 rounded-full text-[10px] font-medium"
          >
            {cat.categoryName}
          </span>
        ))}
      </div>

      {/* 썸네일 이미지 */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt="Thumbnail"
          className="absolute bottom-4 right-4 w-8 h-8 opacity-60"
        />
      )}
    </div>
  )
}

export default ItemCard
