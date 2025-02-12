interface StreamVideoPageButtonProps {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}

const StreamVideoPageButton = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: StreamVideoPageButtonProps) => {
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  // 페이지 표시가 필요한 경우에만 버튼을 렌더링
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 ">
      <button
        disabled={currentPage === 0}
        onClick={handlePrevPage}
        className="text-sm font-medium text-gray-700 disabled:opacity-0 disabled:cursor-not-allowed"
        aria-label="이전 페이지"
      >
        이전
      </button>
      <span className="text-sm text-gray-700">
        {currentPage + 1} / {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={handleNextPage}
        className="text-sm font-medium text-gray-700 disabled:opacity-0 disabled:cursor-not-allowed"
        aria-label="다음 페이지"
      >
        다음
      </button>
    </div>
  )
}

export default StreamVideoPageButton
