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
  SendIcon,
} from 'lucide-react'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useStreamStore } from '@/store/useStreamStore'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import useScreenShare from '@/hooks/useScreenShare'
import { useModal } from '@/hooks/useModal'
import { ModalSteps } from '@/constants/modalStep'
import useRoomStateStore from '@/store/useRoomStateStore'
import { useShallow } from 'zustand/shallow'

export const usePresentationControls = () => {
  const { cameraPublisher, screenPublisher } = useOpenviduStateStore()
  const { isMicOn, isCameraOn, isScreenSharing } = useStreamStore()
  const { openModal, setModalStep } = useModal()
  const { startScreenShare, stopScreenShare } = useScreenShare()
  const { roomConnectionData, roomId } = useRoomStateStore(
    useShallow((state) => ({
      roomConnectionData: state.roomConnectionData,
      roomId: state.roomId,
    }))
  )

  const connectionUserData = roomConnectionData[roomId]
  console.log(connectionUserData)

  const leftControl = {
    id: 'effects',
    icon: SparklesIcon,
    title: '효과',
    style: 'text-yellow-500',
    activeFunction: () => {
      console.log('효과')
    },
  }

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
        if (!isScreenSharing && cameraPublisher) {
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
      dropDownItems: {
        title: '참여자',
        items: [],
      },
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
