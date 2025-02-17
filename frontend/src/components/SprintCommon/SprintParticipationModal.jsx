import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { joinSsaprint } from '@/services/ssaprintService'

const SprintParticipationModal = ({
  onClose,
  sprintId,
  setIsJoined,
  setTeamId,
}) => {
  const [step, setStep] = useState(1)
  const [isChecked, setIsChecked] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [buttonText, setButtonText] = useState('완료')
  const [isSubmitting, setIsSubmitting] = useState(false) // 버튼 중복 클릭 방지
  const navigate = useNavigate()

  useEffect(() => {
    const storedIsJoined = localStorage.getItem(`isJoined-${sprintId}`)
    const storedTeamId = localStorage.getItem(`teamId-${sprintId}`)

    if (storedIsJoined === 'true' && storedTeamId) {
      setIsJoined(true)
      setTeamId(storedTeamId)
    }
  }, [sprintId, setIsJoined, setTeamId])

  const mutation = useMutation({
    mutationFn: () => joinSsaprint(sprintId, teamName),
    onSuccess: (data) => {
      setTeamId(data)
      localStorage.setItem(`teamId-${sprintId}`, data)
      setIsJoined(true)
      localStorage.setItem(`isJoined-${sprintId}`, 'true')
      setButtonText('신청 완료! 나의 싸프린트 노트로 이동하기!')
      setIsSubmitting(false) // 신청 완료 후 버튼 활성화

      alert('신청이 완료되었습니다.')

      if (window.confirm('나의 싸프린트 노트로 이동할까요?')) {
        navigate(`/my-sprints/${sprintId}`, {
          state: { sprintId, teamId: data },
        })
        onClose()
      }
    },
    onError: () => {
      alert('참가 신청 중 오류가 발생했습니다.')
      setButtonText('완료')
      setIsSubmitting(false) // 오류 발생 시 버튼 다시 활성화
    },
  })

  const handleNextStep = () => {
    if (!isChecked) {
      alert('동의해야 다음 단계로 진행할 수 있습니다.')
      return
    }
    setStep(2)
  }

  const handleJoinSprint = () => {
    if (!teamName.trim()) {
      alert('나의 싸프린트 이름을 입력해주세요.')
      return
    }
    setButtonText('신청 중...')
    setIsSubmitting(true) // 버튼 비활성화
    mutation.mutate()
  }

  const handleMoveToSprint = () => {
    const storedTeamId = localStorage.getItem(`teamId-${sprintId}`)

    if (sprintId && storedTeamId) {
      navigate(`/my-sprints/${sprintId}`, {
        state: { sprintId, teamId: storedTeamId },
      })
      onClose()
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

        {step === 1 ? (
          <>
            <h2 className="text-xl font-semibold text-blue-600 text-center">
              싸프린트 참여 신청 확인
            </h2>
            <p className="text-gray-800 mt-5 text-base text-center">
              싸프린트 신청은 취소가 불가능합니다. 아래 내용을 확인하고 신중히
              결정해주세요!
            </p>
            <ul className="mt-6 text-base text-gray-700 list-disc list-inside">
              <li>싸프린트 신청 후에는 취소 및 변경이 불가능합니다.</li>
              <li>싸프린트 기간 동안 적극적인 참여를 권장합니다.</li>
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
                onClick={handleNextStep}
                disabled={!isChecked}
              >
                싸프린트 참여하기
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-blue-600 text-center">
              나의 싸프린트 이름 설정하기
            </h2>
            <p className="text-gray-800 mt-5 text-base text-center">
              싸프린트 노트를 생성할 때, 노트의 이름을 설정할 수 있습니다.
            </p>
            <p className="text-gray-800 text-base text-center">
              원하는 이름을 입력해주세요!
            </p>
            <input
              type="text"
              className="w-full mt-4 p-3 border rounded-lg text-gray-800"
              placeholder="해당 싸프린트 노트명 입력"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <div className="mt-8 flex justify-center">
              <button
                className={`w-full py-3 px-5 rounded-lg font-medium text-white text-lg ${
                  isSubmitting || mutation.isLoading
                    ? 'bg-gray-400 cursor-not-allowed' // 신청 중이면 hover 제거 및 비활성화
                    : buttonText === '신청 완료! 나의 싸프린트 노트로 이동하기!'
                      ? 'bg-[#6BC26B] hover:bg-[#5AA65B]' // 신청 완료 후 초록색으로 변경
                      : 'bg-blue-600 hover:bg-blue-700' // 기본 버튼 색
                }`}
                onClick={
                  isSubmitting || mutation.isLoading
                    ? undefined
                    : buttonText === '신청 완료! 나의 싸프린트 노트로 이동하기!'
                      ? handleMoveToSprint
                      : handleJoinSprint
                }
                disabled={isSubmitting || mutation.isLoading} // 신청 중이면 클릭 불가
              >
                {buttonText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SprintParticipationModal
