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
import { useParams, useSearchParams } from 'react-router-dom'
import useRoomStateStore from '@/store/useRoomStateStore'
import { useShallow } from 'zustand/shallow'

export const useConnect = () => {
  const isMicOn = useStreamStore((state) => state.isMicOn)
  const isCameraOn = useStreamStore((state) => state.isCameraOn)
  const setIsScreenSharing = useStreamStore((state) => state.setIsScreenSharing)

  const {
    OV,
    session,
    mainStreamManager,
    setScreenPublisher,
    setOV,
    setSession,
    setCameraPublisher,
    setSubscribers,
    setMainStreamManager,
  } = useOpenviduStateStore()
  const {
    handleStreamCreated,
    handleStreamDestroyed,
    handleConnectionCreated,
    handleConnectionDestroyed,
  } = useConferenceEvents() // 컨퍼런스 이벤트 훅

  // Zustand persist store에서 room connection data 관련 로직을 가져오되, shallow 최적화 적용
  const { addRoomConnectionData, removeRoomConnectionData } = useRoomStateStore(
    useShallow((state) => ({
      addRoomConnectionData: state.addRoomConnectionData,
      removeRoomConnectionData: state.removeRoomConnectionData,
    }))
  )

  const [currentVideoDevice, setCurrentVideoDevice] = useState<Device>()

  const [searchParams] = useSearchParams()
  const username = searchParams.get('username')
  const userId = searchParams.get('userId')
  const { roomId } = useParams()

  const joinSession = async (session: Session, token: string) => {
    try {
      if (!token) throw new Error('토큰이 유효하지 않습니다.')
      if (!session) throw new Error('세션이 초기화되지 않았습니다.')

      // 연결에 필요한 data를 JSON 문자열로 생성
      const connectData = JSON.stringify({
        username,
        userId,
      })

      /** 세션 연결 */
      await session.connect(token, connectData)
      /** 퍼블리셔 초기화 */
      const openviduInstance = new OpenVidu()
      const newPublisher = await openviduInstance.initPublisherAsync(
        undefined,
        {
          videoSource: undefined,
          audioSource: undefined,
          publishAudio: isMicOn,
          publishVideo: isCameraOn,
          resolution: '1280x720',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: true,
        }
      )

      setCameraPublisher(newPublisher)
      setMainStreamManager(newPublisher)
      await session.publish(newPublisher)
      setOV(openviduInstance)
    } catch (error) {
      console.error('❌ 세션 연결 실패:', error)
    }
    setSession(session)
  }

  const initializeSession = async () => {
    if (session) {
      console.log('이미 세션이 존재합니다.')
      return session // 기존 세션 반환
    }
    const openvidu = new OpenVidu()
    openvidu.enableProdMode()

    const newSession = openvidu.initSession()

    setOV(openvidu)
    setSession(newSession)

    // 🔹 새로운 스트림이 생성되었을 때 (예: 다른 사용자의 화면 공유 또는 카메라/마이크 스트림)
    newSession.on('streamCreated', handleStreamCreated)
    // 🔹 스트림이 삭제되었을 때
    newSession.on('streamDestroyed', handleStreamDestroyed)
    // 🔹 사용자가 입장했을 때
    newSession.on('connectionCreated', handleConnectionCreated)
    // 🔹 사용자가 퇴장했을 때
    newSession.on('connectionDestroyed', handleConnectionDestroyed)

    return newSession
  }

  const leaveSession = useCallback(async () => {
    if (session) {
      try {
        await session?.unsubscribe(mainStreamManager as unknown as Subscriber)
      } catch (error) {
        console.error('❌ 세션 해제 실패:', error)
      }
      session.disconnect()
    }

    setOV(null)
    setSession(null)
    setSubscribers([])
    setMainStreamManager(null)
    setCameraPublisher(null)
    setScreenPublisher(null)
  }, [session])

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

  return { initializeSession, joinSession, leaveSession, switchCamera }
}
