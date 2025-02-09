import { OpenVidu } from 'openvidu-browser'
import { useEffect, useRef, useState } from 'react'

const VideoConference = ({ sessionId, token }) => {
  const [session, setSession] = useState(null)
  const [publisher, setPublisher] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const publisherRef = useRef(null)
  const subscriberRefs = useRef({})

  // ✅ 스트림 생성 핸들러
  const handleStreamCreated = (event) => {
    const subscriber = session.subscribe(event.stream, undefined)
    setSubscribers((prev) => [...prev, subscriber])
  }

  // ✅ 스트림 삭제 핸들러
  const handleStreamDestroyed = (event) => {
    setSubscribers((prev) =>
      prev.filter((sub) => sub.stream.streamId !== event.stream.streamId)
    )
  }

  // ✅ 비디오 스트림 업데이트
  const updateSubscriberVideos = () => {
    subscribers.forEach((subscriber) => {
      const videoElement = subscriberRefs.current[subscriber.stream.streamId]
      if (videoElement) {
        videoElement.srcObject = subscriber.stream.getMediaStream()
      }
    })
  }

  // ✅ 세션 참여
  const joinSession = async () => {
    console.log('🔹 joinSession - 토큰:', token)

    try {
      const openvidu = new OpenVidu()
      const newSession = openvidu.initSession()

      newSession.on('streamCreated', handleStreamCreated)
      newSession.on('streamDestroyed', handleStreamDestroyed)

      await newSession.connect(token)

      // 🔹 발행자 생성
      const newPublisher = openvidu.initPublisher(undefined, {
        videoSource: undefined, // 비디오 소스
        audioSource: undefined, // 오디오 소스
        publishAudio: true, // 오디오 발행
        publishVideo: true, // 비디오 발행
        resolution: '640x640', // 해상도
        frameRate: 30, // 프레임 속도
        insertMode: 'APPEND', // 비디오 삽입 모드
        mirror: false, // 미러링 여부
      })

      await newSession.publish(newPublisher)
      setPublisher(newPublisher)
      setSession(newSession)

      // ✅ 발행자 비디오 출력
      if (publisherRef.current) {
        publisherRef.current.srcObject = newPublisher.stream.getMediaStream()
      }
    } catch (error) {
      console.error('❌ 세션 연결 실패:', error)
    }
  }

  // ✅ 세션 종료
  const leaveSession = () => {
    if (session) {
      session.disconnect()
      setSession(null)
      setPublisher(null)
      setSubscribers([])
    }
  }

  useEffect(() => {
    return () => leaveSession()
  }, [])

  useEffect(() => {
    updateSubscriberVideos()
  }, [subscribers])

  return (
    <div className="video-conference">
      <div className="grid grid-cols-2 gap-2">
        {/* 🔹 발행자 비디오 */}
        <video
          ref={publisherRef}
          autoPlay
          playsInline
          className="w-full bg-gray-200 aspect-video"
        />
      </div>
      <div className="flex justify-center">
        {subscribers.map((subscriber) => (
          <div key={subscriber.stream.streamId}>
            <video
              ref={(el) =>
                (subscriberRefs.current[subscriber.stream.streamId] = el)
              }
              autoPlay
              playsInline
              className="w-full bg-gray-200 aspect-video"
            />
          </div>
        ))}
      </div>

      <button onClick={joinSession}>참여하기</button>
    </div>
  )
}

export default VideoConference
