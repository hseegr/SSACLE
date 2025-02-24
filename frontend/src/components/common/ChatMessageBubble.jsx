const ChatMessageBubble = ({ isMe, name, message }) => {
  return (
    <div
      className={`flex items-start space-x-2 ${
        isMe ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <div>
        <p className="text-sm text-ssacle-gray">{name}</p>
        <div
          className={`p-2 mt-1  rounded-lg ${
            isMe ? 'bg-blue-500' : 'bg-gray-100'
          }`}
        >
          <p
            className={`text-sm ${
              isMe ? 'text-ssacle-white' : 'text-ssacle-black'
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
export default ChatMessageBubble
