import { useSsaprint } from '@/contexts/SsaprintContext'

const DetailsForm = () => {
  const { description, setDescription } = useSsaprint()

  // 🔥 만약 description이 없을 경우 기본값 설정
  const defaultDescription = {
    basic: '기본 설명 예제 데이터입니다.',
    detailed: '상세 설명 예제 데이터입니다.',
    recommended: '권장 사항 예제 데이터입니다.',
    todos: 'TODO 리스트 예제 데이터입니다.',
  }

  return (
    <div className="w-3/5 py-8">
      <h2 className="text-ssacle-black text-lg font-bold">세부 정보 입력</h2>

      {[
        { label: '기본 설명', key: 'basic' },
        { label: '상세 설명', key: 'detailed' },
        { label: '권장 사항', key: 'recommended' },
        { label: 'Todos', key: 'todos', rows: 5 },
      ].map(({ label, key, rows = 2 }) => (
        <div key={key} className="mt-4">
          <label className="text-ssacle-black text-sm font-bold">{label}</label>
          <textarea
            className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto"
            rows={rows}
            value={description?.[key] || defaultDescription[key]} // 🔥 기본값 제공
            onChange={(e) =>
              setDescription((prev) => ({ ...prev, [key]: e.target.value }))
            }
          />
        </div>
      ))}
    </div>
  )
}

export default DetailsForm
