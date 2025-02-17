const StatusTabs = ({ selectedStatus, onStatusChange }) => {
  return (
    <div className="flex gap-1 text-sm font-medium">
      <button
        className={`relative pb-1 min-w-[80px] ml-1 ${selectedStatus === 0 ? 'text-black' : 'text-gray-400'}`}
        onClick={() => onStatusChange(0)}
      >
        참여 가능
        {selectedStatus === 0 && (
          <div className="absolute left-0 bottom-0 w-full h-[2px] bg-black"></div>
        )}
      </button>
      <button
        className={`relative pb-1 min-w-[80px] ${selectedStatus === 2 ? 'text-black' : 'text-gray-400'}`}
        onClick={() => onStatusChange(2)}
      >
        참여 완료
        {selectedStatus === 2 && (
          <div className="absolute left-0 bottom-0 w-full h-[2px] bg-black"></div>
        )}
      </button>
    </div>
  )
}

export default StatusTabs
