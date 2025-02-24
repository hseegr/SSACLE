const SsaprintContent = ({ learningSchedule, goal }) => {
    return (
      <div className="bg-white p-6 flex flex-col justify-center items-center max-w-3xl w-full mx-auto border-2 border-ssacle-gray-sm text-center m-6">
        <div className="mb-4 ">
          <h3 className="text-sm font-semibold">학습 과정</h3>
          <p className="text-sm">{learningSchedule}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">추천 대상</h3>
          <p className="text-sm">{goal}</p>
        </div>
      </div>
    );
  };
  
  export default SsaprintContent;
  