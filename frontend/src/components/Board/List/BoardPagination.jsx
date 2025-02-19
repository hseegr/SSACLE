const BoardPagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const totalPagesSafe = Math.max(totalPages, 1) // 최소 1페이지는 보장

  // 페이지가 1페이지뿐이면 페이지네이션을 표시하지 않음
  if (totalPagesSafe === 1) {
    return null
  }

  // 이전/다음 페이지 이동 핸들러
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPagesSafe) {
      setCurrentPage(currentPage + 1)
    }
  }

  // 처음/마지막 페이지 이동 핸들러
  const handleFirstPage = () => {
    setCurrentPage(1)
  }

  const handleLastPage = () => {
    setCurrentPage(totalPagesSafe)
  }

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const delta = 2 // 현재 페이지 기준으로 양쪽에 보여줄 페이지 수
    const range = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPagesSafe - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    // 시작과 끝 처리
    if (currentPage - delta > 2) {
      range.unshift('...')
    }
    if (currentPage + delta < totalPagesSafe - 1) {
      range.push('...')
    }

    // 첫 페이지와 마지막 페이지 추가
    range.unshift(1)
    if (totalPagesSafe > 1) {
      range.push(totalPagesSafe)
    }

    return range
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-4 mb-8">
      {/* 처음으로 이동 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        onClick={handleFirstPage}
        disabled={currentPage === 1}
      >
        «
      </button>

      {/* 이전 페이지 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((pageNum, index) => (
        <button
          key={index}
          className={`w-10 h-10 flex justify-center items-center rounded-lg shadow-sm ${
            pageNum === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-white border hover:bg-gray-50'
          } ${pageNum === '...' ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => pageNum !== '...' && setCurrentPage(pageNum)}
          disabled={pageNum === '...'}
        >
          {pageNum}
        </button>
      ))}

      {/* 다음 페이지 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        onClick={handleNextPage}
        disabled={currentPage === totalPagesSafe}
      >
        ›
      </button>

      {/* 마지막 페이지로 이동 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        onClick={handleLastPage}
        disabled={currentPage === totalPagesSafe}
      >
        »
      </button>
    </div>
  )
}

export default BoardPagination
