import { cn } from '@/lib/utils'
import { Monitor } from 'lucide-react'

interface StreamVideoCardProps {
  ref: React.RefObject<HTMLVideoElement>
}

const StreamVideoCard = ({ ref }: StreamVideoCardProps) => {
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
      <div className="absolute flex items-center justify-center gap-2 px-4 py-1 rounded-sm left-2 bottom-2 bg-ssacle-black/70">
        <Monitor className="text-white size-4" />
        <span className="text-base text-white">{'test'}</span>
      </div>
    </div>
  )
}
export default StreamVideoCard
