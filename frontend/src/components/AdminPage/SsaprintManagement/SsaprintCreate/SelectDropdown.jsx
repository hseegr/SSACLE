import { useSsaprint } from '@/contexts/SsaprintContext'

const SelectDropdown = ({ label, type, options }) => {
  const {
    selectedMain,
    setSelectedMain,
    selectedMid,
    setSelectedMid,
    selectedSub,
    setSelectedSub,
  } = useSsaprint()

  // 🔥 드롭다운 값 변경 핸들러
  const handleChange = (e) => {
    const value = e.target.value

    if (type === 'main') {
      setSelectedMain(value)
      setSelectedMid('') // 🔥 대주제 변경 시 중주제 초기화
      setSelectedSub('') // 🔥 대주제 변경 시 소주제 초기화
    } else if (type === 'mid') {
      setSelectedMid(value)
      setSelectedSub('') // 🔥 중주제 변경 시 소주제 초기화
    } else if (type === 'sub') {
      setSelectedSub(value)
    }
  }

  const getValue = () => {
    if (type === 'main') return selectedMain
    if (type === 'mid') return selectedMid
    if (type === 'sub') return selectedSub
    return ''
  }

  return (
    <div className="relative w-[30%]">
      <label className="text-ssacle-black text-sm font-bold">{label}</label>
      <select
        className={`w-full bg-ssacle-gray-sm rounded-full p-3 appearance-none focus:outline-ssacle-blue pr-8 ${
          getValue() ? 'text-ssacle-blue' : 'text-ssacle-gray'
        }`}
        value={getValue()}
        onChange={handleChange}
        disabled={options.length === 0} // 🔥 옵션 없을 때 비활성화
      >
        <option value="" disabled>
          선택하세요
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectDropdown
