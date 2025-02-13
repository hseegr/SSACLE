import { useSsaprint } from '@/contexts/SsaprintContext'

const SelectDropdown = ({ label, value, setValue, options }) => {
  return (
    <div className="relative w-[30%]">
      <label className="text-ssacle-black text-sm font-bold">{label}</label>
      <select
        className={`w-full bg-ssacle-gray-sm rounded-full p-3 appearance-none focus:outline-ssacle-blue pr-8 ${
          value ? 'text-ssacle-blue' : 'text-ssacle-gray'
        }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
