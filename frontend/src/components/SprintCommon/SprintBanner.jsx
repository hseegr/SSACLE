const SprintBanner = ({ title, description, domain }) => {
  // 도메인별 배경색 설정
  const bgColor = domain === 'ssaprint' ? 'bg-[#F0F7F3]' : 'bg-[#F1F0F7]'

  return (
    <section
      className={`${bgColor} text-gray-700 text-center py-4 rounded-lg min-h-[70px] min-w-[500px] flex flex-col justify-center`}
    >
      <h1 className="text-base font-semibold">{title}</h1>
      <p className="text-sm">{description}</p>
    </section>
  )
}

export default SprintBanner
