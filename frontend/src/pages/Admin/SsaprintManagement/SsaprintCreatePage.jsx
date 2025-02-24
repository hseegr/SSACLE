import DateInput from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/DateInput'
import DetailsForm from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/DetailForm'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategorySelect from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/CategorySelect'
import CategoryModal from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/CategoryModal'
import { CirclePlus } from 'lucide-react'
import { useSsaprint } from '@/contexts/SsaprintContext'
import { useGptTodos } from '@/hooks/useGptTodos'
import { fetchCreateSsaprint } from '@/services/adminService'
import { useMutation } from '@tanstack/react-query'

const SsaprintCreate = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearLocalStorage,
    selectedMain,
    selectedMid,
    selectedSub,
    sprintName,
    transformSsaprintData,
    getTomorrowDate,
  } = useSsaprint()
  const [showDetails, setShowDetails] = useState(
    localStorage.getItem('showDetails') === 'true'
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const { triggerGptFetch, isPending } = useGptTodos()

  // 싸프린트 생성 Mutation
  const createSsaprint = useMutation({
    mutationFn: fetchCreateSsaprint, // ✅ mutationFn 사용
    onSuccess: (data) => {
      alert(`싸프린트 생성 완료! ID: ${data.ssaprintId}`)
      clearLocalStorage()
      navigate('/admin/ssaprint')
    },
    onError: (error) => {
      alert(
        `⚠️ 싸프린트 생성 실패: ${error.response?.data?.message || '알 수 없는 오류'}`
      )
    },
  })

  // 등록 버튼 클릭 시 API 호출
  const handleRegister = () => {
    if (!startDate || !endDate || !sprintName) {
      alert('⚠️ 모든 정보를 입력해야 합니다.')
      return
    }

    const formattedData = transformSsaprintData()
    // console.log("🔥 변환된 데이터:", formattedData) // 디버깅용 로그 추가

    if (!formattedData.categoryIds.length) {
      alert('⚠️ 카테고리 정보가 없습니다. 다시 선택해주세요.')
      return
    }
    createSsaprint.mutate(formattedData)
  }

  // 상세 정보 입력 폼 상태 변경 시 로컬스토리지 업데이트
  const toggleDetails = () => {
    if (showDetails) {
      localStorage.removeItem('showDetails')
      clearLocalStorage()
      navigate('/admin/ssaprint')
    } else {
      if (
        !startDate ||
        !endDate ||
        !selectedMain ||
        !selectedMid ||
        !selectedSub
      ) {
        alert('⚠️ 모든 정보를 입력해야 상세 정보를 생성할 수 있습니다.')
        return
      }

      setShowDetails(true)
      localStorage.setItem('showDetails', 'true')

      if (!isPending) {
        // console.log('🔥 [toggleDetails] GPT API 요청 실행')
        triggerGptFetch() // GPT API 요청 실행 (한 번만 실행)
      }
    }
  }

  // 뒤로가기 버튼 클릭 시 실행
  const handleGoBack = () => {
    clearLocalStorage()
    navigate('/admin/ssaprint')
  }

  return (
    <div className="min-w-max min-h-screen bg-white flex flex-col items-center py-10 shrink-0">
      <h1 className="text-center text-ssacle-blue text-2xl font-bold">
        새로운 싸프린트
      </h1>
      <p className="text-ssacle-gray text-sm mt-2">
        입력된 정보는 자동 저장됩니다. 초기화를 원한다면 뒤로가기를 눌러주세요!
      </p>

      <div className="w-3/5 mt-8">
        <h2 className="text-ssacle-black text-lg font-bold">기본 정보 입력</h2>
        <p className="text-ssacle-blue text-sm">
          카테고리 생성은 해당 카테고리가 없는지 한번 더 확인한 후 진행해주세요!
        </p>
        <div className="border-t-4 border-ssacle-gray-sm my-4"></div>

        <CategorySelect disabled={showDetails} />

        {/* + 버튼 추가 */}
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center text-ssacle-blue hover:text-blue-700 transition-colors text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <CirclePlus size={16} color="#5195F7" className="mr-2" />
            카테고리 추가
          </button>
        </div>

        <div className="flex justify-between mt-4">
          <DateInput
            label="시작일"
            value={startDate}
            setValue={setStartDate}
            min={getTomorrowDate()}
            disabled={showDetails}
          />
          <DateInput
            label="종료일"
            value={endDate}
            setValue={setEndDate}
            min={
              startDate
                ? new Date(
                    new Date(startDate).setDate(
                      new Date(startDate).getDate() + 2
                    )
                  )
                    .toISOString()
                    .split('T')[0]
                : ''
            } // 시작일 +1일 설정
            max={
              startDate
                ? new Date(
                    new Date(startDate).setDate(
                      new Date(startDate).getDate() + 7
                    )
                  )
                    .toISOString()
                    .split('T')[0]
                : ''
            } // 시작일 +6일 설정
            disabled={showDetails || !startDate}
          />
        </div>
        <p className="text-ssacle-gray text-sm pl-3">
          날짜는 달력 버튼을 눌러 선택해주세요!
        </p>
      </div>

      <div className="border-t-2 border-ssacle-gray-sm my-8 w-3/5"></div>

      {showDetails && <DetailsForm />}

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={showDetails ? handleRegister : toggleDetails}
          className="w-60 bg-ssacle-blue text-white text-lg font-bold rounded-full py-3"
        >
          {showDetails ? '등록' : '상세 정보 생성하기'}
        </button>
        <button
          onClick={handleGoBack}
          className="w-60 bg-ssacle-sky text-ssacle-black text-lg rounded-full py-3"
        >
          뒤로가기
        </button>
      </div>

      {/* 모달 창 렌더링 */}
      {isModalOpen && <CategoryModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default SsaprintCreate
