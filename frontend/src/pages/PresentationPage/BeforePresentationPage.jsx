import StreamVideoCard from '@/components/PresentationPage/StreamVideoCard/StreamVideoCard'
import { cn } from '@/lib/utils'
import { usePresentation } from '@/store/usePresentation'
import { useMemo, useState } from 'react'

const BeforePresentationPage = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const { stream } = usePresentation()

  console.log(stream.length)

  const PAGE_SIZE = 6

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      prev < stream.length / PAGE_SIZE ? prev + 1 : prev
    )
  }

  const visitableStream = useMemo(() => {
    return stream.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  }, [currentPage, stream])

  return (
    <section className="flex flex-col justify-center w-full h-full gap-4">
      <div
        className={cn(
          'grid mx-auto min-h-96',
          'grid-cols-1 place-items-center', // 기본적으로 1열
          stream.length > 4
            ? 'sm:grid-cols-2 lg:grid-cols-3 w-full' // 4개 이상일 때 반응형 그리드
            : stream.length === 4
              ? 'grid-cols-2 w-9/12'
              : 'grid-cols-1 w-11/12'
        )}
      >
        {visitableStream.map(
          (
            /** @type {any} */ item,
            /** @type {import("react").Key} */ index
          ) => (
            <div key={index} className="w-full">
              <StreamVideoCard data={item} />
            </div>
          )
        )}
      </div>
      {stream.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 0}
            onClick={handlePrevPage}
            className="disabled:opacity-0 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <button
            disabled={currentPage === Math.floor(stream.length / PAGE_SIZE)}
            onClick={handleNextPage}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </section>
  )
}
export default BeforePresentationPage
