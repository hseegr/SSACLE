const SprintRecommendation = ({ recommendedFor }) => {
  // 추천 대상 목록을 쉼표로 분리하여 배열로 변환
  const recommendationList = recommendedFor
    ? recommendedFor.split(',').map((item) => item.trim())
    : []

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-sm font-semibold text-gray-800 mb-1">
        이런 분께 추천해요!
      </h2>
      <ul className="list-none space-y-1">
        {recommendationList.map((item, index) => (
          <li
            key={index}
            className="text-sm text-gray-700 flex items-start gap-2"
          >
            ✅ <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SprintRecommendation
