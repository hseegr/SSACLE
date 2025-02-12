import { cn } from '@/lib/utils'
import StreamVideoPageButton from '@/components/PresentationPage/StreamVideoPageButton/StreamVideoPageButton'
import { ReactNode, useMemo, useState, Children } from 'react'
import ScreenShareView from '@/components/PresentationPage/ScreenShareView/ScreenShareView'

interface VideoLayoutProps {
  children: ReactNode
  isScreenSharing: boolean
  connectCount: number
}

const VideoLayout = ({
  children,
  isScreenSharing,
  connectCount,
}: VideoLayoutProps) => {
  const [currentPage, setCurrentPage] = useState(0)

  const itemPerPage = isScreenSharing ? 3 : 6

  // 자식 요소 배열로 변환
  const chilrendArray = Children.toArray(children) || []
  // 현재 페이지에 해당하는 자식 요소 슬라이싱
  const startIndex = currentPage * itemPerPage

  const slicedChildren = chilrendArray.slice(
    startIndex,
    startIndex + itemPerPage
  )

  console.log('chilrendArray', chilrendArray)
  console.log('slicedChildren', slicedChildren)
  console.log('connectCount', connectCount)

  const totalPages = Math.ceil(chilrendArray.length / itemPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <section className="flex w-full h-full">
      {isScreenSharing && <ScreenShareView />}
      <div
        className={cn(
          'flex flex-col justify-center w-full h-full gap-4 ',
          isScreenSharing && 'basis-1/4'
        )}
      >
        <div
          className={cn(
            'grid mx-auto min-h-96 h-full ap-4',
            'w-full',
            'grid-cols-1',
            !isScreenSharing && connectCount > 4
              ? 'sm:grid-cols-2 md:grid-cols-3 grid-rows-2'
              : !isScreenSharing && connectCount === 1
                ? 'grid-cols-1 w-11/12 '
                : isScreenSharing
                  ? 'grid-cols-1 grid-rows-3'
                  : 'grid-cols-2 w-10/12 '
          )}
        >
          {slicedChildren}
        </div>
        <StreamVideoPageButton
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </section>
  )
}
export default VideoLayout
