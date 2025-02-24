import ChatHeader from '@/components/PresentationPage/ChatHeader/ChatHeader'
import ChatInputForm from '@/components/PresentationPage/ChatInputForm/ChatInputForm'
import ChatMessageArea from '@/components/PresentationPage/ChatMessageArea/ChatMessageArea'

const PresentationChat = () => {
  return (
    <div className="basis-1/4 flex flex-col  border-[1px] border-gray-500 rounded-md">
      {/* 채팅 헤더 */}
      <ChatHeader />
      {/* 채팅 메시지 영역 */}
      <ChatMessageArea />
      {/* 채팅 입력 영역 */}
      <ChatInputForm />
    </div>
  )
}
export default PresentationChat
