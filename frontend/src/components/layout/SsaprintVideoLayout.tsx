import { cn } from '@/lib/utils'
import StreamVideoPageButton from '@/components/PresentationPage/StreamVideoPageButton/StreamVideoPageButton'
import { ReactNode, useState, Children, useEffect, FC } from 'react'
import ScreenShareView from '@/components/PresentationPage/ScreenShareView/ScreenShareView'
import { useStreamStore } from '@/store/useStreamStore'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'

interface SsaprintVideoLayoutProps {
  children: ReactNode[]
  connectCount?: number | undefined
}

const SsaprintVideoLayout: FC<SsaprintVideoLayoutProps> = ({
  children,
  connectCount,
}: SsaprintVideoLayoutProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const isScreenSharing = useStreamStore((state) => state.isScreenSharing)
  const screenPublisher = useOpenviduStateStore(
    (state) => state.screenPublisher
  )
  const setIsScreenSharing = useStreamStore((state) => state.setIsScreenSharing)
  // ! 추후 Hook으로 분리
  const itemPerPage = isScreenSharing ? 3 : 6

  // 자식 요소 배열로 변환
  // 현재 페이지에 해당하는 자식 요소 슬라이싱
  const startIndex = currentPage * itemPerPage

  const slicedChildren = children.slice(startIndex, startIndex + itemPerPage)

  const totalPages = Math.ceil(children.length / itemPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  useEffect(() => {
    screenPublisher //
      ? setIsScreenSharing(true)
      : setIsScreenSharing(false)
  }, [screenPublisher])

  console.log(children)
  return (
    <section className="flex w-full h-full gap-1">
      {isScreenSharing && screenPublisher && <ScreenShareView />}
      <div
        className={cn(
          'flex flex-col justify-center w-full h-full gap-4 ',
          isScreenSharing && 'basis-1/4'
        )}
      >
        <div
          className={cn(
            'grid mx-auto min-h-96 h-full ap-4 transition-all duration-300',
            'w-full',
            'grid-cols-1',
            !isScreenSharing && connectCount && connectCount > 4
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
export default SsaprintVideoLayout
