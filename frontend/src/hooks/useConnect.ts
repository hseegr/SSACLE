import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useStreamStore } from '@/store/useStreamStore'
import {
  Device,
  OpenVidu,
  Publisher,
  Session,
  SessionEventMap,
  Subscriber,
} from 'openvidu-browser'
import { useCallback, useState } from 'react'
import { useConferenceEvents } from '@/hooks/useConferenceEvents'

export const useConnect = () => {
  const isMicOn = useStreamStore((state) => state.isMicOn)
  const isCameraOn = useStreamStore((state) => state.isCameraOn)
  const setIsScreenSharing = useStreamStore((state) => state.setIsScreenSharing)

  const {
    OV,
    session,
    subscribers,
    mainStreamManager,
    screenPublisher,
    setScreenPublisher,
    setOV,
    setSession,
    setCameraPublisher,
    setSubscribers,
    setMainStreamManager,
  } = useOpenviduStateStore()
  const { handleConnectionCreated, handleConnectionDestroyed } =
    useConferenceEvents() // 컨퍼런스 이벤트 훅

  const [currentVideoDevice, setCurrentVideoDevice] = useState<Device>()

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

          // 기존 카메라 발행자가 있으면 제거
          if (mainStreamManager instanceof Publisher) {
            await session?.unpublish(mainStreamManager)
          }
          await session?.publish(newPublisher)
          setCurrentVideoDevice(newVideoDevice[0] as Device)

          setCameraPublisher(newPublisher)
          setMainStreamManager(newPublisher)
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

    // 새로운 스트림이 생성되었을 때 (예: 다른 사용자의 화면 공유 또는 카메라/마이크 스트림)
    newSession.on('streamCreated', (event) => {
      console.log('streamCreated', event)
      const isScreenSharing =
        event.stream?.typeOfVideo?.toLocaleLowerCase() === 'screen'

      if (isScreenSharing) {
        console.log('외부 화면 공유 스트림 발생')
        // 내 스트림이 아닌 경우에만 구독
        if (
          event.stream.connection.connectionId !==
          newSession.connection.connectionId
        ) {
          const screenSubscriber = newSession.subscribe(event.stream, undefined)
          setScreenPublisher(screenSubscriber as unknown as Publisher)
          setIsScreenSharing(true)
          console.log('구독함', screenSubscriber)
        }
      } else {
        const newSubscriber = newSession.subscribe(event.stream, undefined)
        setSubscribers((prev: Subscriber[]) => [...prev, newSubscriber])
      }
    })

    newSession.on('streamDestroyed', (event) => {
      setSubscribers(
        subscribers.filter(
          (sub: Subscriber) =>
            sub.stream.connection.connectionId !==
            event.stream.connection.connectionId
        )
      )

      if (
        screenPublisher &&
        event.stream.connection.connectionId ===
          screenPublisher.stream.connection.connectionId
      ) {
        console.log('화면 공유 스트림 종료')
        session?.unsubscribe(event.stream as unknown as Subscriber)
        setScreenPublisher(null)
        setIsScreenSharing(false)
      }
    })

    // 📌 🔹 사용자가 입장했을 때
    newSession.on('connectionCreated', (event) => {
      console.log('새로운 사용자가 입장:', event.connection.connectionId)
    })

    // 사용자가 퇴장했을 때
    newSession.on('connectionDestroyed', (event) => {
      console.log('사용자가 퇴장:', event.connection.connectionId)
      handleConnectionDestroyed(event)
    })

    setOV(openvidu)
    setSession(newSession)

    return newSession
  }

  const joinSession = async (session: Session, token: string) => {
    try {
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

      setCameraPublisher(newPublisher) // 퍼블리셔 설정
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
    setCameraPublisher(null)
    setScreenPublisher(null)
  }, [session])

  return { initializeSession, joinSession, leaveSession, switchCamera }
}
