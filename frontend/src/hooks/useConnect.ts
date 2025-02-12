import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useStreamStore } from '@/store/useStreamStore'
import {
  OpenVidu,
  Publisher,
  Session,
  SessionEventMap,
  Subscriber,
} from 'openvidu-browser'
import { useCallback, useState } from 'react'
import { useConferenceEvents } from '@/hooks/useConferenceEvents'

export const useConnect = () => {
  const { isMicOn, isCameraOn, isScreenSharing } = useStreamStore()
  const {
    OV,
    session,
    subscribers,
    mainStreamManager,
    setOV,
    setSession,
    setPublisher,
    setSubscribers,
    setMainStreamManager,
  } = useOpenviduStateStore()
  const { handleConnectionCreated, handleConnectionDestroyed } =
    useConferenceEvents() // 컨퍼런스 이벤트 훅

  const [currentVideoDevice, setCurrentVideoDevice] = useState()

  // 카메라 전환
  const switchCamera = useCallback(async () => {
    try {
      if (!OV || !currentVideoDevice) return

      const devices = await OV.getDevices()
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      )

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        )

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          })

          if (mainStreamManager instanceof Publisher) {
            await session?.unpublish(mainStreamManager)
          }
          await session?.publish(newPublisher)
          setCurrentVideoDevice(newVideoDevice[0])
          setMainStreamManager(newPublisher)
          setPublisher(newPublisher)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [OV, currentVideoDevice, mainStreamManager, session])

  const initializeSession = async () => {
    const openvidu = new OpenVidu()
    openvidu.enableProdMode()

    const newSession = openvidu.initSession()

    // 📌 🔹 새로운 사용자가 들어왔을 때 처리 (subscriber 추가)
    newSession.on('streamCreated', (event) => {
      const newSubscriber = newSession.subscribe(event.stream, undefined)
      useOpenviduStateStore
        .getState()
        .setSubscribers((prev: StreamManager[]) => [...prev, newSubscriber])
    })

    // 📌 🔹 사용자가 입장했을 때
    newSession.on('connectionCreated', (event) => {
      console.log('새로운 사용자가 입장:', event.connection.connectionId)
    })

    // 📌 🔹 사용자가 퇴장했을 때
    newSession.on('connectionDestroyed', (event) => {
      console.log('사용자가 퇴장:', event.connection.connectionId)
      setSubscribers(
        subscribers.filter(
          (sub) =>
            sub.stream.connection.connectionId !== event.connection.connectionId
        )
      )
    })

    setOV(openvidu)
    setSession(newSession)

    return newSession
  }

  const joinSession = async (session: Session, token: string) => {
    try {
      console.log('joinSession', session)
      if (!token) throw new Error('토큰이 유효하지 않습니다.')
      if (!session) throw new Error('세션이 초기화되지 않았습니다.')
      /** 세션 연결 */
      await session?.connect(token)
      /** 퍼블리셔 초기화 */
      const OV = new OpenVidu()
      // 퍼블리셔 초기화
      const newPublisher = OV.initPublisher(undefined, {
        videoSource: undefined,
        audioSource: undefined,
        publishAudio: isMicOn,
        publishVideo: isCameraOn,
        resolution: '1280x720',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: true,
      })

      setPublisher(newPublisher) // 퍼블리셔 설정
      setMainStreamManager(newPublisher) // 메인 스트림 매니저 설정
      await session.publish(newPublisher) // 세션에 퍼블리셔 발행
    } catch (error) {
      console.error('❌ 세션 연결 실패:', error)
    }
  }

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect()
    }

    setOV(null)
    setSession(null)
    setSubscribers([])
    setMainStreamManager(null)
    setPublisher(null)
  }, [session])

  return { initializeSession, joinSession, leaveSession, switchCamera }
}
