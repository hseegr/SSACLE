import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useStreamStore } from '@/store/useStreamStore'
import { OpenVidu, Session, Subscriber } from 'openvidu-browser'
import { useCallback } from 'react'
import { useConferenceEvents } from '@/hooks/useConferenceEvents'
import { useSearchParams } from 'react-router-dom'
import { useShallow } from 'zustand/shallow'
import { useQueryClient } from '@tanstack/react-query'

export const useConnect = () => {
  const isMicOn = useStreamStore((state) => state.isMicOn)
  const isCameraOn = useStreamStore((state) => state.isCameraOn)
  // const setIsScreenSharing = useStreamStore((state) => state.setIsScreenSharing)

  const {
    session,
    mainStreamManager,
    setScreenPublisher,
    setOV,
    setSession,
    setCameraPublisher,
    setSubscribers,
    setMainStreamManager,
    setMyConnectionId,
  } = useOpenviduStateStore(
    useShallow((state) => ({
      session: state.session,
      mainStreamManager: state.mainStreamManager,
      setScreenPublisher: state.setScreenPublisher,
      setOV: state.setOV,
      setSession: state.setSession,
      setCameraPublisher: state.setCameraPublisher,
      setSubscribers: state.setSubscribers,
      setMainStreamManager: state.setMainStreamManager,
      setMyConnectionId: state.setMyConnectionId,
    }))
  )
  const {
    handleStreamCreated,
    handleStreamDestroyed,
    handleConnectionCreated,
    handleConnectionDestroyed,
  } = useConferenceEvents() // 컨퍼런스 이벤트 훅

  // const [currentVideoDevice, setCurrentVideoDevice] = useState<Device>()

  const [searchParams] = useSearchParams()
  const username = searchParams.get('username')
  const userId = searchParams.get('userId')

  const queryClient = useQueryClient()

  const joinSession = useCallback(async (session: Session, token: string) => {
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
      setMyConnectionId(session.connection.connectionId)
      await session.publish(newPublisher)
      setOV(openviduInstance)
      console.log('나의 connectionId', session.connection.connectionId)
    } catch (error) {
      console.error('❌ 세션 연결 실패:', error)
    }
    setSession(session)
  }, [])

  const initializeSession = useCallback(async () => {
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
  }, [])

  const leaveSession = useCallback(async () => {
    if (session) {
      try {
        await session?.unsubscribe(mainStreamManager as unknown as Subscriber)
      } catch (error) {
        console.error('❌ 세션 해제 실패:', error)
      }
      session.disconnect()
    }

    // 미디어 트랙해제
    const track = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    track.getTracks().map((track) => track.stop())

    setOV(null)
    setSession(null)
    setSubscribers([])
    setMainStreamManager(null)
    setCameraPublisher(null)
    setScreenPublisher(null)
  }, [])

  return { initializeSession, joinSession, leaveSession }
}
