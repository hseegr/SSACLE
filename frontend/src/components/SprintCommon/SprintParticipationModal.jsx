import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { joinSsaprint } from '@/services/ssaprintService'

const SprintParticipationModal = ({ onClose, sprintId }) => {
  const [isChecked, setIsChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleJoinSprint = async () => {
    try {
      setLoading(true)
      await joinSsaprint(sprintId)
      alert('스프린트에 신청되었습니다.')

      if (window.confirm('내 스프린트 노트로 이동하시겠습니까?')) {
        navigate(`/my-sprints/${sprintId}`)
        window.location.reload() // 🔹 강제 새로고침하여 참여중 데이터 반영
      }
      onClose()
    } catch (error) {
      alert('참가 신청 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[40rem] relative">
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-blue-600 text-center">
          스프린트 참여 신청 확인
        </h2>
        <p className="text-gray-800 mt-5 text-base text-center">
          스프린트 신청은 취소가 불가능합니다. 아래 내용을 확인하고 신중히
          결정해주세요!
        </p>
        <ul className="mt-6 text-base text-gray-700 list-disc list-inside">
          <li>스프린트 신청 후에는 취소 및 변경이 불가능합니다.</li>
          <li>스프린트 기간 동안 적극적인 참여를 권장합니다.</li>
          <li>
            참여 후 제공되는 혜택은 수료 조건을 충족한 경우에만 받을 수
            있습니다.
          </li>
        </ul>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="agreement"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="mr-2 w-5 h-5"
          />
          <label htmlFor="agreement" className="text-base text-gray-800">
            위 내용을 확인하였으며, 신청에 동의합니다.
          </label>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            className={`w-full py-3 px-5 rounded-lg font-medium text-white text-lg transition-all ${
              isChecked
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            onClick={handleJoinSprint}
            disabled={!isChecked || loading}
          >
            {loading ? '신청 중...' : '스프린트 참여하기'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SprintParticipationModal
