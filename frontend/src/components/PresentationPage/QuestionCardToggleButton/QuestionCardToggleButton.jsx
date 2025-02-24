import { ChevronDown, ChevronUp } from 'lucide-react'

const QuestionCardToggleButton = ({ isOpen, setIsOpen }) => {
  return (
    <button
      className="absolute p-2 transition-colors -translate-x-1/2 bg-gray-500 rounded-md shadow-md -top-5 left-1/2 hover:bg-gray-600 hover:shadow-lg"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      {isOpen ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs">질문카드 닫기</span>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs">질문카드 열기</span>
          <ChevronUp className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  )
}
export default QuestionCardToggleButton
