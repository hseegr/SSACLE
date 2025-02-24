import { Plus } from 'lucide-react'

const AddQuestionButton = ({ onClick }) => {
  return (
    <button
      className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition text-sm"
      onClick={onClick}
    >
      <Plus size={16} className="mr-1" />
      질문 추가하기
    </button>
  )
}

export default AddQuestionButton
