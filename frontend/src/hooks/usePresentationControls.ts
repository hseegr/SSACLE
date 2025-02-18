import {
  SparklesIcon,
  MicIcon,
  CameraIcon,
  ScreenShareIcon,
  UsersIcon,
  MessageSquareIcon,
  LogOutIcon,
  MicOffIcon,
  CameraOffIcon,
  ScreenShareOffIcon,
  FullscreenIcon,
  ShrinkIcon,
} from 'lucide-react'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useStreamStore } from '@/store/useStreamStore'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import useScreenShare from '@/hooks/useScreenShare'
import { useModal } from '@/hooks/useModal'
import { ModalSteps } from '@/constants/modalStep'
import { useConnect } from '@/hooks/useConnect'
import { useShallow } from 'zustand/shallow'
import useRoomStateStore from '@/store/useRoomStateStore'
import { usePresentationSignalStore } from '@/store/usePresentationSignalStore'

export const usePresentationControls = () => {
  const presentationStatus = usePresentationSignalStore(
    (state) => state.presentationStatus
  )
  const { cameraPublisher, screenPublisher, session, subscribers } =
    useOpenviduStateStore(
      useShallow((state) => ({
        cameraPublisher: state.cameraPublisher,
        screenPublisher: state.screenPublisher,
        session: state.session,
        subscribers: state.subscribers,
      }))
    )
  const { isMicOn, isCameraOn, isScreenSharing, isFullScreen } = useStreamStore(
    useShallow((state) => ({
      isMicOn: state.isMicOn,
      isCameraOn: state.isCameraOn,
      isScreenSharing: state.isScreenSharing,
      isFullScreen: state.isFullScreen,
    }))
  )
  const { openModal, setModalStep, setIsModalOpen } = useModal()
  const { startScreenShare, stopScreenShare } = useScreenShare()
  const { roomConnectionData, roomId } = useRoomStateStore(
    useShallow((state) => ({
      roomConnectionData: state.roomConnectionData,
      roomId: state.roomId,
    }))
  )

  const leftControl = [
    {
      id: 'effects',
      icon: SparklesIcon,
      title: '효과',
      style: 'text-yellow-500',
      activeFunction: () => {
        // 효과 띄우기
        setModalStep(ModalSteps.WARNING.EFFECT_WARNING)
        setIsModalOpen(true)
        console.log('session', session)
        console.log('roomConnectionData', roomConnectionData[roomId])
        console.log('session', session)
        console.log('presentationStatus', presentationStatus)
      },
    },
    {
      id: 'fullScreen',
      icon: isFullScreen ? ShrinkIcon : FullscreenIcon,
      title: isFullScreen ? '축소' : '전체화면',
      style: '',
      activeFunction: () => {
        if (isFullScreen && document.fullscreenElement) {
          document.exitFullscreen()
          useStreamStore.setState(({ isFullScreen }) => ({
            isFullScreen: !isFullScreen,
          }))
        } else {
          document.documentElement.requestFullscreen()
          useStreamStore.setState(({ isFullScreen }) => ({
            isFullScreen: !isFullScreen,
          }))
        }
      },
    },
  ]

  const centerControls = [
    {
      id: 'mic',
      icon: isMicOn ? MicIcon : MicOffIcon,
      title: '마이크',
      style: isMicOn ? '' : 'text-red-500',
      activeFunction: () => {
        cameraPublisher && cameraPublisher?.publishAudio(!isMicOn)
        screenPublisher && screenPublisher?.publishAudio(!isMicOn)
        useStreamStore.setState(({ isMicOn }) => ({
          isMicOn: !isMicOn,
        }))
      },
    },
    {
      id: 'camera',
      icon: isCameraOn ? CameraIcon : CameraOffIcon,
      style: isCameraOn ? '' : 'text-red-500',
      title: '카메라',
      activeFunction: () => {
        console.log(
          'screenPublisher?.isSubscribedToRemote',
          screenPublisher?.isSubscribedToRemote
        )
        if (!isScreenSharing && cameraPublisher) {
          cameraPublisher?.publishVideo(!isCameraOn)
          useStreamStore.setState(({ isCameraOn }) => ({
            isCameraOn: !isCameraOn,
          }))
        } else if (
          isScreenSharing &&
          screenPublisher?.stream.connection.connectionId ===
            cameraPublisher?.stream.connection.connectionId
        ) {
          // 화면공유 중이면서 카메라 공유자가 자신인 경우
          alert('기술적 에러...화면공유 중이므로 카메라를 켜지 못합니다.')
        } else {
          // 화면공유 중이면서 카메라 공유자가 자신이 아닌 경우 카메라 끄고 키기 가능
          cameraPublisher?.publishVideo(!isCameraOn)
          useStreamStore.setState(({ isCameraOn }) => ({
            isCameraOn: !isCameraOn,
          }))
        }
      },
    },
    {
      id: 'screen',
      icon: isScreenSharing ? ScreenShareOffIcon : ScreenShareIcon,
      title: isScreenSharing ? '화면공유중' : '화면공유',
      style: isScreenSharing ? 'text-green-500' : '',
      activeFunction: () => {
        const isSharingMe =
          screenPublisher?.stream.connection.connectionId ===
          cameraPublisher?.stream.connection.connectionId // 화면공유 중이면서 카메라 공유자가 자신인 경우

        if (isScreenSharing && !isSharingMe) {
          alert(
            '다른 사용자가 화면공유 중이므로 화면공유를 종료할 수 없습니다.'
          )
          return
        }

        isScreenSharing
          ? confirm('화면공유를 끝내겠습니까?') && stopScreenShare()
          : startScreenShare()
      },
    },
    {
      id: 'users',
      icon: UsersIcon,
      title: '참여자',
      activeFunction: () => {
        console.log('참여자')
      },
      isDropdown: true,
    },
    {
      id: 'chat',
      icon: MessageSquareIcon,
      title: '채팅',
      activeFunction: () => {
        usePresentationStore.setState(({ isChatOpen }) => ({
          isChatOpen: !isChatOpen,
        }))
      },
    },
  ]

  const rightControl = {
    id: 'exit',
    icon: LogOutIcon,
    title: '나가기',
    style: 'text-red-500',
    activeFunction: () => {
      openModal()
      setModalStep(ModalSteps.ENDING.END_CAUTION)
    },
  }

  return { leftControl, centerControls, rightControl }
}
