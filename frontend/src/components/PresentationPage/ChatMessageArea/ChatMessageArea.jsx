import ChatMessageBubble from '@/components/common/ChatMessageBubble'

const MESSAGE_MOCK = [
  {
    id: 1,
    isMe: false,
    userName: '상대방',
    message: '안녕하세요!',
  },
  {
    id: 2,
    isMe: true,
    userName: '나',
    message: '반갑습니다!',
  },
]

const ChatMessageArea = () => {
  return (
    <div className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
      {MESSAGE_MOCK.map(({ id, isMe, userName, message }) => (
        <ChatMessageBubble
          key={id}
          isMe={isMe}
          name={userName}
          message={message}
        />
      ))}
    </div>
  )
}
export default ChatMessageArea
