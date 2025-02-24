// @ts-nocheck
import SprintOverview from './SprintOverview'
import SprintProgress from './SprintProgress'
import SprintCurriculum from './SprintCurriculum'
import SprintRecommendation from './SprintRecommendation'
import SprintBenefits from './SprintBenefits'

const SprintDetail = ({ sprint, benefits, todos }) => {
  if (!sprint) return null

  return (
    <div className="p-5 border rounded-xl shadow-md flex flex-col bg-white relative h-auto min-w-[42rem] flex-grow-0 flex-shrink-0 gap-2.5 h-full mb-10">
      {/* 스프린트 개요 */}
      <SprintOverview
        basicDescription={sprint.basicDescription}
        detailDescription={sprint.detailDescription}
      />
      <hr className="border-t border-gray-200 my-4 mb-8" />

      {/* 커리큘럼 */}
      <div className="mb-8">
        <SprintCurriculum todos={todos} />
      </div>

      {/* 진행 방식 */}
      <div className="mb-8">
        <SprintProgress />
      </div>

      {/* 추천 대상 */}
      <div className="mb-8">
        <SprintRecommendation recommendedFor={sprint.recommendedFor} />
      </div>

      {/* 수료 후 혜택 */}
      <div className="mb-8">
        <SprintBenefits benefits={benefits} />
      </div>
    </div>
  )
}

export default SprintDetail
