import { useState, useEffect } from 'react'
import dayjs from 'dayjs'

const SprintPresentationSession = ({ sprint }) => {
  if (!sprint || !sprint.announceAt) return null

  const today = dayjs().startOf('day')
  const presentationDate = dayjs(sprint.announceAt).startOf('day')
  const dDay = presentationDate.diff(today, 'day')

  return (
    <div
      className={`p-4 shadow-md rounded-lg w-full transition ${
        dDay === 0 ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <h2 className="text-md font-bold mt-2 mb-2">
        싸프린트 발표 & 질문/답변 세션
      </h2>
      <p className="text-xs text-gray-600">
        {presentationDate.format('YYYY년 M월 D일 A h시 ~')}
      </p>

      {/* D-Day & 입장 버튼 */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-blue-600 text-md font-bold">
          {dDay === 0 ? 'D-DAY' : `D-DAY ${dDay}`}
        </span>

        <button
          className={`w-28 p-2 text-xs rounded-md transition ${
            dDay === 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
          disabled={dDay !== 0}
        >
          입장하기
        </button>
      </div>
    </div>
  )
}

export default SprintPresentationSession
