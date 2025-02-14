import StreamVideoCard from '@/components/PresentationPage/StreamVideoCard/StreamVideoCard'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useConnect } from '@/hooks/useConnect'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import SsaprintVideoLayout from '@/components/layout/SsaprintVideoLayout'
import SsadcupVideoLayout from '@/components/layout/SsadcupVideoLayout'

interface ConferenceContainerProps {
  token: string
}
const ConferenceContainer = ({ token }: ConferenceContainerProps) => {
  const { cameraPublisher, subscribers } = useOpenviduStateStore()
  // * http://localhost:5173/presentation/:presentationType/:roomId?userId=1234567890

  const { initializeSession, joinSession, leaveSession } = useConnect()
  const { presentationType } = useParams()

  const VideoLayout = useMemo(() => {
    return presentationType === 'ssadcup' // 싸드컵 프리젠테이션 페이지인 경우
      ? SsadcupVideoLayout
      : SsaprintVideoLayout
  }, [presentationType])

  // 처음 컴포넌트가 마운트 될 때 세션 초기화 및 참여
  useEffect(() => {
    const initialize = async () => {
      if (token) {
        await initializeSession() // 이 세션 ID는 서버에서 받아올 것임
          .then((session) => {
            joinSession(session, token)
          })
      }
    }
    initialize()
    return () => leaveSession()
  }, [])

  const sessionConnection = useMemo<number>(() => {
    return subscribers.length + (cameraPublisher ? 1 : 0)
  }, [subscribers, cameraPublisher])

  const StreamVideoCards = useMemo(() => {
    const Card = []
    if (cameraPublisher) {
      Card.push(
        <StreamVideoCard
          key={cameraPublisher.stream.connection.connectionId}
          ref={(el: HTMLVideoElement) =>
            el && cameraPublisher.addVideoElement(el)
          }
        />
      )
    }
    if (subscribers) {
      subscribers.forEach((sub, index) =>
        Card.push(
          <StreamVideoCard
            key={index}
            ref={(el: HTMLVideoElement) => el && sub.addVideoElement(el)}
          />
        )
      )
    }
    return Card
  }, [subscribers, cameraPublisher])

  return (
    <div className="w-full h-full">
      <VideoLayout
        connectCount={sessionConnection} // 컨퍼런스 참여자 수
      >
        {StreamVideoCards}
      </VideoLayout>
    </div>
  )
}

export default ConferenceContainer
