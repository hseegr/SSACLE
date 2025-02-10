const SelectedTags = ({
  selectedPositions,
  setSelectedPositions,
  selectedStacks,
  setSelectedStacks,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-wrap items-center px-2 py-0 rounded-md">
      {selectedPositions.map((position) => (
        <span
          key={position}
          className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px]"
        >
          {position}
          <button
            onClick={() => {
              const updated = selectedPositions.filter((p) => p !== position)
              setSelectedPositions(updated)
              onFilterChange('position', updated)
            }}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  )
}

export default SelectedTags
