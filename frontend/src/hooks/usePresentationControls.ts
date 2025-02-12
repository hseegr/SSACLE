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
} from 'lucide-react'
import { usePresentationStore } from '@/store/usePresentationStore'
import { useStreamStore } from '@/store/useStreamStore'
import { useOpenviduStateStore } from '@/store/useOpenviduStateStore'
import useScreenShare from './useScreenShare'

export const usePresentationControls = () => {
  const { isChatOpen, setIsChatOpen } = usePresentationStore()
  const { cameraPublisher } = useOpenviduStateStore()
  const {
    isMicOn,
    isCameraOn,
    isScreenSharing,
    setIsMicOn,
    setIsCameraOn,
    setIsScreenSharing,
  } = useStreamStore()

  const { startScreenShare, stopScreenShare } = useScreenShare()

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
        cameraPublisher?.publishAudio(!isMicOn)
        setIsMicOn(!isMicOn)
      },
    },
    {
      id: 'camera',
      icon: isCameraOn ? CameraIcon : CameraOffIcon,
      style: isCameraOn ? '' : 'text-red-500',
      title: '카메라',
      activeFunction: () => {
        cameraPublisher?.publishVideo(!isCameraOn)
        setIsCameraOn(!isCameraOn)
      },
    },
    {
      id: 'screen',
      icon: isScreenSharing ? ScreenShareOffIcon : ScreenShareIcon,
      title: isScreenSharing ? '화면공유중' : '화면공유',
      style: isScreenSharing ? 'text-green-500' : '',
      activeFunction: () => {
        isScreenSharing ? stopScreenShare() : startScreenShare()
      },
    },
    {
      id: 'users',
      icon: UsersIcon,
      title: '참여자',
      activeFunction: () => {
        console.log('참여자')
      },
    },
    {
      id: 'chat',
      icon: MessageSquareIcon,
      title: '채팅',
      activeFunction: () => {
        setIsChatOpen(!isChatOpen)
      },
    },
  ]

  const rightControl = {
    id: 'exit',
    icon: LogOutIcon,
    title: '나가기',
    style: 'text-red-500',
    activeFunction: () => {
      console.log('나가기')
    },
  }

  return { leftControl, centerControls, rightControl }
}
