const SprintSummary = ({
  recommendedFor,
  benefits,
  participation,
  recruit,
}) => {
  return (
    <div className="p-4 rounded-xl bg-gray-50 shadow-md flex flex-col gap-1 w-[18rem] shrink-0 h-full">
      {/* 추천 대상 */}
      <h3 className="text-xs font-bold">이런 분께 추천해요!</h3>
      <ul className="flex flex-col gap-1 text-xs text-gray-700 flex-grow">
        {recommendedFor.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            ✅ {item}
          </li>
        ))}
      </ul>

      {/* 수료 후 혜택 */}
      <h3 className="text-xs font-bold mt-2">수료 후 혜택</h3>
      <ul className="flex flex-col gap-1 text-xs text-gray-700 flex-grow">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center gap-2">
            {benefit}
          </li>
        ))}
      </ul>

      {/* 모집 정보 */}
      <h3 className="text-xs font-bold flex items-center gap-2 mt-2">
        📌 현재 모집 완료 : {participation}명 / {recruit}명
      </h3>
    </div>
  )
}

export default SprintSummary
