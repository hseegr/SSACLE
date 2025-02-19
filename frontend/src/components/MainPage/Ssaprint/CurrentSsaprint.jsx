import SsapCard from '@/components/commons/SsapCard'

const CurruntSsaprint = ({ userData, recommendedSprints }) => {
  const { name } = userData
  const sliceRecommended = recommendedSprints.slice(0, 10)
  return (
    <div>
      <div>
        <p className="tracking-tighter text-xl font-semibold text-ssacle-black mb-9">
          <span className="font-bold">{userData.nickname}</span>님에게 딱 맞는{' '}
          <span className="font-bold text-ssacle-blue">싸프린트</span> 여기
          있어요! 💡
        </p>
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {sliceRecommended.map((sprint, idx) => (
            <SsapCard
              key={`sprint-${sprint.id}`}
              idx={idx}
              sprintData={sprint}
            />
          ))}
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default CurruntSsaprint
