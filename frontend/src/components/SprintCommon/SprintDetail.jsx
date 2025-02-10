import SprintOverview from './SprintOverview'
// import SprintCurriculum from "./SprintCurriculum";
import SprintProgress from './SprintProgress'
import SprintRecommendation from './SprintRecommendation'
import SprintBenefits from './SprintBenefits'

const SprintDetail = ({ sprint, benefits }) => {
  if (!sprint) return null

  return (
    <div className="p-5 border rounded-xl shadow-md flex flex-col bg-white relative min-h-[100rem] w-47rem] flex-grow-0 flex-shrink-0 gap-2.5 h-full">
      {/* 스프린트 개요 */}
      <SprintOverview
        basicDescription={sprint.basicDescription}
        detailDescription={sprint.detailDescription}
      />
      <hr className="border-t border-gray-200 my-4" />

      {/* 커리큘럼 */}
      {/* <SprintCurriculum curriculum={sprint.curriculum} /> */}

      {/* 진행 방식 */}
      <SprintProgress />

      {/* 추천 대상 */}
      <SprintRecommendation recommendedFor={sprint.recommendedFor} />

      {/* 수료 후 혜택 */}
      <SprintBenefits benefits={benefits} />
    </div>
  )
}

export default SprintDetail
