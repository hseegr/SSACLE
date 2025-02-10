import PresentationControlItem from '@/components/PresentationPage/PresentationControlItem/PresentationControlItem'
import { usePresentationStore } from '@/store/usePresentationStore'
import {
  SparklesIcon,
  MicIcon,
  CameraIcon,
  ScreenShareIcon,
  UsersIcon,
  MessageSquareIcon,
  LogOutIcon,
} from 'lucide-react'

const PRESENTATION_CONTROLS = ({ isChatOpen, setIsChatOpen }) => ({
  effects: {
    id: 1,
    icon: <SparklesIcon className="w-full" />,
    title: '효과',
    style: 'text-yellow-500',
    activeFunction: () => {
      console.log('효과')
    },
  },
  controls: [
    {
      id: 2,
      icon: <MicIcon className="w-full" />,
      title: '마이크',
      activeFunction: () => {
        // 마이크 기능 활성화
        console.log('마이크')
      },
    },
    {
      id: 3,
      icon: <CameraIcon className="w-full" />,
      title: '카메라',
      activeFunction: () => {
        console.log('카메라')
      },
    },
    {
      id: 4,
      icon: <ScreenShareIcon className="w-full" />,
      title: '화면공유',
      style: 'text-green-500',
      activeFunction: () => {
        console.log('화면공유')
      },
    },
    {
      id: 5,
      icon: <UsersIcon className="w-full" />,
      title: '참여자',
      activeFunction: () => {
        console.log('참여자')
      },
    },
    {
      id: 6,
      icon: <MessageSquareIcon className="w-full" />,
      title: '채팅',
      activeFunction: () => {
        setIsChatOpen(!isChatOpen)
      },
    },
  ],
  exit: {
    id: 7,
    icon: <LogOutIcon className="w-full" />,
    title: '나가기',
    style: 'text-red-500',
    activeFunction: () => {
      console.log('나가기')
    },
  },
})

const PresentationControlBar = () => {
  const { isChatOpen, setIsChatOpen } = usePresentationStore()
  const { effects, controls, exit } = PRESENTATION_CONTROLS({
    isChatOpen,
    setIsChatOpen,
  })
  return (
    <nav className="flex items-center justify-between h-16 px-24 py-1 bg-black">
      <PresentationControlItem item={effects} />
      <ul className="flex justify-between gap-10 px-6">
        {controls.map((item) => (
          <PresentationControlItem key={item.id} item={item} />
        ))}
      </ul>
      <PresentationControlItem item={exit} />
    </nav>
  )
}

export default PresentationControlBar
