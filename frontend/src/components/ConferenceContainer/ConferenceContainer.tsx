import StreamVideoCard from '@/components/PresentationPage/StreamVideoCard/StreamVideoCard'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useConnect } from '@/hooks/useConnect'
import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import SsaprintVideoLayout from '@/components/layout/SsaprintVideoLayout'
import SsadcupVideoLayout from '@/components/layout/SsadcupVideoLayout'
import { useShallow } from 'zustand/shallow'
import QuestionInfo from '@/components/PresentationPage/QuestionInfo/QuestionInfo'

import type { FC } from 'react'

interface ConferenceContainerProps {
  token: string
}

const ConferenceContainer: FC<ConferenceContainerProps> = ({ token }) => {
  const { cameraPublisher, subscribers, session } = useOpenviduStateStore(
    useShallow((state) => ({
      cameraPublisher: state.cameraPublisher,
      subscribers: state.subscribers,
      session: state.session,
    }))
  )

  const { initializeSession, joinSession, leaveSession } = useConnect()
  const { presentationType } = useParams()
  const firstRenderRef = useRef(false) // 첫 번째 렌더링 여부를 확인하는 참조

  const VideoLayout = useMemo(() => {
    if (presentationType === 'ssadcup') {
      return SsadcupVideoLayout
    } else if (presentationType === 'ssaprint') {
      return SsaprintVideoLayout
    }
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
    !firstRenderRef.current && initialize()
    firstRenderRef.current = true
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
          isPublisher={true}
          key={cameraPublisher.stream.connection.connectionId}
          username={JSON.parse(cameraPublisher.stream.connection.data).username}
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
            isPublisher={false}
            key={index}
            username={JSON.parse(sub.stream.connection.data).username}
            ref={(el: HTMLVideoElement) => el && sub.addVideoElement(el)}
          />
        )
      )
    }
    return Card
  }, [subscribers, cameraPublisher])

  return (
    <div className="w-full h-full">
      <QuestionInfo />
      <VideoLayout
        connectCount={sessionConnection} // 컨퍼런스 참여자 수
      >
        {StreamVideoCards}
      </VideoLayout>
    </div>
  )
}

export default ConferenceContainer
