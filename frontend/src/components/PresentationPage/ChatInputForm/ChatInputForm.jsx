import { SendIcon } from 'lucide-react'
import { useState } from 'react'

const ChatInputForm = () => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    // 메시지 전송
    e.preventDefault()
    console.log(message)
    setMessage('')
  }

  const handleChange = (e) => {
    // 메시지 입력 시 상태 업데이트
    setMessage(e.target.value)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1 border-t-[1px] border-gray-500"
    >
      <input
        type="text"
        onChange={handleChange}
        placeholder="메시지를 입력하세요"
        value={message}
        className="flex-1 p-2 text-sm rounded-md focus:outline-none focus:ring-2 bg-ssacle-black focus:ring-blue-500 "
      />
      <button className="flex items-center justify-center w-1/6 px-2 py-1 text-center transition-all duration-300 rounded-md size-full bg-ssacle-black hover:bg-gray-700 placeholder:text-sm ">
        <SendIcon className="size-4 " />
      </button>
    </form>
  )
}
export default ChatInputForm
