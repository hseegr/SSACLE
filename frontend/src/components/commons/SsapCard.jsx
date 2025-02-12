const stackLogos = {
  React: '/src/mocks/React.png',
  Python: '/src/mocks/Python.png',
}

const SsapCard = ({ sprintData }) => {
  const {
    title,
    category,
    status,
    requiredSkills,
    currentMembers,
    maxMembers,
    startDate,
    endDate,
  } = sprintData

  const logoPath = stackLogos[requiredSkills[0]] || '/src/mocks/default.png'

  return (
    <div className="bg-gradient-to-bl from-purple-400 via-purple-500 to-purple-600 h-54 w-full rounded-xl p-5 relative">
      <div className="text-white">
        <p className="text-2xl font-bold mb-3">{requiredSkills[0]}</p>
        <p className="text-sm font-semibold mb-3">{title}</p>
        <p className="text-xs font-medium">시작일 {startDate}</p>
        <p className="text-xs font-medium">종료일 {endDate}</p>
        <p className="text-xs font-medium mb-3">
          {status}{' '}
          <span>
            {currentMembers} / {maxMembers}
          </span>
        </p>
        <p className="text-purple-600 text-xs font-semibold bg-white w-20 h-7 rounded-md flex items-center justify-center">
          신청하기
        </p>
      </div>
      <div className="absolute bottom-3 right-3">
        <img src={logoPath} alt={`${category} logo`} className="w-20 h-20" />
      </div>
    </div>
  )
}

export default SsapCard
