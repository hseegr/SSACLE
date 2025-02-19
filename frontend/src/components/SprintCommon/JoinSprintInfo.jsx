// @ts-nocheck
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useGetImage } from '@/hooks/useGetImage'

const JoinSprintInfo = ({ sprintData, isOpen, setIsOpen }) => {
  if (!sprintData || !sprintData.sprint) return null

  const imageList = useGetImage()
  const { sprint, categories } = sprintData

  // 카테고리명 목록 (최대 2개까지만)
  const categoryNames = categories
    .map((category) => category.categoryName)
    .slice(0, 2) // 최대 2개까지만 선택

  // 썸네일 선택 로직
  const categoryWithImage = categories.find((category) => category.image)
  const stackImage =
    imageList[categoryNames[0]] || imageList[categoryNames[1]]

  const thumbnail = categoryWithImage?.image || stackImage || stackLogos.default

  // 태그 최대 2개만 표시
  const displayedTags = categories.slice(0, 2)

  return (
    <div className="p-4 bg-white shadow-md rounded-xl transition-all min-w-[42rem] min-h-[14rem]">
      {/* 접었을 때 UI */}
      <div className="w-full flex flex-col text-gray-800">
        {/* 상단 정보 */}
        <div className="text-left">
          {thumbnail && (
            <img src={thumbnail} alt={sprint.name} className="w-14 h-14" />
          )}
          <h2 className="text-lg font-bold">{sprint.name}</h2>
          <p className="text-sm text-gray-600">{sprint.basicDescription}</p>

          {/* 태그 */}
          <div className="flex gap-2 mt-6">
            {displayedTags.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg"
              >
                {category.categoryName}
              </span>
            ))}
          </div>
        </div>

        {/* 펼치기 버튼 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex flex-col items-center text-gray-800 mt-5"
        >
          <p className="text-xs text-gray-400">싸프린트 상세 정보 더보기</p>
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
