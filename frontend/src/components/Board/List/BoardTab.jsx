const BoardTab = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`transition-colors
            ${
              activeTab === tab.id
                ? ' text-ssacle-blue font-bold text-xl ' // 활성 탭 스타일
                : ' text-gray-300 text-base' // 비활성 탭 스타일
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default BoardTab
