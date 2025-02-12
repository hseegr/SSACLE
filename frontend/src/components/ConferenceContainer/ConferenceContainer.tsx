import { OpenVidu, Publisher, Session, Subscriber } from 'openvidu-browser'
import { useCallback, useEffect, useRef } from 'react'
import VideoLayout from '@/components/layout/VideoLayout'
import StreamVideoCard from '@/components/PresentationPage/StreamVideoCard/StreamVideoCard'
import { useConferenceEvents } from '@/hooks/useConferenceEvents'
import { useStreamStore } from '@/store/useStreamStore'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useConnect } from '@/hooks/useConnect'

interface ConferenceContainerProps {
  token: string
}

const ConferenceContainer = ({ token }: ConferenceContainerProps) => {
  const { publisher, subscribers } = useOpenviduStateStore()
  const { isScreenSharing } = useStreamStore()

  const { initializeSession, joinSession, leaveSession } = useConnect()

  const { connections } = useConferenceEvents()

  useEffect(() => {
    const join = async () => {
      if (token) {
        await initializeSession() ///
          .then((session) => {
            joinSession(session, token)
          })
      }
    }
    join()
    return () => leaveSession()
  }, [token])

  return (
    <div className="w-full h-full">
      <VideoLayout
        connectCount={subscribers.length + (publisher ? 1 : 0)} // 컨퍼런스 참여자 수
        // connectCount={12} // 컨퍼런스 참여자 수
        isScreenSharing={isScreenSharing}
      >
        {/* 발행자 영상 */}
        {publisher && (
          <>
            <StreamVideoCard
              ref={(el: HTMLVideoElement) =>
                el && publisher.addVideoElement(el)
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
