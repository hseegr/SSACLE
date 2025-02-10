// import SprintOverview from "./SprintOverview";
// import SprintCurriculum from "./SprintCurriculum";
// import SprintProgress from "./SprintProgress";
// import SprintRecommendation from "./SprintRecommendation";
// import SprintBenefits from "./SprintBenefits";

const SprintDetail = ({ sprint }) => {
  if (!sprint) return null;

  return (
    <div className="p-5 border rounded-xl shadow-md flex flex-col bg-white relative min-h-[100rem] w-[52rem] flex-grow-0 flex-shrink-0 gap-2.5 h-full">
      {/* 스프린트 개요 */}
      {/* <SprintOverview overview={sprint.overview} /> */}

      {/* 커리큘럼 */}
      {/* <SprintCurriculum curriculum={sprint.curriculum} /> */}

      {/* 진행 방식 */}
      {/* <SprintProgress process={sprint.process} /> */}

      {/* 추천 대상 */}
      {/* <SprintRecommendation recommendedFor={sprint.recommended_for} /> */}

      {/* 수료 후 혜택 */}
      {/* <SprintBenefits benefits={sprint.benefits} /> */}
    </div>
  );
};

export default SprintDetail;
