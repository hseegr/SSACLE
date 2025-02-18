// @ts-nocheck
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

const SprintBasicInfo = ({ sprint, categories }) => {
  if (!sprint) {
    return <p className="text-gray-500">데이터를 불러오는 중...</p>
  }

  // 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  // 모집 상태 결정
  const getRecruitStatus = (participation, recruit) => {
    if (participation === recruit) {
      return {
        label: '모집 마감',
        bgColor: 'bg-gray-300 text-gray-800',
        emoji: '🔒',
      }
    } else if (participation === recruit - 1) {
      return {
        label: '마감 임박',
        bgColor: 'bg-red-100 text-red-800',
        emoji: '🔥',
      }
    } else {
      return {
        label: '모집 중',
        bgColor: 'bg-blue-100 text-blue-800',
        emoji: '👥',
      }
    }
  }

  // 진행 기간 계산
  const durationDays = Math.ceil(
    (new Date(sprint.endAt).getTime() - new Date(sprint.startAt).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  // 모집 상태 가져오기
  const recruitStatus = getRecruitStatus(
    sprint.currentMembers,
    sprint.maxMembers
  )

  // 카테고리명 목록 (최대 2개까지만)
  const categoryNames = categories
    .map((category) => category.categoryName)
    .slice(0, 2) // 최대 2개까지만 선택

  // 썸네일 선택 로직
  const categoryWithImage = categories.find((category) => category.image)
  const stackImage =
    stackLogos[categoryNames[0]] || stackLogos[categoryNames[1]]

  const thumbnail = categoryWithImage?.image || stackImage || stackLogos.default

  return (
    <div className="relative p-5 border rounded-xl shadow-md flex flex-col bg-white min-h-[10rem] min-w-[42rem] flex-grow-0 flex-shrink-0 gap-2.5 h-full">
      {/* 스프린트 제목 및 설명 */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-lg font-bold mt-2">
          {sprint.name || '스프린트 이름 없음'}
        </h3>
        <p className="text-sm text-gray-600 mb-5">
          {sprint.basicDescription || '설명 없음'}
        </p>
      </div>

      {/* 진행 기간 및 모집 정보 */}
      <div className="flex flex-col gap-1">
        {/* 진행 기간 */}
        <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mt-1">
          📅 <span className="font-semibold">진행 기간</span>
          <span>
            {formatDate(sprint.startAt)} ~ {formatDate(sprint.endAt)}
          </span>
          <span className="min-w-16 px-2 py-0.5 rounded-md text-xs font-semibold bg-green-100 text-green-800 text-center">
            {durationDays}일
          </span>
        </div>

        {/* 모집 정보 */}
        <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mt-1">
          {recruitStatus.emoji} <span className="font-semibold">모집 인원</span>
          <span>
            {sprint.currentMembers ?? '0'}명 / {sprint.maxMembers ?? '0'}명
          </span>
          <span
            className={`min-w-16 px-2 py-0.5 rounded-md text-xs font-semibold ${recruitStatus.bgColor} text-center`}
          >
            {recruitStatus.label}
          </span>
        </div>
      </div>

      {/* 태그 표시 (categories 적용) */}
      <div className="flex flex-wrap gap-1.5 mt-9">
        {categoryNames.map((category, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg"
          >
            {category}
          </span>
        ))}
      </div>

      {/* 썸네일 이미지 */}
      {thumbnail && (
        <img
          src={thumbnail}
          alt="Sprint Thumbnail"
          className="absolute bottom-8 right-6 w-14 h-14 opacity-90"
        />
      )}
    </div>
  )
}

export default SprintBasicInfo
