// @ts-nocheck
const SprintBanner = ({ title, description, domain }) => {
  // 도메인별 배경색 설정
  const bgColor = domain === 'ssaprint' ? 'bg-[#E6F8EF]' : 'bg-[#F0EEFF]'

  return (
    <section
      className={`${bgColor} text-gray-700 text-center py-4 rounded-lg min-h-[100px] min-w-[500px] flex flex-col justify-center`}
    >
      <h1 className="text-md font-semibold">{title}</h1>
      <p className="mt-2 text-sm">{description}</p>
    </section>
  )
}

export default SprintBanner
