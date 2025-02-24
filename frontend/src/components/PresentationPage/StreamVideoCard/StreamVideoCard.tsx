import { cn } from '@/lib/utils'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useStreamStore } from '@/store/useStreamStore'
import {
  CircleAlertIcon,
  Monitor,
  MonitorStop,
  Share2Icon,
  ShareIcon,
} from 'lucide-react'
import { useMemo } from 'react'
import { useShallow } from 'zustand/shallow'

interface StreamVideoCardProps {
  ref: React.RefObject<HTMLVideoElement>
  username: string
  isPublisher: boolean
}

const StreamVideoCard = ({
  ref,
  username,
  isPublisher,
}: StreamVideoCardProps) => {
  const { isScreenSharing, isMicOn, isCameraOn } = useStreamStore(
    useShallow((state) => ({
      isScreenSharing: state.isScreenSharing,
      isMicOn: state.isMicOn,
      isCameraOn: state.isCameraOn,
    }))
  )
  const { screenPublisher, cameraPublisher } = useOpenviduStateStore(
    useShallow((state) => ({
      screenPublisher: state.screenPublisher,
      cameraPublisher: state.cameraPublisher,
    }))
  )

  const isSharingMe = useMemo(() => {
    return (
      screenPublisher?.stream.connection.connectionId ===
      cameraPublisher?.stream.connection.connectionId
    )
  }, [screenPublisher, cameraPublisher])

  return (
    <div
      className={cn(
        'relative w-full  shadow-md border-[1px] border-gray-600',
        'z-10 '
      )}
    >
      {/* 참여자 영상 */}
      <video
        autoPlay
        playsInline
        className="absolute inset-0 object-cover w-full h-full rounded-md"
        ref={ref ? ref : null}
      ></video>
      {/* 참여자 이름 */}
      <div
        className={cn(
          'absolute flex items-center justify-center gap-2 px-4 py-1 rounded-sm left-2 bottom-2 bg-ssacle-black/70',
          isScreenSharing &&
            isSharingMe &&
            isPublisher &&
            'left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2'
        )}
      >
        {isScreenSharing && isSharingMe && isPublisher ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-base text-white">{username}</span>
            <div className="flex items-center gap-2">
              <MonitorStop className="text-red-500 size-4" />
              <span className="w-full text-base text-white">
                내 화면 공유 중
              </span>
            </div>
          </div>
        ) : (
          <>
            <Monitor className="text-white size-4" />
            <span className="text-base text-white">{username}</span>
          </>
        )}
      </div>
    </div>
  )
}
export default StreamVideoCard
