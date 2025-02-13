import { createContext, useContext, useState } from 'react'

// 🔥 Context 생성
const SsaprintContext = createContext()

// 🔥 Provider 컴포넌트
export const SsaprintProvider = ({ children }) => {
  const [selectedMain, setSelectedMain] = useState({ id: null, name: '' });
  const [selectedMid, setSelectedMid] = useState({ id: null, name: '' });
  const [selectedSub, setSelectedSub] = useState({ id: null, name: '' });
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 🔥 LocalDateTime 변환 함수
  const formatToLocalDateTime = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00`;
  };

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
        startDate: formatToLocalDateTime(startDate),
        setStartDate,
        endDate: formatToLocalDateTime(endDate),
        setEndDate,
        description,
        setDescription,
      }}
    >
      {children}
    </SsaprintContext.Provider>
  )
}


// Context 사용을 위한 Hook
export const useSsaprint = () => useContext(SsaprintContext)
