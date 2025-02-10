import { useState } from 'react'

const StatusTabs = ({ domain, onFilterChange }) => {
  // TODO: 추후 domain 활용 예정
  // console.log(domain);
  const [activeTab, setActiveTab] = useState('available') // 기본값: 참여 가능

  const handleTabChange = (status) => {
    setActiveTab(status)
    onFilterChange('status', status)
  }

  return (
    <div className="flex gap-6 text-[14px] font-medium">
      <button
        className={`border-b-2 pb-1 ${
          activeTab === 'available'
            ? 'border-black text-black'
            : 'text-gray-400'
        }`}
        onClick={() => handleTabChange('available')}
      >
        참여 가능
      </button>
      <button
        className={`border-b-2 pb-1 ${
          activeTab === 'completed'
            ? 'border-black text-black'
            : 'text-gray-400'
        }`}
        onClick={() => handleTabChange('completed')}
      >
        참여 완료
      </button>
    </div>
  )
}

export default StatusTabs
