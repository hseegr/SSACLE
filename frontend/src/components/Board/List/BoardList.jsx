import { Link } from 'react-router-dom'

const BoardList = ({ posts, boardType, type, onPostClick }) => {
  // 게시글 없을 경우 글 작성 유도 문구 뜨도록
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 text-lg">아직 작성된 글이 없습니다.</p>
        <p className="text-gray-400 mt-2">첫 번째 글의 작성자가 되어보세요!</p>
      </div>
    )
  }
  // 게시판 유형 `boardType` 추가
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => onPostClick(post.id)}
          className="flex items-center justify-between p-4 border border-ssacle-gray rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center space-x-4">
            {post.subCategory === 'legend' && (
              <span className="text-yellow-500" title="명예의 전당">
                🏆
              </span>
            )}
            {post.subCategory === 'qna' && (
              <span className="text-blue-500 font-bold" title="질문">
                Q
              </span>
            )}

            <div>
              {/* 게시판 유형(boardType)을 포함하여 동적으로 이동 */}

              <h3 className="text-ssacle-black text-lg font-medium group-hover:text-blue-500 transition-colors">
                {post.title}
              </h3>

              <div className="flex space-x-4 text-sm text-gray-500">
                <span>{post.writerInfo}</span>
                <span>{post.time.split('T')[0]}</span>
                {/* <span>조회수 {post.views}</span> */}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-2 py-1 text-sm bg-gray-100 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default BoardList
