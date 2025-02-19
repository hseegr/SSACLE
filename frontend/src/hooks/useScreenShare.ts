import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import { useStreamStore } from '@/store/useStreamStore'
import { OpenVidu, Publisher } from 'openvidu-browser'
import { useShallow } from 'zustand/shallow'

const useScreenShare = () => {
  const { isMicOn, isCameraOn, setIsScreenSharing } = useStreamStore(
    useShallow((state) => ({
      isMicOn: state.isMicOn,
      isCameraOn: state.isCameraOn,
      setIsScreenSharing: state.setIsScreenSharing,
    }))
  )
  const {
    OV,
    session,
    cameraPublisher,
    screenPublisher,
    setScreenPublisher,
    setCameraPublisher,
  } = useOpenviduStateStore(
    useShallow((state) => ({
      OV: state.OV,
      session: state.session,
      cameraPublisher: state.cameraPublisher,
      screenPublisher: state.screenPublisher,
      setScreenPublisher: state.setScreenPublisher,
      setCameraPublisher: state.setCameraPublisher,
    }))
  )

  // 화면 공유 시작
  const startScreenShare = async () => {
    if (!session || !OV) return

    try {
      // 화면 공유 초기화
      const screenPublisher = await OV?.initPublisherAsync(undefined, {
        videoSource: 'screen',
        publishAudio: isMicOn,
        mirror: false,
      })

      try {
        // 만약 이미 카메라 publisher가 publish되어 있다면, unpublish 처리합니다.
        if (cameraPublisher) {
          await session?.unpublish(cameraPublisher)
        }

        await session?.publish(screenPublisher)
      } catch (err) {
        console.error('publish 실패:', err)
      }

      setScreenPublisher(screenPublisher)
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
    // 기존에 카메라 publisher가 있었다면, 새롭게 생성하여 publish (화면 공유 종료 후 카메라 복원)
    try {
      if (cameraPublisher) {
        // 기존 카메라 publisher 재사용 대신 새로운 인스턴스 생성
        const newCameraPublisher = await OV?.initPublisherAsync(undefined, {
          videoSource: isCameraOn ? 'camera' : undefined, // 기본 카메라 소스 사용 (undefined 지정 시 기본 카메라)
          publishAudio: isMicOn,
          mirror: true,
        })
        await session?.publish(newCameraPublisher as Publisher)
        console.log('✅ 카메라 publisher 복원 완료')
        // 필요하다면, 새로운 카메라 publisher를 상태에 업데이트합니다.
        setCameraPublisher(newCameraPublisher as Publisher)
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ 화면 공유 종료 후 카메라 복원 실패:', error)
      }
    }
  }

  return { startScreenShare, stopScreenShare }
}

export default useScreenShare
