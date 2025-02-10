import { useState } from 'react'

const StreamVideoPageButton = ({ streamSize }) => {
  const PAGE_SIZE = 6
  const [currentPage, setCurrentPage] = useState(0)

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      prev < streamSize.length / PAGE_SIZE ? prev + 1 : prev
    )
  }
  return (
    streamSize > PAGE_SIZE && (
      <div className="flex items-center justify-center gap-2 ">
        <button
          disabled={currentPage === 0}
          onClick={handlePrevPage}
          className="disabled:opacity-0 disabled:cursor-not-allowed"
          aria-label="이전 페이지"
        >
          이전
        </button>
        <button
          disabled={currentPage === Math.floor(streamSize / PAGE_SIZE)}
          onClick={handleNextPage}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="다음 페이지"
        >
          다음
        </button>
      </div>
    )
  )
}
export default StreamVideoPageButton
