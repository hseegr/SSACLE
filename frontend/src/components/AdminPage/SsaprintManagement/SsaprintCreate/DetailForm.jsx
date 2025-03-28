import { useSsaprint } from '@/contexts/SsaprintContext'
import { useGptTodos } from '@/hooks/useGptTodos'
import { RingLoader } from 'react-spinners'
import { useState, useEffect } from 'react'
import { data } from 'react-router-dom'

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
    // gptData가 존재하고, API 로딩이 끝난 상태에서만 실행
    if (gptData && !isPending && !isDataUpdated) {
      setDescription((prev) => {
        const newDescription = {
          basicDescription:
            gptData.basicDescription || prev.basicDescription || '',
          detailDescription:
            gptData.detailDescription || prev.detailDescription || '',
          recommendedFor: gptData.recommendedFor || prev.recommendedFor || '',
          todos: Array.isArray(gptData.todos) // 🔥 gptData.todos가 배열인지 확인
            ? gptData.todos
                .map((todo) => `${todo.date}: ${todo.tasks.join(', ')}`)
                .join('\n')
            : typeof gptData.todos === 'string' // 🔥 문자열이면 그대로 사용
              ? gptData.todos
              : prev.todos || '', // 🔥 잘못된 데이터라면 이전 값 유지
        }
        return newDescription
      })
      setIsDataUpdated(true) // 한 번만 실행되도록 설정
    }
  }, [gptData, isPending, isDataUpdated, setDescription])

  // description.todos를 날짜별로 분리하고 가공
  const parseTodos = () => {
    if (!description.todos || typeof description.todos !== 'string') return []
    console.log('description.todos:', description.todos)
    console.log('type of description.todos:', typeof description.todos)

    return description.todos.split('\n').map((entry, index) => {
      const [date, tasks] = entry.split(': ')
      return {
        dayLabel: `DAY ${String(index + 1).padStart(2, '0')}`,
        date: date.trim(),
        tasks: tasks ? tasks.split(', ').map((task) => task.trim()) : [],
      }
    })
  }

  const formattedTodos = parseTodos()

  // 할 일(task) 변경 핸들러
  const handleTaskChange = (dayIndex, taskIndex, value) => {
    setDescription((prev) => {
      const updatedTodos = parseTodos()
      updatedTodos[dayIndex].tasks[taskIndex] = value

      // 다시 원본 형식으로 변환해서 저장
      const updatedTodosString = updatedTodos
        .map((todo) => `${todo.date}: ${todo.tasks.join(', ')}`)
        .join('\n')

      return { ...prev, todos: updatedTodosString }
    })
  }

  // 새로운 할 일 추가 기능
  const handleAddTask = (dayIndex) => {
    setDescription((prev) => {
      const updatedTodos = parseTodos()
      updatedTodos[dayIndex].tasks.push('') // 새로운 할 일 추가

      const updatedTodosString = updatedTodos
        .map((todo) => `${todo.date}: ${todo.tasks.join(', ')}`)
        .join('\n')

      return { ...prev, todos: updatedTodosString }
    })
  }

  // 🗑️ 특정 할 일 삭제 기능 추가
  const handleRemoveTask = (dayIndex, taskIndex) => {
    setDescription((prev) => {
      const updatedTodos = parseTodos()
      updatedTodos[dayIndex].tasks.splice(taskIndex, 1) // 특정 인덱스의 할 일 삭제

      const updatedTodosString = updatedTodos
        .map((todo) => `${todo.date}: ${todo.tasks.join(', ')}`)
        .join('\n')

      return { ...prev, todos: updatedTodosString }
    })
  }

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
      <p className="text-ssacle-blue text-sm">
        싸프린트 이름과 인원 수를 제외한 내용은 AI가 채워줘요 😊
      </p>
      <p className="text-ssacle-gray text-sm">
        AI가 채워준 내용은 직접 수정할 수 있어요. 자유롭게 수정한 후
        등록해주세요!
      </p>
      <div className="mt-4">
        {/* 싸프린트 이름 입력 */}
        <div>
          <label className="text-ssacle-black text-sm font-bold">
            싸프린트 이름{' '}
            <span className="text-ssacle-gray text-xs">(20자 이내)</span>
          </label>
          <input
            type="text"
            maxLength={20}
            className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto text-ssacle-black text-sm"
            value={sprintName}
            onChange={(e) => setSprintName(e.target.value)}
          />
        </div>
        {/* 최대 인원 수 입력 */}
        <div className="mt-4">
          <label className="text-ssacle-black text-sm font-bold">
            최대 인원 수{' '}
            <span className="text-ssacle-gray text-xs">(2인 ~ 4인)</span>{' '}
            <span className="text-ssacle-gray text-xs font-medium">
              {' '}
              tip. 방향키를 이용하면 입력이 편해요!
            </span>
          </label>
          <input
            type="number"
            min={2}
            max={4}
            value={maxParticipants}
            onChange={(e) =>
              setMaxParticipants(
                Math.min(4, Math.max(2, Number(e.target.value)))
              )
            }
            className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto text-ssacle-black text-sm"
          />
        </div>
      </div>
      {/* 🔥 기본 설명 / 상세 설명 / 권장 사항 */}
      {[
        { label: '기본 설명', key: 'basicDescription' },
        { label: '상세 설명', key: 'detailDescription' },
        { label: '권장 사항', key: 'recommendedFor' },
      ].map(({ label, key, rows = 2 }) => (
        <div key={key} className="mt-4">
          <label className="text-ssacle-black text-sm font-bold">{label}</label>
          {!description[key] ? ( // 값이 없으면 개별적으로 RingLoader 표시
            <div className="w-full flex justify-center p-3">
              <RingLoader color="#5195F7" size={20} />
            </div>
          ) : (
            <textarea
              className="w-full p-3 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md resize-none overflow-y-auto text-ssacle-black text-sm"
              rows={rows}
              value={description?.[key] || ''}
              onChange={(e) =>
                setDescription((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          )}
        </div>
      ))}

      {/* 📝 Todos 목록 */}
      <h3 className="text-ssacle-black text-sm font-bold mt-6">Todos</h3>
      {!description.todos ? (
        <div className="w-full flex justify-center p-3">
          <RingLoader color="#5195F7" size={20} />
        </div>
      ) : (
        formattedTodos.map((todo, dayIndex) => (
          <div
            key={dayIndex}
            className="mt-4 p-4 border border-ssacle-gray-sm rounded-md"
          >
            <h4 className="text-ssacle-blue text-sm font-bold">
              {todo.dayLabel} ({todo.date})
            </h4>
            {todo.tasks.map((task, taskIndex) => (
              <div key={taskIndex} className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full p-2 border border-ssacle-gray-sm focus:outline-ssacle-blue rounded-md text-ssacle-black text-sm"
                  value={task}
                  onChange={(e) =>
                    handleTaskChange(dayIndex, taskIndex, e.target.value)
                  }
                />
                {/* 🗑️ 삭제 버튼 추가 */}
                <button
                  className="ml-2 text-red-500 hover:text-red-700 text-sm font-bold"
                  onClick={() => handleRemoveTask(dayIndex, taskIndex)}
                >
                  X
                </button>
              </div>
            ))}
            {/* "+" 버튼 추가 */}
            <button
              className="mt-2 text-ssacle-blue text-sm font-bold hover:underline"
              onClick={() => handleAddTask(dayIndex)}
            >
              + 할 일 추가
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default DetailsForm
