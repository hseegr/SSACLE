import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useStreamStore } from '@/store/useStreamStore'
import { OpenVidu } from 'openvidu-browser'

const useScreenShare = () => {
  const { setIsScreenSharing } = useStreamStore()
  const {
    OV,
    session,
    cameraPublisher,
    screenPublisher,
    setScreenPublisher,
    setMainStreamManager,
  } = useOpenviduStateStore()

  // 화면 공유 시작
  const startScreenShare = async () => {
    if (!session || !OV) return

    // 메인 스트림 저장
    // 만약 이미 카메라 publisher가 publish되어 있다면, unpublish 처리합니다.
    if (cameraPublisher) {
      await session?.unpublish(cameraPublisher)
    }

    try {
      // 화면 공유 초기화
      const screenPublisher = await OV?.initPublisherAsync(undefined, {
        videoSource: 'screen',
        publishAudio: true,
        mirror: false,
      })

      try {
        await session?.publish(screenPublisher)
      } catch (err) {
        console.error('publish 실패:', err)
      }

      setScreenPublisher(screenPublisher)
      setMainStreamManager(screenPublisher)
      setIsScreenSharing(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ 화면 공유 실패:', error, {
          errorName: error.name,
          errorMessage: error.message,
        })
      }
    }
  }

  // 화면 공유 종료
  const stopScreenShare = async () => {
    if (!session || !screenPublisher) return

    try {
      await session?.unpublish(screenPublisher)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ 화면 종료 실패:', error, {
          errorName: error.name,
          errorMessage: error.message,
        })
      }
    }

    // 화면 공유 종료 후 화면 공유 스트림 제거
    const mediaStream = screenPublisher.stream.getMediaStream()
    mediaStream?.getTracks().forEach((track) => {
      track.stop()
    })

    console.log('✅ 화면 공유 종료')
    // 화면 공유 publisher 제거 및 상태 업데이트
    setScreenPublisher(null)
    setIsScreenSharing(false)

    // 기존의 카메라 publisher가 존재한다면 다시 publish (화면 공유 종료 후 카메라 복원)
    // cameraPublisher는 startSession 또는 joinSession 시점에 저장해두었어야 합니다.
    try {
      if (cameraPublisher) {
        await session?.publish(cameraPublisher)
        setMainStreamManager(cameraPublisher)
      }
    } catch (error) {
      console.error('❌ 화면 공유 종료 후 카메라 복원 실패:', error)
    }
  }

  return { startScreenShare, stopScreenShare }
}

export default useScreenShare
