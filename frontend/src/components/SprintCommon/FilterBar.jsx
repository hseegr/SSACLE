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
      <hr className="border-gray-200" />
      <div className="flex gap-2 items-center">
        <button
          onClick={handleOpenModal}
          disabled={selectedStatus === 2} // 참여 완료일 때 비활성화
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition ${
            selectedStatus === 2
              ? 'border border-gray-200 text-gray-200 bg-white cursor-not-allowed'
              : isFiltered
                ? 'border border-blue-500 bg-blue-500 text-white'
                : 'border border-blue-400 text-blue-400 bg-white'
          }`}
        >
          <FiFilter size={14} /> 필터
        </button>
        {isFiltered && selectedStatus === 0 && (
          <button
            onClick={handleResetFilters}
            className="text-gray-500 text-xs flex items-center gap-1"
          >
            <FiRotateCcw size={14} /> 초기화
          </button>
        )}
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
      <hr className="border-gray-200" />
    </div>
  )
}

export default FilterBar
