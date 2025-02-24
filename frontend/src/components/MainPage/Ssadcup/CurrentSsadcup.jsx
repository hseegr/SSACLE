import SsadCard from '@/components/commons/SsadCard'

const CurruntSsadcup = ({ userData, recommendedSprints }) => {
  const { name } = userData
  return (
    <div>
      <div>
        <p className="tracking-tighter text-xl font-semibold text-ssacle-black mb-9">
          <span className="font-bold">{name}</span>님에게 딱 맞는{' '}
          <span className="font-bold text-ssacle-blue">싸드컵</span> 여기
          있어요! 🏆
        </p>
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {recommendedSprints.map((sprint) => (
            <SsadCard key={sprint.sprintId} sprintData={sprint} />
          ))}
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default CurruntSsadcup
