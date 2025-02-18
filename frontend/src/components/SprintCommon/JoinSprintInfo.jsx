// @ts-nocheck
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const JoinSprintInfo = ({ sprintData, isOpen, setIsOpen }) => {
  if (!sprintData || !sprintData.sprint) return null

  const { sprint, categories } = sprintData

  // 첫 번째 이미지가 있는 카테고리의 image를 썸네일로 사용
  const thumbnail = categories.find((category) => category.image)?.image

  // 태그 최대 2개만 표시
  const displayedTags = categories.slice(0, 2)

  return (
    <div className="p-5 bg-white shadow-md rounded-xl transition-all w-[47rem] min-h-[8rem]">
      {/* 접었을 때 UI */}
      <div className="w-full flex flex-col text-gray-800">
        {/* 상단 정보 */}
        <div className="text-left">
          {thumbnail && (
            <img
              src={thumbnail}
              alt={sprint.name}
              className="w-10 h-10 mb-3 mt-1"
            />
          )}
          <h2 className="text-lg font-bold">{sprint.name}</h2>
          <p className="text-xs text-gray-600">{sprint.basicDescription}</p>

          {/* 태그 */}
          <div className="flex gap-2 mt-2">
            {displayedTags.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 text-[10px] bg-blue-100 text-blue-600 rounded-lg"
              >
                {category.categoryName}
              </span>
            ))}
          </div>
        </div>

        {/* 펼치기 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex flex-col items-center text-gray-800 mt-3"
        >
          <p className="text-[9px] text-gray-400">싸프린트 상세 정보 더보기</p>
          {isOpen ? (
            <FaChevronUp className="mt-0.5 text-gray-500 text-xs" />
          ) : (
            <FaChevronDown className="mt-0.5 text-gray-500 text-xs" />
          )}
        </button>
      </div>
    </div>
  )
}

export default JoinSprintInfo
