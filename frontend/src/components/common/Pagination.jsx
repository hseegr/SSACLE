const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages < 1) return null // 페이지가 없으면 숨김

  const maxVisiblePages = 5 // 한 번에 보이는 페이지 개수
  const currentGroup = Math.ceil(currentPage / maxVisiblePages) // 현재 페이지 그룹
  const startPage = (currentGroup - 1) * maxVisiblePages + 1 // 그룹의 첫 번째 페이지
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages) // 그룹의 마지막 페이지

  return (
    <div className="flex justify-center items-center mt-4 mb-8 min-w-[400px]">
      {/* 처음으로 이동 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        «
      </button>

      {/* 이전 페이지 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {/* 숫자 페이지 버튼 */}
      <div className="flex justify-center items-center gap-2 min-w-[250px]">
        {[...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index
          return (
            <button
              key={pageNumber}
              className={`w-10 h-10 flex justify-center items-center rounded-lg shadow-sm ${
                currentPage === pageNumber
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border'
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      {/* 다음 페이지 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>

      {/* 마지막 페이지로 이동 */}
      <button
        className="w-10 h-10 flex justify-center items-center rounded-lg bg-white border shadow-sm disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        »
      </button>
    </div>
  )
}

export default Pagination
