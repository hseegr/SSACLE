import { useState, useEffect } from 'react'
import {
  fetchCategories,
  fetchCompletedSsaprintList,
} from '@/services/ssaprintService'
import FilterModal from '@/components/SprintCommon/FilterModal'
import StatusTabs from '@/components/SprintCommon/StatusTabs'
import { FiFilter, FiRotateCcw } from 'react-icons/fi'

const FilterBar = ({ onFilterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [positions, setPositions] = useState([])
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [selectedStack, setSelectedStack] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(0) // 기본값: 참여 가능 (0)
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStatus === 0) {
        // 참여 가능 스프린트 → 카테고리 조회
        const categories = await fetchCategories()
        if (categories) {
          setPositions(categories)
        }
      } else {
        // 완료된 스프린트 조회
        const completedSprints = await fetchCompletedSsaprintList(0, 8)
        onFilterChange('status', 2)
        onFilterChange('completedSprints', completedSprints?.content || [])
      }
    }

    fetchData()
  }, [selectedStatus])

  const handleOpenModal = () => {
    if (selectedStatus !== 2) setIsModalOpen(true)
  }
  const handleCloseModal = () => setIsModalOpen(false)

  const handleFilterApply = (categoryId, position, stack) => {
    if (selectedStatus === 0) {
      onFilterChange('categoryId', categoryId)
      setIsFiltered(true)
    }
    setSelectedPosition(position)
    setSelectedStack(stack)
    handleCloseModal()
  }

  const handleResetFilters = () => {
    setSelectedPosition(null)
    setSelectedStack(null)
    setIsFiltered(false)
    onFilterChange('categoryId', null)
  }

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    onFilterChange('status', status)
  }

  return (
    <div className="flex flex-col gap-2 pb-1">
      <StatusTabs
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />
      <hr className="border-gray-200 min-w-[500px] w-full mx-auto" />

      {/* 필터 버튼 & 초기화 버튼 */}
      <div className="flex items-center">
        <button
          onClick={handleOpenModal}
          disabled={selectedStatus === 2} // 참여 완료일 때 비활성화
          className={`flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition min-w-[80px] h-[28px] ml-1
            ${
              selectedStatus === 2
                ? 'border border-gray-200 text-gray-400 bg-white cursor-not-allowed'
                : isFiltered
                  ? 'border border-blue-500 bg-blue-500 text-white'
                  : 'border border-blue-400 text-blue-400 bg-white'
            }`}
        >
          <FiFilter className="w-4 h-4" /> 필터
        </button>

        <button
          onClick={handleResetFilters}
          className={`text-gray-500 text-xs flex items-center justify-center gap-1 min-w-[80px] h-[28px] 
      ${isFiltered ? 'visible' : 'invisible'}`}
        >
          <FiRotateCcw className="w-4 h-3" /> 초기화
        </button>
      </div>

      {isModalOpen && selectedStatus === 0 && (
        <FilterModal
          positions={positions}
          initialPosition={selectedPosition}
          initialStack={selectedStack}
          onApply={handleFilterApply}
          onClose={handleCloseModal}
        />
      )}

      <hr className="border-gray-200 min-w-[500px] w-full mx-auto" />
    </div>
  )
}

export default FilterBar
