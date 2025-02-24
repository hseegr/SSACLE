import { useEffect } from 'react'

const SprintDiaryModal = ({ isOpen, onClose, diary }) => {
  if (!isOpen || !diary) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-2">{diary.name}</h2>
        <p className="text-gray-600">{diary.date}</p>
        <p className="mt-4">{diary.content}</p>
        <button
          className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default SprintDiaryModal
