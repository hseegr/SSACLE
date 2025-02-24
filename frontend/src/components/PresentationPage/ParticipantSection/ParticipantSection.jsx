import StreamVideoCard from '@/components/PresentationPage/StreamVideoCard/StreamVideoCard'
import { cn } from '@/lib/utils'
import { usePresentation } from '@/store/usePresentation'
import { useMemo, useState } from 'react'

const PAGE_SIZE = 4

const ParticipantSection = ({ sharingStatus }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const { stream } = usePresentation()

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      prev < stream.length / PAGE_SIZE ? prev + 1 : prev
    )
  }

  // 4개씩 보여주기
  const visitableStream = useMemo(() => {
    return stream.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  }, [currentPage, stream])

  return (
    <div
      className={cn('w-full h-full', sharingStatus ? 'basis-1/6' : 'basis-1/5')}
    >
      <div className="flex flex-col justify-around h-full">
        <section className="flex flex-col items-center justify-between flex-1 overflow-hidden">
          {visitableStream.map((item, index) => (
            <StreamVideoCard key={index} data={item} />
          ))}
        </section>
        {stream.length > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-2">
            <button
              disabled={currentPage === 0}
              onClick={handlePrevPage}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  )
}
export default ParticipantSection
