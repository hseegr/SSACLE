import { createContext, useContext, useState } from 'react'

// 🔥 Context 생성
const SsaprintContext = createContext()

// 🔥 Provider 컴포넌트
export const SsaprintProvider = ({ children }) => {
  const [selectedMain, setSelectedMain] = useState('')
  const [selectedMid, setSelectedMid] = useState('')
  const [selectedSub, setSelectedSub] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 🔥 목데이터 추가 (기본 설명, 상세 설명, 권장 사항, todos)
  const [description, setDescription] = useState({
    basic: '기본 설명 예제 데이터입니다.',
    detailed: '상세 설명 예제 데이터입니다.',
    recommended: '권장 사항 예제 데이터입니다.',
    todos: 'TODO 리스트 예제 데이터입니다.',
  })

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
        setStartDate,
        endDate,
        setEndDate,
        description, // 🔥 추가
        setDescription, // 🔥 추가
      }}
    >
      {children}
    </SsaprintContext.Provider>
  )
}


// Context 사용을 위한 Hook
export const useSsaprint = () => useContext(SsaprintContext)
