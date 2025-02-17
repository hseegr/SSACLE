import { useNavigate } from 'react-router-dom'

const stackLogos = {
  Angular: '/src/assets/logo/Angular.png',
  AWS: '/src/assets/logo/AWS.png',
  Azure: '/src/assets/logo/Azure.png',
  'C#': '/src/assets/logo/C#.png',
  'C++': '/src/assets/logo/C++.png',
  CSS3: '/src/assets/logo/CSS3.png',
  default: '/src/assets/logo/default.png',
  Django: '/src/assets/logo/Django.png',
  Docker: '/src/assets/logo/Docker.png',
  'Google Cloud': '/src/assets/logo/Google Cloud.png',
  HTML5: '/src/assets/logo/HTML5.png',
  Java: '/src/assets/logo/Java.png',
  JavaScript: '/src/assets/logo/JavaScript.png',
  Kubernetes: '/src/assets/logo/Kubernetes.png',
  MariaDB: '/src/assets/logo/MariaDB.png',
  MongoDB: '/src/assets/logo/MongoDB.png',
  MySQL: '/src/assets/logo/MySQL.png',
  NestJS: '/src/assets/logo/NestJS.png',
  'Node.js': '/src/assets/logo/Node.js.png',
  Oracle: '/src/assets/logo/Oracle.png',
  PostgreSQL: '/src/assets/logo/PostgreSQL.png',
  Python: '/src/assets/logo/Python.png',
  React: '/src/assets/logo/React.png',
  Redis: '/src/assets/logo/Redis.png',
  'Ruby on Rails': '/src/assets/logo/Ruby on Rails.png',
  Spring: '/src/assets/logo/Spring.png',
  Svelte: '/src/assets/logo/svelte.png',
  'Vue.js': '/src/assets/logo/Vue.js.png',
}

const SsapCard = ({ sprintData }) => {
  const navigate = useNavigate()

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

  const logoPath =
    stackLogos[requiredSkills[0]] || '/src/assets/logo/default.png'

  // 신청하기 클릭 핸들러 (버튼을 눌렀을 때만 이동)
  const handleApply = (e) => {
    e.stopPropagation() // 다른 클릭 이벤트 방지
    navigate(`/ssaprint/${sprintId}`) // 버튼 클릭 시 페이지 이동
  }

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
