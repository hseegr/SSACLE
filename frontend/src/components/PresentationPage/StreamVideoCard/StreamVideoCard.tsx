import { cn } from '@/lib/utils'

const StreamVideoCard = ({ ref, streamData = {} }) => {
  // const { stream, name } = data

  console.log('🔹 ref', ref?.current)
  return (
    <div
      className={cn(
        'relative w-full  shadow-md border-[1px] border-gray-600',
        'aspect-video z-10 '
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
      <div className="absolute bottom-0 flex items-center justify-center w-1/4 bg-white rounded-sm opacity-30">
        <span className="text-sm text-ssacle-black">{'test'}</span>
      </div>
    </div>
  )
}
export default StreamVideoCard
