import { fetchAiNews } from '@/services/mainService'
import { useQuery } from '@tanstack/react-query'

const News = ({ news }) => {
  // 데이터가 없는 경우
  if (!news || !Array.isArray(news) || news.length === 0) {
    return <div>뉴스 데이터가 없습니다.</div>
  }

  const selectedNews = news.slice(0, 4)

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
                {item.createdAt}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default News
