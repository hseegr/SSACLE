import { useState } from 'react'

const PositionDropdown = ({
  selectedPositions,
  setSelectedPositions,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const positions = ['Front-end', 'Back-end', 'Mobile', 'Infra', 'DB']

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleSelect = (position) => {
    const updatedPositions = selectedPositions.includes(position)
      ? selectedPositions.filter((p) => p !== position)
      : [...selectedPositions, position]

    setSelectedPositions(updatedPositions)
    onFilterChange('position', updatedPositions) // 필터 변경 반영
  }

  return (
    <div className="relative">
      <button
        className={`border rounded px-3 py-1 flex items-center text-[12px] ${
          isOpen
            ? 'border-blue-500 text-blue-500'
            : 'border-gray-300 text-gray-900'
        }`}
        onClick={toggleDropdown}
      >
        포지션 ▾
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg p-3 flex flex-col gap-3 z-10">
          <div className="flex flex-wrap gap-2">
            {positions.map((position) => (
              <button
                key={position}
                className={`px-4 py-1 rounded-full border text-[12px] ${
                  selectedPositions.includes(position)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => handleSelect(position)}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PositionDropdown
