// @ts-nocheck
import { useNavigate } from 'react-router-dom'
import { useGetImage } from '@/hooks/useGetImage'

const ItemCard = ({ item, teamId, domain }) => {
  const imageList = useGetImage()
  const navigate = useNavigate()

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = () => {
    if (teamId) {
      // 완료된 스프린트 → 참여중 페이지 이동
      navigate(`/my-sprints/${item.id}`, {
        state: { sprintId: item.id, teamId },
      })
    } else {
      // 기존 상세 페이지 이동
      navigate(`/${domain}/${item.id}`)
    }
  }

  // 진행 기간 포맷팅 (월, 일만 표시)
  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getMonth() + 1}월 ${d.getDate()}일`
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

  // **썸네일 로직**
  // 1. 첫 번째 이미지가 있는 카테고리의 image를 사용
  let thumbnail = (item.categories || []).find((cat) => cat.image)?.image

  // 2. 이미지가 없으면, 기술 태그(오른쪽 태그)와 stackLogos 매칭
  if (!thumbnail && categoryTags.length > 0) {
    const firstTag = categoryTags[0].categoryName
    thumbnail = imageList[firstTag] || imageList.default
  }

  return (
    <div
      className={`p-5 pt-6 pb-4 border rounded-xl shadow-md flex flex-col relative
        w-full min-w-[250px] h-[200px] cursor-pointer ${recruitStatus.cardBg} hover:shadow-lg hover:scale-[1.02]`}
      onClick={handleCardClick}
    >
      {/* 제목 & 설명 */}
      <div className="flex flex-col flex-1 mt-1">
        <h3 className="text-[clamp(12px, 4vw, 16px)] font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
          {item.name}
        </h3>
        <p className="text-[10px] text-gray-600 leading-tight mt-2">
          {item.basicDescription}
        </p>
      </div>

      {/* 진행 기간 */}
      <div className="flex items-center gap-x-2 text-[10px] font-medium text-gray-700">
        <span className="flex items-center gap-x-1">
          📅 <span className="font-semibold">진행 기간:</span>
        </span>
        <span className="whitespace-nowrap">
          {formatDate(item.startAt)} ~ {formatDate(item.endAt)}
        </span>
        <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold bg-green-100 text-green-800">
          {durationDays}일
        </span>
      </div>

      {/* 모집 정보 */}
      <div className="mt-1 flex flex-col gap-0.5 mb-1">
        {domain === 'ssaprint' ? (
          <>
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

            {/* <div className="flex items-center gap-1 text-[10px] font-medium text-gray-700">
              👤 <span className="font-semibold">팀 당 인원:</span>
              <span className="mx-1">{item.maxMembers}명</span>
            </div> */}
          </>
        )}
      </div>

      {/* 태그 (포지션, 기술 스택) */}
      <div className="mt-4 flex flex-wrap gap-2 w-full items-start mb-2">
        {categoryTags
          .slice()
          .reverse()
          .map((cat, index) => (
            <span
              key={cat.id || `category-${index}`}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px] font-medium text-center 
                   max-w-[5rem] truncate overflow-hidden text-ellipsis whitespace-nowrap"
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
          className="absolute bottom-4 right-4 w-10 h-10"
        />
      )}
    </div>
  )
}

export default ItemCard
