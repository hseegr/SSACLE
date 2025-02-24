// @ts-nocheck
const SprintSummary = ({
  recommendedFor = '',
  benefits = [],
  participation = 0,
  recruit = 0,
}) => {
  const formattedRecommendedFor = recommendedFor
    ? recommendedFor.split(', ').map((item) => item.trim()) // 불필요한 공백 제거
    : []

  return (
    <div className="p-3 rounded-lg bg-gray-50 shadow-md flex flex-col gap-1 min-w-[20rem] max-h-[20rem] shrink-0 h-full">
      {/* 추천 대상 */}
      <h3 className="text-[14px] mt-2 font-bold">이런 분께 추천해요!</h3>
      <ul className="flex flex-col gap-1 text-[12px] text-gray-700 flex-grow">
        {formattedRecommendedFor.length > 0 ? (
          formattedRecommendedFor.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              ✅ {item}
            </li>
          ))
        ) : (
          <li className="text-gray-500">추천 대상 정보 없음</li>
        )}
      </ul>

      {/* 수료 후 혜택 */}
      <h3 className="text-[14px] font-bold mt-2">수료 후 혜택</h3>
      <ul className="flex flex-col gap-1 text-[11px] text-gray-700 flex-grow">
        {benefits.length > 0 ? (
          benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-1">
              {benefit}
            </li>
          ))
        ) : (
          <li className="text-gray-500">혜택 정보 없음</li>
        )}
      </ul>

      {/* 모집 정보 */}
      <h3 className="text-[14px] font-bold flex items-center gap-1 mt-2 mb-3">
        📌 현재 모집 완료 : {participation}명 / {recruit}명
      </h3>
    </div>
  )
}

export default SprintSummary
