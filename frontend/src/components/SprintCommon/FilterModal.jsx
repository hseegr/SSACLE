import { useState } from 'react'
import { FiX } from 'react-icons/fi'

const FilterModal = ({
  positions,
  initialPosition,
  initialStack,
  onApply,
  onClose,
}) => {
  const [step, setStep] = useState(initialPosition ? 2 : 1) // 이전 선택 유지
  const [selectedPosition, setSelectedPosition] = useState(
    initialPosition || null
  )
  const [selectedStack, setSelectedStack] = useState(initialStack || null)
  const [searchByPosition, setSearchByPosition] = useState(
    !initialStack && initialPosition
  ) // 포지션 검색 선택 유지

  const handlePositionSelect = (position) => {
    setSelectedPosition(position)
    setSearchByPosition(false)
    setStep(2) // 포지션 선택 시 자동으로 2단계로 이동
  }

  const handleStackSelect = (stack) => {
    setSelectedStack(stack)
    setSearchByPosition(false)
  }

  const handleApply = () => {
    const categoryId = searchByPosition
      ? selectedPosition.id
      : selectedStack?.id
    onApply(categoryId, selectedPosition, selectedStack)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] h-[350px] relative">
        {' '}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">필터 설정</h2>
          <button onClick={onClose}>
            <FiX size={20} className="text-gray-600" />
          </button>
        </div>
        {step === 1 ? (
          // 1단계: 포지션 선택
          <>
            <h3 className="text-sm font-medium mb-2">포지션 선택</h3>
            <div className="flex flex-wrap gap-2">
              {positions.map((position) => (
                <button
                  key={position.id}
                  onClick={() => handlePositionSelect(position)}
                  className={`px-4 py-1 rounded border transition ${
                    selectedPosition?.id === position.id
                      ? 'bg-[#5195F7] text-white' // 선택된 상태
                      : 'bg-gray-200 hover:bg-[#e3f2fd] hover:border-[#5195F7] hover:text-[#5195F7]' // 기본 + hover 효과
                  }`}
                >
                  {position.categoryName}
                </button>
              ))}
            </div>
          </>
        ) : (
          // 2단계: 기술 스택 선택
          <>
            <h3 className="text-sm font-medium mb-2">기술 스택 선택</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPosition?.subCategories.map((stack) => (
                <button
                  key={stack.id}
                  onClick={() => handleStackSelect(stack)}
                  className={`px-4 py-1 rounded border transition ${
                    selectedStack?.id === stack.id
                      ? 'bg-[#5195F7] text-white' // 선택된 상태
                      : 'bg-gray-200 hover:bg-[#e3f2fd] hover:border-[#5195F7] hover:text-[#5195F7]' // 기본 + hover 효과
                  }`}
                >
                  {stack.categoryName}
                </button>
              ))}
            </div>

            {/* 포지션으로만 검색 */}
            <div className="mt-3 flex">
              <button
                onClick={() => {
                  setSelectedStack(null)
                  setSearchByPosition(true)
                }}
                className={`text-sm transition ${
                  searchByPosition
                    ? 'text-[#5195F7] font-semibold underline' // 선택된 경우
                    : 'text-gray-500 hover:text-[#5195F7] hover:underline' // 기본 + hover 효과
                }`}
              >
                포지션으로만 검색
              </button>
            </div>
          </>
        )}
        {/* 버튼 영역 (하단 고정) */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-between px-6">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="px-4 py-1 text-sm bg-gray-200 rounded"
            >
              이전
            </button>
          )}
          {step === 2 && (
            <button
              onClick={handleApply}
              disabled={!selectedStack && !searchByPosition}
              className={`px-4 py-1 text-sm rounded ${
                selectedStack || searchByPosition
                  ? 'bg-[#5195F7] text-white'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              확인
            </button>
          )}
        </div>
        {/* 단계 표시 (하단 중앙 고정) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div
            className={`w-3 h-3 mx-1 rounded-full ${step === 1 ? 'bg-[#5195F7]' : 'bg-gray-300'}`}
          />
          <div
            className={`w-3 h-3 mx-1 rounded-full ${step === 2 ? 'bg-[#5195F7]' : 'bg-gray-300'}`}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterModal
