import { useState } from 'react'
import PositionDropdown from '@/components/SprintCommon/PositionDropdown'
import StackDropdown from '@/components/SprintCommon/StackDropdown'
import SelectedTags from '@/components/SprintCommon/SelectedTags'

const FilterBar = ({ domain, onFilterChange }) => {
  // TODO: 추후 domain 활용 예정
  // console.log(domain);
  const [selectedPositions, setSelectedPositions] = useState([])
  const [selectedStacks, setSelectedStacks] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('available')

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    onFilterChange('status', status)
  }

  return (
    <div className="flex flex-col gap-2 pb-1">
      {/* 상단 탭 (참여 가능 / 참여 완료) */}
      <div className="flex gap-6 text-[14px] font-medium">
        <button
          className={`border-b-2 ${selectedStatus === 'available' ? 'border-black' : 'border-transparent'}`}
          onClick={() => handleStatusChange('available')}
        >
          참여 가능
        </button>
        <button
          className={`border-b-2 ${selectedStatus === 'completed' ? 'border-black' : 'border-transparent'}`}
          onClick={() => handleStatusChange('completed')}
        >
          참여 완료
        </button>
      </div>

      {/* 구분선 */}
      <hr className="border-gray-200" />

      {/* 필터 드롭다운 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <PositionDropdown
            selectedPositions={selectedPositions}
            setSelectedPositions={setSelectedPositions}
            onFilterChange={(value) => onFilterChange('position', value)}
          />
          <StackDropdown
            selectedStacks={selectedStacks}
            setSelectedStacks={setSelectedStacks}
            onFilterChange={(value) => onFilterChange('stack', value)}
          />
        </div>

        {/* 검색창 */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="검색어 입력"
            className="w-full border rounded px-3 py-1 bg-white pl-3 text-[12px] font-light"
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* 선택된 태그 리스트 */}
      <SelectedTags
        selectedPositions={selectedPositions}
        setSelectedPositions={setSelectedPositions}
        selectedStacks={selectedStacks}
        setSelectedStacks={setSelectedStacks}
        onFilterChange={onFilterChange}
      />

      {/* 구분선 */}
      <hr className="border-gray-200 mt-0" />
    </div>
  )
}

export default FilterBar
