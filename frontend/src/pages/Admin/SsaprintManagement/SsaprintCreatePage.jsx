import DateInput from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/DateInput'
import DetailsForm from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/DetailForm'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategorySelect from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/CategorySelect'
import CategoryModal from '@/components/AdminPage/SsaprintManagement/SsaprintCreate/CategoryModal'
import { CirclePlus } from 'lucide-react'

const SsaprintCreate = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showDetails, setShowDetails] = useState(
    localStorage.getItem('showDetails') === 'true'
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  
  // 상세 정보 입력 폼 상태 변경 시 로컬스토리지 업데이트
  const toggleDetails = () => {
    if (showDetails) {
      localStorage.removeItem('showDetails')
      navigate('/admin/user')
    } else {
      setShowDetails(true)
      localStorage.setItem('showDetails', 'true')
    }
  }

  return (
    <div className="min-w-max min-h-screen bg-white flex flex-col items-center py-10 shrink-0">
      <h1 className="text-center text-ssacle-blue text-2xl font-bold">
        새로운 싸프린트
      </h1>

      <div className="w-3/5 mt-8">
        <h2 className="text-ssacle-black text-lg font-bold">기본 정보 입력</h2>
        <p className="text-ssacle-blue text-sm">
          카테고리 생성은 해당 카테고리가 없는지 한번 더 확인한 후 진행해주세요!
        </p>
        <div className="border-t-4 border-ssacle-gray-sm my-4"></div>

        <div className="flex flex-wrap justify-between">
          <CategorySelect />
        </div>

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
          <DateInput label="시작일" value={startDate} setValue={setStartDate} />
          <DateInput
            label="종료일"
            value={endDate}
            setValue={setEndDate}
            min={startDate}
            disabled={!startDate}
          />
        </div>
      </div>

      <div className="border-t-2 border-ssacle-gray-sm my-8 w-3/5"></div>

      {showDetails && <DetailsForm />}

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={toggleDetails}
          className="w-60 bg-ssacle-blue text-white text-lg font-bold rounded-full py-3"
        >
          {showDetails ? '등록' : '상세 정보 생성하기'}
        </button>
        <button className="w-60 bg-ssacle-sky text-ssacle-black text-lg rounded-full py-3">
          뒤로가기
        </button>
      </div>

      {/* 모달 창 렌더링 */}
      {isModalOpen && <CategoryModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default SsaprintCreate
