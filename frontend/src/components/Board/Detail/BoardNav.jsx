// 게시글 이전/다음 네비게이션 컴포넌트
const BoardNav = ({ prevPost, nextPost, onNavigate }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <nav
      className="border-t border-b border-gray-200 my-8"
      aria-label="게시글 이동"
    >
      {/* 이전 게시글 */}
      {prevPost ? (
        <button
          onClick={() => onNavigate(prevPost.id)}
          className="w-full flex items-center py-4 px-2 group hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center text-gray-500 group-hover:text-gray-700 w-20">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            이전글
          </div>

          <div className="flex-1 flex items-center justify-between min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-500">
              {prevPost.title}
            </h4>
            <span className="text-sm text-gray-500 ml-4">
              {formatDate(prevPost.date)}
            </span>
          </div>
        </button>
      ) : (
        // 이전 게시글이 없는 경우
        <div className="py-4 px-2 text-gray-400 flex items-center">
          <div className="w-20 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            이전글
          </div>
          <span>첫 게시글입니다.</span>
        </div>
      )}

      {/* 구분선 */}
      <div className="border-t border-gray-200"></div>

      {/* 다음 게시글 */}
      {nextPost ? (
        <button
          onClick={() => onNavigate(nextPost.id)}
          className="w-full flex items-center py-4 px-2 group hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center text-gray-500 group-hover:text-gray-700 w-20">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            다음글
          </div>

          <div className="flex-1 flex items-center justify-between min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-500">
              {nextPost.title}
            </h4>
            <span className="text-sm text-gray-500 ml-4">
              {formatDate(nextPost.date)}
            </span>
          </div>
        </button>
      ) : (
        // 다음 게시글이 없는 경우
        <div className="py-4 px-2 text-gray-400 flex items-center">
          <div className="w-20 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            다음글
          </div>
          <span>마지막 게시글입니다.</span>
        </div>
      )}
    </nav>
  )
}

export default BoardNav
