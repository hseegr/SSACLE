import { useSsaprint } from '@/contexts/SsaprintContext'
import { useGptTodos } from '@/hooks/useGptTodos'
import { RingLoader } from 'react-spinners'
import { useState, useEffect } from 'react'

const DetailsForm = () => {
  const {
    description,
    setDescription,
    sprintName,
    setSprintName,
    maxParticipants,
    setMaxParticipants,
  } = useSsaprint()
  const { data: gptData, isPending, isError } = useGptTodos()
  const [isDataUpdated, setIsDataUpdated] = useState(false)

  // GPT 데이터를 description 상태에 저장
  useEffect(() => {
    // 데이터가 존재하고, API 로딩이 끝난 상태에서만 실행
    if (gptData && !isPending && !isDataUpdated) {
      console.log('🔥 GPT 응답 데이터 (useEffect 내부):', gptData)
      setDescription((prev) => {
        const newDescription = {
          basicDescription:
            gptData.basicDescription || prev.basicDescription || '',
          detailDescription:
            gptData.detailDescription || prev.detailDescription || '',
          recommendedFor: gptData.recommendedFor || prev.recommendedFor || '',
          todos: gptData.todos
            ? gptData.todos
                .map((todo) => `${todo.date}: ${todo.tasks.join(', ')}`)
                .join('\n')
            : prev.todos || '',
        }
        console.log(
          '🔥 컨텍스트 업데이트 실행 (setDescription):',
          newDescription
        )
        return newDescription
      })
      setIsDataUpdated(true) // 한 번만 실행되도록 설정
    }
  }, [gptData, isPending, isDataUpdated, setDescription])

  // GPT 데이터 로딩 중이면 로딩 스피너 표시
  if (isPending) {
    return (
      <div className="w-3/5 py-8 flex justify-center">
        <RingLoader color="#5195F7" size={40} />
      </div>
    )
  }

  if (isError) return <p>❌ GPT 데이터를 불러오지 못했습니다.</p>

  return (
    <div className="w-3/5 py-8">
      <h2 className="text-ssacle-black text-lg font-bold">세부 정보 입력</h2>
      <div className='mt-4'>
        {/* 싸프린트 이름 입력 */}
        <div>
          <label className="text-ssacle-black text-sm font-bold">
            싸프린트 이름
          </label>
          <input
            type="text"
            maxLength={100}
            className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto text-ssacle-black text-sm"
            value={sprintName}
            onChange={(e) => setSprintName(e.target.value)}
            />
        </div>
        {/* 최대 인원 수 입력 */}
        <div className='mt-4'>
          <label className="text-ssacle-black text-sm font-bold">
            최대 인원 수 <span className="text-ssacle-gray text-xs">(2인 ~ 4인)</span>
          </label>
          <input
            type="number"
            min={2}
            max={4}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Math.min(4, Math.max(2, Number(e.target.value))))}
            className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto text-ssacle-black text-sm"
          />
        </div>
      </div>
      {[
        { label: '기본 설명', key: 'basicDescription' },
        { label: '상세 설명', key: 'detailDescription' },
        { label: '권장 사항', key: 'recommendedFor' },
        { label: 'Todos', key: 'todos', rows: 5 },
      ].map(({ label, key, rows = 2 }) => (
        <div key={key} className="mt-4">
          <label className="text-ssacle-black text-sm font-bold">{label}</label>
          <textarea
            className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto text-ssacle-black text-sm"
            rows={rows}
            value={description?.[key] || ''}
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
