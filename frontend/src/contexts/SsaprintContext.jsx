import { createContext, useContext, useState, useEffect } from 'react'

const DEFAULT_END_TIME = 'T20:00:00'
const DEFAULT_START_TIME = 'T00:00:00'

// Context 생성
const SsaprintContext = createContext()

// Provider 컴포넌트
export const SsaprintProvider = ({ children }) => {
  // localStorage에서 데이터 불러오기 (초기값 설정)
  const getStoredData = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : defaultValue
  }

  const [selectedMain, setSelectedMain] = useState(
    getStoredData('selectedMain', { id: null, name: '' })
  )
  const [selectedMid, setSelectedMid] = useState(
    getStoredData('selectedMid', { id: null, name: '' })
  )
  const [selectedSub, setSelectedSub] = useState(
    getStoredData('selectedSub', { id: null, name: '' })
  )

  // LocalDateTime 변환 함수 (종료 날짜는 20:00:00 설정)
  const formatToLocalDateTime = (dateString, isEndDate = false) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const timePart = isEndDate ? 'T20:00:00.000' : 'T00:00:00.000'
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}${timePart}`
  }

  // 화면 출력용 (YYYY-MM-DD)
  const formatToDisplayDate = (dateString) => {
    if (!dateString) return ''
    if (dateString.includes('T')) return dateString.split('T')[0] // LocalDateTime 형식이면 변환
    return dateString
  }

  // 시작 날짜 최소값 (내일)
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // 날짜 상태 저장
  const [rawStartDate, setRawStartDate] = useState(
    getStoredData('startDate', '')
  )
  const [rawEndDate, setRawEndDate] = useState(getStoredData('endDate', ''))

  // context에 LocalDateTime 형식으로 저장
  const startDate = rawStartDate ? formatToLocalDateTime(rawStartDate) : ''
  const endDate = rawEndDate ? formatToLocalDateTime(rawEndDate, true) : ''

  // 싸프린트 이름, 최대 인원 수
  const [sprintName, setSprintName] = useState(getStoredData('sprintName', ''))
  const [maxParticipants, setMaxParticipants] = useState(
    getStoredData('maxParticipants', 1)
  )

  // GPT 데이터가 저장될 description 상태
  const [description, setDescription] = useState(
    getStoredData('description', {
      basicDescription: '',
      detailDescription: '',
      recommendedFor: '',
      todos: '',
    })
  )
  // 변경될 때 localStorage에 저장 (자동 저장)
  useEffect(() => {
    localStorage.setItem('selectedMain', JSON.stringify(selectedMain))
    localStorage.setItem('selectedMid', JSON.stringify(selectedMid))
    localStorage.setItem('selectedSub', JSON.stringify(selectedSub))
    localStorage.setItem('startDate', JSON.stringify(rawStartDate))
    localStorage.setItem('endDate', JSON.stringify(rawEndDate))
    localStorage.setItem('sprintName', JSON.stringify(sprintName))
    localStorage.setItem('maxParticipants', JSON.stringify(maxParticipants))
    localStorage.setItem('description', JSON.stringify(description))
  }, [
    selectedMain,
    selectedMid,
    selectedSub,
    rawStartDate,
    rawEndDate,
    sprintName,
    maxParticipants,
    description,
  ])

  // 등록 버튼 클릭 시 로컬스토리지 초기화
  const clearLocalStorage = () => {
    console.log('🔥 로컬스토리지 삭제')
    localStorage.removeItem('selectedMain')
    localStorage.removeItem('selectedMid')
    localStorage.removeItem('selectedSub')
    localStorage.removeItem('startDate')
    localStorage.removeItem('endDate')
    localStorage.removeItem('sprintName')
    localStorage.removeItem('maxParticipants')
    localStorage.removeItem('description')
    localStorage.removeItem('showDetails')

    // 컨텍스트도 초기화
    setSelectedMain({ id: null, name: '' })
    setSelectedMid({ id: null, name: '' })
    setSelectedSub({ id: null, name: '' })
    setRawStartDate('')
    setRawEndDate('')
    setSprintName('')
    setMaxParticipants(1)
    setDescription({
      // description 초기화 추가
      basicDescription: '',
      detailDescription: '',
      recommendedFor: '',
      todos: '',
    })
  }

  return (
    <SsaprintContext.Provider
      value={{
        selectedMain,
        setSelectedMain,
        selectedMid,
        setSelectedMid,
        selectedSub,
        setSelectedSub,
        startDate,
        setStartDate: setRawStartDate,
        endDate,
        setEndDate: setRawEndDate,
        getTomorrowDate, // 최소 시작 날짜
        formatToDisplayDate, // 날짜 표시용 포맷 함수
        description,
        setDescription,
        clearLocalStorage,
        sprintName,
        setSprintName,
        maxParticipants,
        setMaxParticipants,
      }}
    >
      {children}
    </SsaprintContext.Provider>
  )
}

// Context 사용을 위한 Hook
export const useSsaprint = () => useContext(SsaprintContext)
