const SsaprintInfo = ({ title, topic, period, description }) => {
  return (
    <div className="bg-white p-6 flex flex-col items-center w-120 mx-auto">
      <h2 className="text-ssacle-blue text-lg font-semibold text-center mb-4">
        스프린트 기본 정보
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <span className="bg-ssacle-sky text-ssacle-black font-semibold py-2 px-4 rounded-full w-20 text-center text-sm">
            제목
          </span>
          <span className="ml-4 bg-white border-2 px-4 py-2 rounded-full flex-1 text-sm">
            {title}
          </span>
        </div>

        <div className="flex items-center">
          <span className="bg-ssacle-sky text-ssacle-black font-semibold py-2 px-4 rounded-full w-20 text-center text-sm">
            주제
          </span>
          <span className="ml-4 bg-white border-2 px-4 py-2 rounded-full flex-1 text-sm">
            {topic}
          </span>
        </div>

        <div className="flex items-center">
          <span className="bg-ssacle-sky text-ssacle-black font-semibold py-2 px-4 rounded-full w-20 text-center text-sm">
            기간
          </span>
          <span className="ml-4 bg-white border-2 px-4 py-2 rounded-full flex-1 text-sm">
            {period}
          </span>
        </div>

        <div className="flex items-center">
          <span className="bg-ssacle-sky text-ssacle-black font-semibold py-2 px-4 rounded-full w-20 text-center text-sm">
            설명
          </span>
          <span className="ml-4 bg-white border-2 px-4 py-2 rounded-full flex-1 text-sm">
            {description}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SsaprintInfo
