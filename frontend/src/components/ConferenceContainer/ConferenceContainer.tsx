import {
  OpenVidu,
  Publisher,
  Session,
  Subscriber,
  Connection,
} from 'openvidu-browser'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import VideoLayout from '@/components/layout/VideoLayout'
import StreamVideoCard from '@/components/PresentationPage/StreamVideoCard/StreamVideoCard'
import { useConferenceEvents } from '@/hooks/useConferenceEvents'
import { useOpenViduStore } from '@/store/useOpenViduStore'

const ConferenceContainer = ({
  sessionId,
  token,
}: {
  sessionId: string
  token: string
}) => {
  const [session, setSession] = useState<Session | null>(null)
  const [publisher, setPublisher] = useState<Publisher | null>(null)
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const {
    setPublisher: setOpenViduPublisher,
    isMicOn: openViduIsMicOn,
    isCameraOn: openViduIsCameraOn,
  } = useOpenViduStore()

  const publisherRef = useRef<HTMLVideoElement | null>(null)
  const subscribersRefs = useRef<HTMLVideoElement[]>([])

  const {
    subscribers,
    connections,
    handleStreamDestroyed,
    handleConnectionCreated,
    handleConnectionDestroyed,
    setSubscribers,
  } = useConferenceEvents() // 컨퍼런스 이벤트 훅

  // ✅ 스트림 생성 핸들러
  const handleStreamCreated = useCallback(
    (event) => {
      const subscriber = session?.subscribe(event.stream, undefined)
      if (subscriber) {
        setSubscribers((prev) => [...prev, subscriber])
      }
    },
    [session, setSubscribers]
  )

  // 비디오 스트림 업데이트
  const updateSubscriberVideos = async () => {
    subscribers.forEach((subscriber) => {
      const videoElement = subscribersRefs.current[subscriber.stream.streamId]
      if (videoElement) {
        videoElement.srcObject = subscriber.stream.getMediaStream()
      }
    })
  }

  const leaveSession = () => {
    if (session) {
      session.disconnect()
      setSession(null)
      setPublisher(null)
    }
  }

  const publisherInitialize = async (OV: OpenVidu, newSession: Session) => {
    try {
      const newPublisher = await OV.initPublisher(undefined, {
        videoSource: undefined,
        audioSource: undefined,
        publishAudio: openViduIsMicOn,
        publishVideo: openViduIsCameraOn,
        resolution: '640x640',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      })

      setOpenViduPublisher(newPublisher)
      await newSession.publish(newPublisher)

      setPublisher(newPublisher)
      setSession(newSession)

      if (publisherRef.current) {
        publisherRef.current.srcObject = newPublisher.stream.getMediaStream()
      }
      return newPublisher
    } catch (error) {
      console.error('Publisher 초기화 실패:', error)
      throw error
    }
  }

  useEffect(() => {
    const joinSession = async () => {
      try {
        const openvidu = new OpenVidu()
        const newSession = openvidu.initSession()

        newSession.on('streamCreated', handleStreamCreated)
        newSession.on('streamDestroyed', handleStreamDestroyed)
        newSession.on('connectionCreated', handleConnectionCreated)
        newSession.on('connectionDestroyed', handleConnectionDestroyed)

        console.log('🔹 newSession', newSession)
        await newSession.connect(token)
        const newPublisher = await publisherInitialize(openvidu, newSession)

        if (publisherRef.current) {
          publisherRef.current.srcObject = newPublisher.stream.getMediaStream()
        }
      } catch (error) {
        console.error('❌ 세션 연결 실패:', error)
      }
    }

    sessionId && token && joinSession()
    return () => leaveSession()
  }, [])

  useEffect(() => {
    updateSubscriberVideos()
  }, [subscribers])

  return (
    <div className="w-full h-[calc(100vh-11rem)]">
      <VideoLayout
        streamSize={connections.length} // 연결된 사용자 수
        isScreenSharing={isScreenSharing}
      >
        {/* 발행자 영상 */}
        <StreamVideoCard ref={publisherRef} streamData={publisherRef.current} />
        {/* 참여자 영상 */}
        {subscribers?.map((subscriber) => (
          <StreamVideoCard
            key={subscriber.stream.streamId}
            ref={(el) => {
              if (el) {
                subscribersRefs.current[subscriber.stream.streamId] = el
              }
            }}
            streamData={subscriber.stream.getMediaStream()}
          />
        ))}
      </VideoLayout>
    </div>
  )
}

export default ConferenceContainer
