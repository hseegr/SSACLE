import { useState } from 'react'

const SaaprintCreate = () => {
  const [selectedMain, setSelectedMain] = useState('')
  const [selectedMid, setSelectedMid] = useState('')
  const [selectedSub, setSelectedSub] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isStartDateSelected, setIsStartDateSelected] = useState(false)
  const [isEndDateSelected, setIsEndDateSelected] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // 시작일 변경 핸들러
  const handleStartDateChange = (e) => {
    const selectedDate = new Date(e.target.value)
    setStartDate(e.target.value)

    if (selectedDate) {
      const minEndDate = new Date(selectedDate)
      minEndDate.setDate(minEndDate.getDate() + 1) // 시작일 + 1일
      const maxEndDate = new Date(selectedDate)
      maxEndDate.setDate(maxEndDate.getDate() + 6) // 시작일 + 6일

      setIsEndDateSelected(false) //🔥 종료일 입력 초기화
      document.getElementById('endDate').min = minEndDate
        .toISOString()
        .split('T')[0]
      document.getElementById('endDate').max = maxEndDate
        .toISOString()
        .split('T')[0]
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
          <div className="relative w-[30%]">
            <select
              className={`w-full bg-ssacle-gray-sm rounded-full p-3 appearance-none focus:outline-ssacle-blue pr-8 ${selectedMain ? 'text-ssacle-blue' : 'text-ssacle-gray'}`}
              value={selectedMain}
              onChange={(e) => setSelectedMain(e.target.value)}
            >
              <option value="" disabled>
                대주제를 선택하세요
              </option>
              <option value="option1">옵션 1</option>
              <option value="option2">옵션 2</option>
            </select>
            <span className="absolute right-3 top-3 text-ssacle-gray">▼</span>
          </div>
          <div className="relative w-[30%]">
            <select
              className={`w-full bg-ssacle-gray-sm rounded-full p-3 appearance-none focus:outline-ssacle-blue pr-8 ${selectedMid ? 'text-ssacle-blue' : 'text-ssacle-gray'} pl-5`}
              value={selectedMid}
              onChange={(e) => setSelectedMid(e.target.value)}
            >
              <option value="" disabled>
                중주제를 선택하세요
              </option>
              <option value="option1">옵션 1</option>
              <option value="option2">옵션 2</option>
            </select>
            <span className="absolute right-3 top-3 text-ssacle-gray">▼</span>
          </div>
          <div className="relative w-[30%]">
            <select
              className={`w-full bg-ssacle-gray-sm rounded-full p-3 appearance-none focus:outline-ssacle-blue pr-8 ${selectedSub ? 'text-ssacle-blue' : 'text-ssacle-gray'}`}
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
            >
              <option value="" disabled>
                소주제를 선택하세요
              </option>
              <option value="option1">옵션 1</option>
              <option value="option2">옵션 2</option>
            </select>
            <span className="absolute right-3 top-3 text-ssacle-gray">▼</span>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <div className="relative w-[48%]">
            <input
              type="date"
              className={`w-full bg-ssacle-gray-sm rounded-full p-3 cursor-pointer focus:outline-ssacle-blue transition-colors duration-200 ${
                startDate ? 'text-ssacle-blue' : 'text-ssacle-gray'
              }`}
              value={startDate}
              onChange={handleStartDateChange}
            />
            {/*🔥 선택 여부에 따라 색상 변경*/}
          </div>
          <div className="relative w-[48%]">
            <input
              type="date"
              id="endDate"
              className={`w-full bg-ssacle-gray-sm rounded-full p-3 cursor-pointer focus:outline-ssacle-blue transition-colors duration-200 ${
                endDate ? 'text-ssacle-blue' : 'text-ssacle-gray'
              }`}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setIsEndDateSelected(true)
              }}
              disabled={!startDate}
            />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-ssacle-gray-sm my-8 w-3/5"></div>

      {showDetails && ( //🔥 상세 정보 입력 폼 표시
        <div className="w-3/5 py-8">
          <h2 className="text-ssacle-black text-lg font-bold">
            세부 정보 입력
          </h2>
          <div className="mt-4">
            <label className="text-ssacle-black text-sm font-bold">
              기본 설명
            </label>
            <input className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md" />
          </div>
          <div className="mt-4">
            <label className="text-ssacle-black text-sm font-bold">
              상세 설명
            </label>
            <textarea
              className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto"
              rows={2}
            />
          </div>
          <div className="mt-4">
            <label className="text-ssacle-black text-sm font-bold">
              권장 사항
            </label>
            <textarea
              className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto"
              rows={2}
            />
          </div>
          <div className="mt-4">
            <label className="text-ssacle-black text-sm font-bold">Todos</label>
            <textarea
              className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto"
              rows={5}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-60 bg-ssacle-blue text-white text-lg font-bold rounded-full py-3"
        >
          {showDetails ? '등록' : '상세 정보 생성하기'}
        </button>
        <button className="w-60 bg-ssacle-sky text-ssacle-black text-lg rounded-full py-3">
          뒤로가기
        </button>
      </div>
    </div>
  )
}

export default SaaprintCreate
