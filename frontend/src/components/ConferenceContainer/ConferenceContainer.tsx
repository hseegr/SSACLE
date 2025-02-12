import VideoLayout from '@/components/layout/VideoLayout'
import StreamVideoCard from '@/components/PresentationPage/StreamVideoCard/StreamVideoCard'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useConnect } from '@/hooks/useConnect'
import { useEffect, useMemo } from 'react'

interface ConferenceContainerProps {
  token: string
}
const ConferenceContainer = ({ token }: ConferenceContainerProps) => {
  const { cameraPublisher, subscribers } = useOpenviduStateStore()

  const { initializeSession, joinSession, leaveSession } = useConnect()

  // 처음 컴포넌트가 마운트 될 때 세션 초기화 및 참여
  useEffect(() => {
    const initialize = async () => {
      if (token) {
        await initializeSession() //
          .then((session) => {
            joinSession(session, token)
          })
      }
    }
    initialize()
    return () => leaveSession()
  }, [])

  const sessionConnection = useMemo<Number>(() => {
    return subscribers.length + (cameraPublisher ? 1 : 0)
  }, [subscribers, cameraPublisher])

  return (
    <div className="w-full h-full">
      <VideoLayout
        connectCount={sessionConnection} // 컨퍼런스 참여자 수
      >
        {/* 발행자 영상 */}
        {cameraPublisher && (
          <>
            <StreamVideoCard
              ref={(el: HTMLVideoElement) =>
                el && cameraPublisher.addVideoElement(el)
              }
            />
          </>
        )}
        {/* 참여자 영상 */}
        {subscribers &&
          subscribers.map((sub, index) => (
            <StreamVideoCard
              key={index}
              ref={(el: HTMLVideoElement) => el && sub.addVideoElement(el)}
            />
          ))}
      </VideoLayout>
    </div>
  )
}

export default ConferenceContainer
