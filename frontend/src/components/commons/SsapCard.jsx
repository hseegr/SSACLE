// @ts-nocheck
import { useGetImage } from '@/hooks/useGetImage'
import { useNavigate } from 'react-router-dom'

const SsapCard = ({ sprintData, idx }) => {
  const navigate = useNavigate()
  const imageList = useGetImage()

  const {
    sprintId,
    title,
    category,
    status,
    requiredSkills,
    currentMembers,
    maxMembers,
    startDate,
    endDate,
  } = sprintData

  const logoPath = imageList[requiredSkills[0]] || imageList.default

  // 신청하기 클릭 핸들러 (버튼을 눌렀을 때만 이동) 
  const handleApply = (e) => {
    e.stopPropagation() // 다른 클릭 이벤트 방지
    navigate(`/ssaprint/${sprintId}`) // 버튼 클릭 시 페이지 이동
  }

  return (
    <div
      className={`animate-fade-in-down bg-gradient-to-bl from-purple-300 via-purple-400 to-purple-500 h-54 w-full rounded-xl p-5 relative`}
    >
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
        <button
          className="text-purple-600 text-xs font-semibold bg-white w-20 h-7 rounded-md flex items-center justify-center hover:bg-purple-50"
          onClick={handleApply}
        >
          신청하기
        </button>
      </div>
      <div className="absolute bottom-3 right-3">
        <img src={logoPath} alt={`${category} logo`} className="w-20 h-20" />
      </div>
    </div>
  )
}

export default SsapCard
