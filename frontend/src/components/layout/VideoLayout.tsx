import { cn } from '@/lib/utils'
import StreamVideoPageButton from '@/components/PresentationPage/StreamVideoPageButton/StreamVideoPageButton'
import ScreenShareView from '@/components/PresentationPage/ScreenShareView/ScreenShareView'

const VideoLayout = ({
  children,
  isScreenSharing,
  streamSize,
}: {
  children: React.ReactNode
  isScreenSharing: boolean
  streamSize: number
}) => {
  return (
    <section
      className={cn(
        'flex w-full h-full ',
        isScreenSharing ? 'flex-col-reverse' : 'flex-col'
      )}
    >
      {isScreenSharing && <ScreenShareView />}
      <div className="flex flex-col justify-center w-full h-full gap-4 overflow-hidden">
        <div
          className={cn(
            'grid mx-auto min-h-96 h-full ',

            'grid-cols-1 place-items-center', // 기본적으로 1열
            streamSize > 4
              ? 'sm:grid-cols-2 lg:grid-cols-3 w-full' // 4개 이상일 때 반응형 그리드
              : streamSize === 4
                ? 'grid-cols-2 w-9/12'
                : 'grid-cols-1 w-10/12'
          )}
        >
          {children}
        </div>
        <StreamVideoPageButton streamSize={streamSize} />
      </div>
    </section>
  )
}
export default VideoLayout
