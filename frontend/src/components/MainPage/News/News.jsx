import { fetchAiNews } from '@/services/mainService'
import { useQuery } from '@tanstack/react-query'

const News = () => {
  // ai 뉴스
  const {
    data: aiNewsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['aiNews'],
    queryFn: fetchAiNews,
    retry: false,
  })

  console.log(aiNewsData)

  // 로딩 상태 처리
  if (isLoading) return <div>Loading...</div>

  // 에러 상태 처리
  if (isError) return <div>Error: {error.message}</div>

  // 데이터가 없는 경우
  if (!aiNewsData || !Array.isArray(aiNewsData) || aiNewsData.length === 0) {
    return <div>뉴스 데이터가 없습니다.</div>
  }

  const selectedNews = aiNewsData.slice(0, 4)

  return (
    <div>
      <div>
        <p className="text-xl font-bold text-ssacle-black mb-6">AI 기사 💻</p>
      </div>
      <div>
        {selectedNews.map((item, index) => (
          <a
            href={item.url}
            key={index} // id가 있으면 사용, 없으면 index 사용
            target="_blank"
            rel="noopener noreferrer" // 보안을 위한 속성
            className="block"
          >
            <div className="flex flex-row justify-between border-b border-gray-100">
              <p className="tracking-tight text-sm font-semibold text-ssacle-black my-4">
                {item.title}
              </p>
              <p className="text-l font-medium text-ssacle-gray my-4">
                {new Date(...item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default News
