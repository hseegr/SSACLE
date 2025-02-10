import { useState } from 'react'

const StackDropdown = ({
  selectedStacks,
  setSelectedStacks,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const stacks = ['React', 'Vue', 'Node.js', 'Spring', 'MySQL', 'Docker']

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleSelect = (stack) => {
    const updatedStacks = selectedStacks.includes(stack)
      ? selectedStacks.filter((s) => s !== stack)
      : [...selectedStacks, stack]

    setSelectedStacks(updatedStacks)
    onFilterChange('stack', updatedStacks)
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
        기술 스택 ▾
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg p-3 flex flex-wrap gap-2 z-10">
          {stacks.map((stack) => (
            <button
              key={stack}
              className={`px-4 py-1 rounded-full border text-[12px] ${
                selectedStacks.includes(stack)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => handleSelect(stack)}
            >
              {stack}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default StackDropdown
